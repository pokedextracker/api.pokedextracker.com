package binder

import (
	"regexp"

	"github.com/go-playground/validator/v10"
)

var (
	tokenRE = regexp.MustCompile("^[a-zA-Z0-9_]+$")
)

func tokenValidator(fl validator.FieldLevel) bool {
	return tokenRE.MatchString(fl.Field().String())
}
