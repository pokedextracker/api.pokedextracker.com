package users

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
)

type handler struct {
	userService *Service
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
