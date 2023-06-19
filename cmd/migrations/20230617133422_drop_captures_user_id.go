package main

import (
	"github.com/go-pg/pg/v10/orm"
	"github.com/robinjoseph08/go-pg-migrations/v3"
)

func init() {
	up := func(db orm.DB) error {
		_, err := db.Exec("ALTER TABLE captures DROP COLUMN user_id")
		return err
	}

	down := func(db orm.DB) error {
		if _, err := db.Exec("ALTER TABLE captures ADD COLUMN user_id INTEGER"); err != nil {
			return err
		}
		if _, err := db.Exec("ALTER TABLE captures ADD CONSTRAINT captures_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE"); err != nil {
			return err
		}
		_, err := db.Exec("CREATE INDEX captures_user_id_index ON captures (user_id)")
		return err
	}

	opts := migrations.MigrationOptions{}

	migrations.Register("20230617133422_drop_captures_user_id", up, down, opts)
}
