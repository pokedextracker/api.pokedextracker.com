package games

type GameFamily struct {
	tableName struct{} `pg:"game_families,alias:gf"`

	ID              string `json:"id"`
	Generation      int    `json:"generation"`
	RegionalTotal   int    `json:"regional_total"`
	NationalTotal   int    `json:"national_total"`
	RegionalSupport bool   `json:"regional_support"`
	NationalSupport bool   `json:"national_support"`
	Order           int    `json:"order"`
	Published       bool   `json:"published"`
}

type Game struct {
	tableName struct{} `pg:"games,alias:g"`

	ID           string      `json:"id"`
	Name         string      `json:"name"`
	GameFamilyID string      `json:"-"`
	GameFamily   *GameFamily `pg:"gf,rel:has-one" json:"game_family"`
	Order        int         `json:"order"`
}
