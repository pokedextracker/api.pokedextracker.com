package captures

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/dexes"
)

type handler struct {
	captureService *Service
	dexService     *dexes.Service
}

func (h *handler) list(c echo.Context) error {
	ctx := c.Request().Context()

	username := c.Param("username")
	slug := c.Param("slug")

	dex, err := h.dexService.RetrieveDex(ctx, dexes.RetrieveDexOptions{
		Username:              &username,
		Slug:                  &slug,
		IncludeDexTypePokemon: true,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	trueCaptures, err := h.captureService.ListCaptures(ctx, ListCapturesOptions{
		DexID:     &dex.ID,
		DexTypeID: &dex.DexTypeID,
	})
	if err != nil {
		return errors.WithStack(err)
	}
	trueCapturesMap := map[int]*Capture{}
	for _, trueCapture := range trueCaptures {
		trueCapturesMap[trueCapture.PokemonID] = trueCapture
	}

	captures := make([]*Capture, 0, len(dex.DexType.Pokemon))
	for _, pokemon := range dex.DexType.Pokemon {
		if capture, ok := trueCapturesMap[pokemon.ID]; ok {
			// This capture is true, and we have the real model that we can add to our list.
			captures = append(captures, capture)
			continue
		}

		// This capture is false, so we need to create a stub of a capture to be displayed.
		captures = append(captures, &Capture{
			DexID:     dex.ID,
			PokemonID: pokemon.ID,
			Pokemon: &Pokemon{
				ID:           pokemon.ID,
				NationalID:   pokemon.NationalID,
				Name:         pokemon.Name,
				GameFamilyID: pokemon.GameFamilyID,
				GameFamily:   pokemon.GameFamily,
				Form:         pokemon.Form,
				Box:          pokemon.Box,
				DexNumber:    pokemon.DexNumber,
			},
			Captured: false,
		})
	}

	return errors.WithStack(c.JSON(http.StatusOK, captures))
}
