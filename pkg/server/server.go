package server

import (
	"fmt"
	"net/http"

	"github.com/go-pg/pg/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"github.com/pkg/errors"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/binder"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/config"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/dextypes"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/errcodes"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/games"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/users"
	"github.com/robinjoseph08/golib/echo/v4/health"
	"github.com/robinjoseph08/golib/echo/v4/middleware/logger"
	"github.com/robinjoseph08/golib/echo/v4/middleware/recovery"
)

func New(cfg *config.Config, db *pg.DB) (*http.Server, error) {
	e := echo.New()

	e.Logger.SetLevel(log.OFF)

	b, err := binder.New()
	if err != nil {
		return nil, errors.WithStack(err)
	}
	e.Binder = b

	e.Use(logger.Middleware())
	e.Use(recovery.Middleware())

	health.RegisterRoutes(e)

	dextypes.RegisterRoutes(e, db)
	games.RegisterRoutes(e, db)
	users.RegisterRoutes(e, db)

	echo.NotFoundHandler = notFoundHandler
	e.HTTPErrorHandler = errcodes.NewHandler().Handle

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: e,
	}

	return srv, nil
}

func notFoundHandler(c echo.Context) error {
	c.SetPath("/:path")
	return errcodes.NotFound("Page")
}
