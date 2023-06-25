package users

import (
	"github.com/go-pg/pg/v10"
	"github.com/labstack/echo/v4"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/auth"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/config"
)

// RegisterRoutes takes in an Echo router and registers routes onto it.
func RegisterRoutes(e *echo.Echo, cfg *config.Config, db *pg.DB, enforceAuth echo.MiddlewareFunc, nonEnforceAuth echo.MiddlewareFunc) {
	authService := auth.NewService(cfg, db)
	userService := NewService(db)

	h := &handler{
		authService: authService,
		config:      cfg,
		userService: userService,
	}

	e.GET("/users/:username", h.retrieve, nonEnforceAuth)
	e.GET("/users", h.list, nonEnforceAuth)
	e.POST("/users/:username", h.update, enforceAuth)
}
