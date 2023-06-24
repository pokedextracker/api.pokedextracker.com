package users

type createParams struct {
	Username   string  `form:"username" json:"username" mod:"trim" validate:"required,token,max=20"`
	Password   string  `form:"password" json:"password" validate:"required,min=8,max=72"`
	FriendCode *string `form:"friend_code" json:"friend_code" validate:"omitempty,friendcode"`
	Referrer   *string `form:"referrer" json:"referrer" validate:"omitempty"`
	Title      string  `form:"title" json:"title" mod:"trim" validate:"required,max=300"`
	Shiny      *bool   `form:"shiny" json:"shiny" validate:"required"`
	Game       string  `form:"game" json:"game" mod:"trim" validate:"required,max=50"`
	Regional   *bool   `form:"regional" json:"regional" validate:"required"`
}

type listParams struct {
	Limit  int `query:"limit" json:"limit" default:"10" validate:"min=0,max=100"`
	Offset int `query:"offset" json:"offset" validate:"min=0"`
}
