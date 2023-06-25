package auth

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/errcodes"
	"github.com/robinjoseph08/golib/pointerutil"
	"golang.org/x/crypto/bcrypt"
)

type handler struct {
	authService *Service
}

func (h *handler) create(c echo.Context) error {
	ctx := c.Request().Context()

	params := createParams{}
	if err := c.Bind(&params); err != nil {
		return errors.WithStack(err)
	}

	session, err := h.authService.RetrieveSession(ctx, RetrieveSessionOptions{
		Username: &params.Username,
	})
	if err != nil {
		return errors.WithStack(err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(session.Password), []byte(params.Password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return errcodes.InvalidPassword()
		}
		return errors.WithStack(err)
	}

	// When bcrypt.CompareHashAndPassword returns no error, that means the passwords match and login was successful.

	options := UpdateSessionOptions{
		Columns: []string{},
	}
	xff := c.Request().Header.Get("x-forwarded-for")
	ip := c.Request().RemoteAddr
	fmt.Println("xff", xff)            // TODO: remove
	fmt.Println("ip address", ip)      // TODO: remove
	fmt.Println("real ip", c.RealIP()) // TODO: remove
	if xff != "" {
		ip = strings.TrimSpace(strings.Split(xff, ",")[0])
	}
	session.LastLogin = pointerutil.Time(time.Now())
	options.Columns = append(options.Columns, "last_login")
	if ip != "" {
		session.LastIP = &ip
		options.Columns = append(options.Columns, "last_ip")
	}
	err = h.authService.UpdateSession(ctx, session, options)
	if err != nil {
		return errors.WithStack(err)
	}

	token, err := h.authService.SignSession(ctx, session)
	if err != nil {
		return errors.WithStack(err)
	}

	resp := struct {
		Token string `json:"token"`
	}{token}

	return errors.WithStack(c.JSON(http.StatusOK, resp))
}
