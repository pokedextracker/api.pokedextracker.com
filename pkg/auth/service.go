package auth

import (
	"context"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/pkg/errors"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/errcodes"
)

type RetrieveSessionOptions struct {
	Username *string
}

type UpdateSessionOptions struct {
	Columns []string
}

type Service struct {
	db *pg.DB
}

func NewService(db *pg.DB) *Service {
	return &Service{db}
}

func (svc *Service) RetrieveSession(ctx context.Context, opts RetrieveSessionOptions) (*Session, error) {
	session := &Session{}

	q := svc.db.ModelContext(ctx, session)

	if opts.Username != nil {
		q = q.Where("u.username = ?", *opts.Username)
	}

	err := q.Select()
	if err != nil {
		if errors.Is(err, pg.ErrNoRows) {
			return nil, errcodes.NotFound("User")
		}
		return nil, errors.WithStack(err)
	}

	return session, nil
}

func (svc *Service) UpdateSession(ctx context.Context, session *Session, opts UpdateSessionOptions) error {
	if len(opts.Columns) == 0 {
		// There's nothing to update, so we just return early.
		return nil
	}

	columns := append(opts.Columns, "date_modified")
	session.DateModified = time.Now()

	_, err := svc.db.
		ModelContext(ctx, session).
		Column(columns...).
		WherePK().
		Update()
	return errors.WithStack(err)
}
