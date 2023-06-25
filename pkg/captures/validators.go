package captures

type createParams struct {
	Dex     int   `json:"dex" validate:"required"`
	Pokemon []int `json:"pokemon" validate:"required,min=1"`
}
