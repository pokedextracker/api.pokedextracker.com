package dexes

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
)

type handler struct {
	dexService *Service
}

func (h *handler) retrieve(c echo.Context) error {
	ctx := c.Request().Context()

	username := c.Param("username")
	slug := c.Param("slug")

	dex, err := h.dexService.RetrieveDex(ctx, RetrieveDexOptions{
		Username: &username,
		Slug:     &slug,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	return errors.WithStack(c.JSON(http.StatusOK, dex))
}
