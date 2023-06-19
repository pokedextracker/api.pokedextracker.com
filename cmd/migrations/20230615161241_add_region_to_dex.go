package main

import (
	"github.com/go-pg/pg/v10/orm"
	"github.com/robinjoseph08/go-pg-migrations/v3"
)

func init() {
	up := func(db orm.DB) error {
		_, err := db.Exec("ALTER TABLE dexes ADD COLUMN region TEXT CHECK (region IN ('national', 'kalos', 'hoenn', 'alola'))")
		return err
	}

	down := func(db orm.DB) error {
		_, err := db.Exec("ALTER TABLE dexes DROP COLUMN region")
		return err
	}

	opts := migrations.MigrationOptions{}

	migrations.Register("20230615161241_add_region_to_dex", up, down, opts)
}
