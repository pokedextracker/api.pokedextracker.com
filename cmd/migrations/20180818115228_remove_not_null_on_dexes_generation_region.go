package main

import (
	"github.com/go-pg/pg/orm"
	"github.com/robinjoseph08/go-pg-migrations"
)

func init() {
	up := func(db orm.DB) error {
		_, err := db.Exec(`
			ALTER TABLE dexes
				ALTER COLUMN generation DROP NOT NULL,
				ALTER COLUMN region DROP NOT NULL
		`)
		return err
	}

	down := func(db orm.DB) error {
		_, err := db.Exec(`
			ALTER TABLE dexes
				ALTER COLUMN generation SET NOT NULL,
				ALTER COLUMN region SET NOT NULL
		`)
		return err
	}

	opts := migrations.MigrationOptions{}

	migrations.Register("20180818115228_remove_not_null_on_dexes_generation_region", up, down, opts)
}