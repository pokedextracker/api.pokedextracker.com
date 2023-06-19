package errcodes

import (
	"fmt"
	"net/http"
)

type Error struct {
	HTTPCode int
	Message  string
	Code     string
}

func (err *Error) Error() string {
	return err.Message
}

func (err *Error) As(target interface{}) bool {
	te, ok := target.(*Error)
	if !ok {
		return false
	}
	te.HTTPCode = err.HTTPCode
	te.Message = err.Message
	te.Code = err.Code
	return true
}

func (err *Error) Is(target error) bool {
	te, ok := target.(*Error)
	if !ok {
		return false
	}
	return te.HTTPCode == err.HTTPCode &&
		te.Message == err.Message &&
		te.Code == err.Code
}

// Forbidden returns a 403 error with a message indicating the action is
// forbidden.
func Forbidden(action string) error {
	return &Error{
		http.StatusForbidden,
		fmt.Sprintf("%s is not allowed.", action),
		"forbidden",
	}
}

// NotFound returns a 404 error with a message indicating the given resource.
func NotFound(resource string) error {
	return &Error{
		http.StatusNotFound,
		fmt.Sprintf("%s not found.", resource),
		"not_found",
	}
}

// Unauthorized returns a 401 error with a message indicating the action is
// unauthorized.
func Unauthorized() error {
	return &Error{
		http.StatusUnauthorized,
		"You're unauthorized. Please log in again.",
		"unauthorized",
	}
}
