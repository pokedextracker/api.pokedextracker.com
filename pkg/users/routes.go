package users

import (
	"github.com/go-pg/pg/v10"
	"github.com/labstack/echo/v4"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/config"
)

// RegisterRoutes takes in an Echo router and registers routes onto it.
func RegisterRoutes(e *echo.Echo, cfg *config.Config, db *pg.DB) {
	userService := NewService(db)

	h := &handler{
		config:      cfg,
		userService: userService,
	}

	e.GET("/users/:username", h.retrieve)
	e.GET("/users", h.list)
	e.POST("/sessions", h.login)
}
