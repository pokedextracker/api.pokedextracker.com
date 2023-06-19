package main

import (
	"context"
	"math/rand"
	"net/http"
	"time"

	"github.com/pkg/errors"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/config"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/database"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/server"
	"github.com/robinjoseph08/golib/logger"
	"github.com/robinjoseph08/golib/signals"
)

func main() {
	rand.Seed(time.Now().UTC().UnixNano())

	log := logger.New()

	cfg, err := config.New()
	if err != nil {
		log.Err(err).Fatal("config error")
	}
	db, err := database.New("api", cfg)
	if err != nil {
		log.Err(err).Fatal("database error")
	}

	srv, err := server.New(cfg, db)
	if err != nil {
		log.Err(err).Fatal("server error")
	}

	graceful := signals.Setup()

	go func() {
		log.Info("server started", logger.Data{"port": cfg.Port})
		err := srv.ListenAndServe()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Err(err).Fatal("server stopped")
		}
		log.Info("server stopped")
	}()

	<-graceful
	log.Info("starting graceful shutdown")
	ctx := context.Background()

	err = srv.Shutdown(ctx)
	if err != nil {
		log.Err(err).Error("server shutdown error")
	}
	log.Info("server shutdown")

	err = db.Close()
	if err != nil {
		log.Err(err).Error("db close error")
	}
	log.Info("db close")
}
