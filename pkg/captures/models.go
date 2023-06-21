package captures

import (
	"time"

	"github.com/pokedextracker/api.pokedextracker.com/pkg/games"
)

type Capture struct {
	tableName struct{} `pg:"captures,alias:c"`

	DexID        int       `json:"dex_id"`
	PokemonID    int       `json:"-"`
	Pokemon      *Pokemon  `pg:"p,rel:has-one" json:"pokemon"`
	Captured     bool      `json:"captured"`
	DateCreated  time.Time `json:"-"`
	DateModified time.Time `json:"-"`
}

type Pokemon struct {
	tableName struct{} `pg:"pokemon,alias:p"`

	ID           int               `json:"id"`
	NationalID   int               `json:"national_id"`
	Name         string            `json:"name"`
	GameFamilyID string            `json:"-"`
	GameFamily   *games.GameFamily `pg:"gf,rel:has-one" json:"game_family"`
	Form         *string           `json:"form"`
	Box          *string           `pg:"-" json:"box"`
	DexNumber    int               `pg:"-" json:"dex_number"`
}
