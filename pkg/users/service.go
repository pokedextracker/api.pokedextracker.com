package users

import (
	"context"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/pkg/errors"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/errcodes"
)

type RetrieveUserOptions struct {
	Username *string
}

type ListUsersOptions struct {
	Limit  *int
	Offset *int
}

type Service struct {
	db *pg.DB
}

func NewService(db *pg.DB) *Service {
	return &Service{db}
}

func (svc *Service) RetrieveUser(ctx context.Context, opts RetrieveUserOptions) (*User, error) {
	user := &User{}

	q := svc.db.
		ModelContext(ctx, user).
		Column("u.*").
		ColumnExpr("u.stripe_id IS NOT NULL AS donated").
		Relation("Dexes", func(q *orm.Query) (*orm.Query, error) {
			return q.
				Column("d.*").
				ColumnExpr("(SELECT COUNT(*) FROM captures WHERE dex_id = d.id) AS caught").
				ColumnExpr("(SELECT COUNT(*) FROM dex_types_pokemon WHERE dex_type_id = d.dex_type_id) AS total").
				Order("d.date_created ASC"), nil
		}).
		Relation("Dexes.DexType").
		Relation("Dexes.Game").
		Relation("Dexes.Game.GameFamily")

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

	return user, nil
}

func (svc *Service) ListUsers(ctx context.Context, opts ListUsersOptions) ([]*User, error) {
	users := make([]*User, 0)

	q := svc.db.
		ModelContext(ctx, &users).
		Column("u.*").
		ColumnExpr("u.stripe_id IS NOT NULL AS donated").
		Relation("Dexes", func(q *orm.Query) (*orm.Query, error) {
			return q.
				Column("d.*").
				ColumnExpr("(SELECT COUNT(*) FROM captures WHERE dex_id = d.id) AS caught").
				ColumnExpr("(SELECT COUNT(*) FROM dex_types_pokemon WHERE dex_type_id = d.dex_type_id) AS total").
				Order("d.date_created ASC"), nil
		}).
		Relation("Dexes.DexType").
		Relation("Dexes.Game").
		Relation("Dexes.Game.GameFamily").
		Order("u.id DESC")

	if opts.Limit != nil {
		q = q.Limit(*opts.Limit)
	}
	if opts.Offset != nil {
		q = q.Offset(*opts.Offset)
	}

	err := q.Select()
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return users, nil
}