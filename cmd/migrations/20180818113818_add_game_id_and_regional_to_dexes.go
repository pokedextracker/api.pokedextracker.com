package main

import (
	"github.com/go-pg/pg/orm"
	"github.com/robinjoseph08/go-pg-migrations"
)

func init() {
	up := func(db orm.DB) error {
		if _, err := db.Exec(`
			ALTER TABLE dexes
				ADD COLUMN game_id TEXT,
				ADD COLUMN regional BOOLEAN
		`); err != nil {
			return err
		}
		if _, err := db.Exec("ALTER TABLE dexes ADD CONSTRAINT dexes_game_id_foreign FOREIGN KEY (game_id) REFERENCES games (id)"); err != nil {
			return err
		}
		_, err := db.Exec("CREATE INDEX dexes_game_id_index ON dexes (game_id)")
		return err
	}

	down := func(db orm.DB) error {
		_, err := db.Exec(`
			ALTER TABLE dexes
				DROP COLUMN game_id,
				DROP COLUMN regional
		`)
		return err
	}

	opts := migrations.MigrationOptions{}

	migrations.Register("20180818113818_add_game_id_and_regional_to_dexes", up, down, opts)
}