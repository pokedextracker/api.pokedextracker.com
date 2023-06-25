package users

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/auth"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/config"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/errcodes"
	"github.com/robinjoseph08/golib/pointerutil"
	"golang.org/x/crypto/bcrypt"
)

type handler struct {
	authService *auth.Service
	config      *config.Config
	userService *Service
}

func (h *handler) retrieve(c echo.Context) error {
	ctx := c.Request().Context()

	username := c.Param("username")

	user, err := h.userService.RetrieveUser(ctx, RetrieveUserOptions{
		Username: &username,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	return errors.WithStack(c.JSON(http.StatusOK, user))
}

func (h *handler) list(c echo.Context) error {
	ctx := c.Request().Context()

	params := listParams{}
	if err := c.Bind(&params); err != nil {
		return errors.WithStack(err)
	}

	users, err := h.userService.ListUsers(ctx, ListUsersOptions{
		Limit:  &params.Limit,
		Offset: &params.Offset,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	return errors.WithStack(c.JSON(http.StatusOK, users))
}

func (h *handler) update(c echo.Context) error {
	ctx := c.Request().Context()
	session := auth.FromContext(c)

	username := c.Param("username")

	params := updateParams{}
	if err := c.Bind(&params); err != nil {
		return errors.WithStack(err)
	}

	// Validate that this user has permissions to update this user.
	if username != session.Username {
		return errcodes.Forbidden("updating this user")
	}

	user, err := h.userService.RetrieveUser(ctx, RetrieveUserOptions{
		Username: &username,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	options := UpdateUserOptions{
		Columns: []string{},
	}

	if params.Password != nil {
		hash, err := bcrypt.GenerateFromPassword([]byte(*params.Password), h.config.BcryptCost)
		if err != nil {
			return errors.WithStack(err)
		}
		user.Password = string(hash)
		options.Columns = append(options.Columns, "password")
	}
	if params.FriendCode3DS != nil && !pointerutil.Equal(params.FriendCode3DS, user.FriendCode3DS) {
		user.FriendCode3DS = params.FriendCode3DS
		options.Columns = append(options.Columns, "friend_code_3ds")
	}
	if params.FriendCodeSwitch != nil && !pointerutil.Equal(params.FriendCodeSwitch, user.FriendCodeSwitch) {
		user.FriendCodeSwitch = params.FriendCodeSwitch
		options.Columns = append(options.Columns, "friend_code_switch")
	}

	// Save the user.
	err = h.userService.UpdateUser(ctx, user, options)
	if err != nil {
		return errors.WithStack(err)
	}

	// Reload the session so that we can re-sign it.
	session, err = h.authService.RetrieveSession(ctx, auth.RetrieveSessionOptions{
		Username: &username,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	// Generate a new session token since we encode user information in the token.
	token, err := h.authService.SignSession(ctx, session)
	if err != nil {
		return errors.WithStack(err)
	}

	resp := struct {
		Token string `json:"token"`
	}{token}

	return errors.WithStack(c.JSON(http.StatusOK, resp))
}
