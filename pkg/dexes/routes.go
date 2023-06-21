package dexes

import (
	"github.com/go-pg/pg/v10"
	"github.com/labstack/echo/v4"
)

// RegisterRoutes takes in an Echo router and registers routes onto it.
func RegisterRoutes(e *echo.Echo, db *pg.DB) {
	dexService := NewService(db)

	h := &handler{
		dexService: dexService,
	}

	e.GET("/users/:username/dexes/:slug", h.retrieve)
}
