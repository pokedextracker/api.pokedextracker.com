package dexes

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/auth"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/dextypes"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/errcodes"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/games"
)

type handler struct {
	dexService     *Service
	dexTypeService *dextypes.Service
	gameService    *games.Service
}

func (h *handler) create(c echo.Context) error {
	ctx := c.Request().Context()
	session := auth.FromContext(c)

	username := c.Param("username")

	params := createParams{}
	if err := c.Bind(&params); err != nil {
		return errors.WithStack(err)
	}

	// Validate that this user has permissions to create a new dex.
	if username != session.Username {
		return errcodes.Forbidden("creating a dex for this user")
	}

	// Ensure that the slug isn't empty.
	if params.Slug == "" {
		return errcodes.EmptySlug()
	}

	// Make sure a dex with this slug doesn't already exist for this user.
	existing, err := h.dexService.RetrieveDex(ctx, RetrieveDexOptions{
		Username: &username,
		Slug:     &params.Slug,
	})
	if err != nil && !errors.Is(err, errcodes.NotFound("dex")) {
		// We're expecting the not found error, so if we get one that different from that, it's a real error.
		return errors.WithStack(err)
	}
	if existing != nil {
		return errcodes.ExistingDex()
	}

	// Fetch the provided game and dex type to make sure they exist, but also to compare their game family IDs.
	game, err := h.gameService.RetrieveGame(ctx, games.RetrieveGameOptions{
		ID: &params.Game,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	dexType, err := h.dexTypeService.RetrieveDexType(ctx, dextypes.RetrieveDexTypeOptions{
		ID: &params.DexType,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	// It's not possible through the frontend, but weird things can happen if the game and dex type don't match.
	if game.GameFamilyID != dexType.GameFamilyID {
		return errcodes.GameDexTypeMismatch()
	}

	// Save the dex.
	dex := &Dex{
		UserID:    session.ID,
		Title:     params.Title,
		Slug:      params.Slug,
		Shiny:     *params.Shiny,
		GameID:    params.Game,
		DexTypeID: params.DexType,
	}
	err = h.dexService.CreateDex(ctx, dex)
	if err != nil {
		return errors.WithStack(err)
	}

	// Reload the model.
	dex, err = h.dexService.RetrieveDex(ctx, RetrieveDexOptions{
		ID: &dex.ID,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	return errors.WithStack(c.JSON(http.StatusOK, dex))
}

func (h *handler) retrieve(c echo.Context) error {
	ctx := c.Request().Context()

	username := c.Param("username")
	slg := c.Param("slug")

	dex, err := h.dexService.RetrieveDex(ctx, RetrieveDexOptions{
		Username: &username,
		Slug:     &slg,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	return errors.WithStack(c.JSON(http.StatusOK, dex))
}

func (h *handler) delete(c echo.Context) error {
	ctx := c.Request().Context()
	session := auth.FromContext(c)

	username := c.Param("username")
	slg := c.Param("slug")

	if username != session.Username {
		return errcodes.Forbidden("deleting a dex for this user")
	}

	dex, err := h.dexService.RetrieveDex(ctx, RetrieveDexOptions{
		Username: &username,
		Slug:     &slg,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	err = h.dexService.DeleteDex(ctx, DeleteDexOptions{
		ID:     dex.ID,
		UserID: dex.UserID,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	return errors.WithStack(c.JSONBlob(http.StatusOK, []byte(`{"deleted":true}`)))
}
