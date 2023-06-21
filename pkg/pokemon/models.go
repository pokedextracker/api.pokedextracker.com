package pokemon

import (
	"time"

	"github.com/pokedextracker/api.pokedextracker.com/pkg/games"
)

type Pokemon struct {
	tableName struct{} `pg:"pokemon,alias:p"`

	ID                int               `json:"id"`
	NationalID        int               `json:"national_id"`
	Name              string            `json:"name"`
	GameFamilyID      string            `json:"-"`
	GameFamily        *games.GameFamily `pg:"gf,rel:has-one" json:"game_family"`
	Form              *string           `json:"form"`
	Box               *string           `pg:"-" json:"box"`
	DexNumber         int               `pg:"-" json:"dex_number"`
	Locations         []*Location       `pg:"l,rel:has-many" json:"locations"`
	NationalOrder     int               `json:"-"`
	EvolutionFamilyID int               `json:"-"`
	DateCreated       time.Time         `json:"-"`
	DateModified      time.Time         `json:"-"`
}

type Location struct {
	tableName struct{} `pg:"locations,alias:l"`

	GameID    string `json:"game_id"`
	PokemonID int    `json:"pokemon_id"`
	Value     string `json:"value"`
}
