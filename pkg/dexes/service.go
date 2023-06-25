package dexes

import (
	"context"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/pkg/errors"
	"github.com/pokedextracker/api.pokedextracker.com/pkg/errcodes"
)

type RetrieveDexOptions struct {
	Slug     *string
	Username *string

	IncludeDexTypePokemon bool
}

type Service struct {
	db *pg.DB
}

func NewService(db *pg.DB) *Service {
	return &Service{db}
}

func (svc *Service) RetrieveDex(ctx context.Context, opts RetrieveDexOptions) (*Dex, error) {
	dex := &Dex{}

	q := svc.db.
		ModelContext(ctx, dex).
		Column("d.*").
		ColumnExpr("(SELECT COUNT(*) FROM captures WHERE dex_id = d.id) AS caught").
		ColumnExpr("(SELECT COUNT(*) FROM dex_types_pokemon WHERE dex_type_id = d.dex_type_id) AS total").
		Relation("DexType").
		Relation("Game").
		Relation("Game.GameFamily")

	if opts.Slug != nil {
		q = q.Where("d.slug = ?", *opts.Slug)
	}
	if opts.Username != nil {
		q = q.
			Join("INNER JOIN users u ON u.id = d.user_id").
			Where("u.username = ?", *opts.Username)
	}
	if opts.IncludeDexTypePokemon {
		q = q.
			Relation("DexType.Pokemon", func(sq *orm.Query) (*orm.Query, error) {
				return sq.Order("order ASC"), nil
			}).
			Relation("DexType.Pokemon.GameFamily")
	}

	err := q.Select()
	if err != nil {
		if errors.Is(err, pg.ErrNoRows) {
			return nil, errcodes.NotFound("dex")
		}
		return nil, errors.WithStack(err)
	}

	return dex, nil
}
