package config

import (
	"os"
	"strconv"
	"time"

	"github.com/pkg/errors"
)

// Config contains the environment specific configuration values needed by the
// application.
type Config struct {
	DatabaseConnectRetryCount int
	DatabaseConnectRetryDelay time.Duration
	DatabaseDebug             bool
	DatabaseHost              string
	DatabaseName              string
	DatabasePassword          string
	DatabasePort              int
	DatabaseSSLHost           string
	DatabaseSSLMode           string
	DatabaseUser              string
	Environment               string
	Hostname                  string
	Port                      int
	Version                   string
}

const environmentENV = "ENVIRONMENT"

// New returns an instance of Config based on the "ENVIRONMENT" environment
// variable.
func New() (*Config, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return nil, errors.WithStack(err)
	}

	databasePort := 5432
	if os.Getenv("DATABASE_PORT") != "" {
		databasePort, err = strconv.Atoi(os.Getenv("DATABASE_PORT"))
		if err != nil {
			return nil, errors.WithStack(err)
		}
	}

	cfg := &Config{
		DatabaseConnectRetryCount: 10,
		DatabaseConnectRetryDelay: 2 * time.Second,
		DatabaseDebug:             os.Getenv("DATABASE_DEBUG") == "true",
		DatabasePort:              databasePort,
		DatabaseSSLHost:           os.Getenv("DATABASE_SSL_HOST"),
		Hostname:                  hostname,
		Port:                      8647,
		Version:                   os.Getenv("VERSION"),
	}

	switch os.Getenv(environmentENV) {
	case "development", "":
		loadDevelopmentConfig(cfg)
	case "test":
		loadTestConfig(cfg)
	case "staging":
		loadStagingConfig(cfg)
	case "production":
		loadProductionConfig(cfg)
	}

	return cfg, nil
}
