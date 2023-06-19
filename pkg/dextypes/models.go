package dextypes

type DexType struct {
	tableName struct{} `pg:"dex_types,alias:dt"`

	ID           int      `json:"id"`
	Name         string   `json:"name"`
	GameFamilyID string   `json:"game_family_id"`
	Order        int      `json:"order"`
	Tags         []string `pg:",array" json:"tags"`
}
