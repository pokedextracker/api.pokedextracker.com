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
		fmt.Sprintf("%s is not allowed", action),
		"forbidden",
	}
}

// NotFound returns a 404 error with a message indicating the given resource.
func NotFound(resource string) error {
	return &Error{
		http.StatusNotFound,
		fmt.Sprintf("%s not found", resource),
		"not_found",
	}
}

func UnsupportedMediaType() error {
	return &Error{
		http.StatusUnsupportedMediaType,
		"unsupported media type",
		"unsupported_media_type",
	}
}

func UnknownParameter(param string) error {
	return &Error{
		http.StatusUnprocessableEntity,
		fmt.Sprintf("unknown parameter %q", param),
		"unknown_parameter",
	}
}

func ValidationTypeError(msg string) error {
	return &Error{
		http.StatusUnprocessableEntity,
		msg,
		"validation_type_error",
	}
}

func ValidationError(msg string) error {
	return &Error{
		http.StatusUnprocessableEntity,
		msg,
		"validation_error",
	}
}

func MalformedPayload() error {
	return &Error{
		http.StatusBadRequest,
		"malformed payload",
		"malformed_payload",
	}
}

func EmptyRequestBody() error {
	return &Error{
		http.StatusBadRequest,
		"request body can't be empty",
		"empty_request_body",
	}
}

func InvalidPassword() error {
	return &Error{
		http.StatusUnprocessableEntity,
		"password is invalid",
		"invalid_password",
	}
}

func MissingAuthentication() error {
	return &Error{
		http.StatusUnauthorized,
		"missing authentication",
		"missing_authentication",
	}
}

func BadAuthHeaderFormat() error {
	return &Error{
		http.StatusUnauthorized,
		"bad HTTP authentication header format",
		"bad_auth_header_format",
	}
}

func CannotParseToken() error {
	return &Error{
		http.StatusInternalServerError,
		"cannot parse token correctly",
		"cannot_parse_token",
	}
}

func InvalidJWTSignature() error {
	return &Error{
		http.StatusUnauthorized,
		"invalid signature received for JSON Web Token validation",
		"invalid_jwt_signature",
	}
}

func InvalidJWT() error {
	return &Error{
		http.StatusInternalServerError,
		"auth token is invalid",
		"invalid_jwt",
	}
}

func EmptySlug() error {
	return &Error{
		http.StatusUnprocessableEntity,
		"the URL generated by the title needs at least one alphanumeric character",
		"empty_slug",
	}
}

func ExistingUsername() error {
	return &Error{
		http.StatusUnprocessableEntity,
		"username is already taken",
		"existing_username",
	}
}

func ExistingDex() error {
	return &Error{
		http.StatusUnprocessableEntity,
		"a dex with that URL already exists, please try a different title",
		"existing_dex",
	}
}

func GameDexTypeMismatch() error {
	return &Error{
		http.StatusUnprocessableEntity,
		"that dex type and game don't match up. this is a bug on our end. tweet at us to let us know!",
		"game_dex_type_mismatch",
	}
}

func AtLeastOneDex() error {
	return &Error{
		http.StatusUnprocessableEntity,
		"at least 1 dex is required for an account",
		"at_least_one_dex",
	}
}
