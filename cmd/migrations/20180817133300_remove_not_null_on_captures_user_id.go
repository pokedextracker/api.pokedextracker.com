package main

import (
	"github.com/go-pg/pg/orm"
	"github.com/robinjoseph08/go-pg-migrations"
)

func init() {
	up := func(db orm.DB) error {
		_, err := db.Exec("ALTER TABLE captures ALTER COLUMN user_id DROP NOT NULL")
		return err
	}

	down := func(db orm.DB) error {
		_, err := db.Exec("ALTER TABLE captures ALTER COLUMN user_id SET NOT NULL")
		return err
	}

	opts := migrations.MigrationOptions{}

	migrations.Register("20180817133300_remove_not_null_on_captures_user_id", up, down, opts)
}