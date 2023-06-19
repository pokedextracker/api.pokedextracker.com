package users

import (
	"github.com/go-pg/pg/v10"
	"github.com/labstack/echo/v4"
)

// RegisterRoutes takes in an Echo router and registers routes onto it.
func RegisterRoutes(e *echo.Echo, db *pg.DB) {
	userService := NewService(db)

	h := &handler{
		userService: userService,
	}

	e.GET("/users", h.list)
}
