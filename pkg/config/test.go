package config

import (
	"os"
	"strconv"
)

func loadTestConfig(cfg *Config) {
	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err == nil {
		cfg.Port = port
	}
	cfg.DatabaseHost = "localhost"
	cfg.DatabaseName = "pokedex_tracker_test"
	cfg.DatabaseSSLMode = "disable"
	cfg.DatabaseUser = "pokedex_tracker_admin"
	cfg.Environment = "test"
	cfg.Version = "test"
}
