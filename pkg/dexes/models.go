package dexes

import (
	"time"

	"github.com/pokedextracker/api.pokedextracker.com/pkg/dextypes"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/games"
)

type Dex struct {
	tableName struct{} `pg:"dexes,alias:d"`

	ID           int               `json:"id"`
	UserID       int               `json:"user_id"`
	Title        string            `json:"title"`
	Slug         string            `json:"slug"`
	Shiny        bool              `json:"shiny"`
	GameID       string            `json:"-"`
	Game         *games.Game       `pg:"rel:has-one" json:"game"`
	DexTypeID    int               `json:"-"`
	DexType      *dextypes.DexType `pg:"rel:has-one" json:"dex_type"`
	Regional     *bool             `json:"regional"`
	Caught       int               `pg:"-" json:"caught"`
	Total        int               `pg:"-" json:"total"`
	DateCreated  time.Time         `json:"date_created"`
	DateModified time.Time         `json:"date_modified"`
}
