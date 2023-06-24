package users

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/config"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/errcodes"
	"github.com/robinjoseph08/golib/pointerutil"
	"golang.org/x/crypto/bcrypt"
)

type handler struct {
	config      *config.Config
	userService *Service
}

func (h *handler) retrieve(c echo.Context) error {
	ctx := c.Request().Context()

	username := c.Param("username")

	user, err := h.userService.RetrieveUser(ctx, RetrieveUserOptions{
		Username:     &username,
		IncludeDexes: true,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	return errors.WithStack(c.JSON(http.StatusOK, user))
}

func (h *handler) list(c echo.Context) error {
	ctx := c.Request().Context()

	params := listParams{}
	if err := c.Bind(&params); err != nil {
		return errors.WithStack(err)
	}

	users, err := h.userService.ListUsers(ctx, ListUsersOptions{
		Limit:  &params.Limit,
		Offset: &params.Offset,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	return errors.WithStack(c.JSON(http.StatusOK, users))
}

func (h *handler) login(c echo.Context) error {
	ctx := c.Request().Context()

	params := loginParams{}
	if err := c.Bind(&params); err != nil {
		return errors.WithStack(err)
	}

	user, err := h.userService.RetrieveUser(ctx, RetrieveUserOptions{
		Username: &params.Username,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(params.Password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return errcodes.InvalidPassword()
		}
		return errors.WithStack(err)
	}

	// When bcrypt.CompareHashAndPassword returns no error, that means the passwords match.

	xff := c.Request().Header.Get("x-forwarded-for")
	ip := c.Request().RemoteAddr
	if xff != "" {
		ip = strings.TrimSpace(strings.Split(xff, ",")[0])
	}
	fmt.Println("ip address", ip) // TODO: remove
	user.LastLogin = pointerutil.Time(time.Now())
	if ip != "" {
		user.LastIP = &ip
	}
	// TODO: save user

	session := &Session{
		ID:               user.ID,
		Username:         user.Username,
		FriendCode3DS:    user.FriendCode3DS,
		FriendCodeSwitch: user.FriendCodeSwitch,
		DateCreated:      user.DateCreated,
		DateModified:     user.DateModified,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt: jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, session)
	signed, err := token.SignedString(h.config.JWTSecret)
	if err != nil {
		return errors.WithStack(err)
	}

	resp := struct {
		Token string `json:"token"`
	}{signed}

	return errors.WithStack(c.JSON(http.StatusOK, resp))
}
