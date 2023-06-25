package captures

import (
	"context"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/pkg/errors"
)

type ListCapturesOptions struct {
	DexID      *int
	PokemonIDs []int
	// DexTypeID is to fetch and populate the correct box and dex number on the associated Pokemon.
	DexTypeID *int
}

type Service struct {
	db *pg.DB
}

func NewService(db *pg.DB) *Service {
	return &Service{db}
}

func (svc *Service) CreateCaptures(ctx context.Context, captures []*Capture) error {
	if len(captures) == 0 {
		return nil
	}

	now := time.Now()
	for _, capture := range captures {
		capture.DateCreated = now
		capture.DateModified = now
	}

	_, err := svc.db.
		ModelContext(ctx, &captures).
		// TODO: Once we upgrade to a newer version Postgres, add the OnConflict in.
		// OnConflict("DO NOTHING").
		Insert()
	return errors.WithStack(err)
}

func (svc *Service) ListCaptures(ctx context.Context, opts ListCapturesOptions) ([]*Capture, error) {
	captures := make([]*Capture, 0)

	q := svc.db.
		ModelContext(ctx, &captures).
		Relation("Pokemon").
		Relation("Pokemon.GameFamily")

	if opts.DexID != nil {
		q = q.Where("c.dex_id = ?", *opts.DexID)
	}
	if len(opts.PokemonIDs) > 0 {
		q = q.WhereIn("c.pokemon_id IN (?)", opts.PokemonIDs)
	}
	if opts.DexTypeID != nil {
		// Load in the box and dex number for this dex type.
		q = q.
			Column("c.*").
			ColumnExpr("dtp.box AS p__box").
			ColumnExpr("dtp.dex_number AS p__dex_number").
			Join("LEFT OUTER JOIN dex_types_pokemon dtp ON dtp.pokemon_id = p.id AND dtp.dex_type_id = ?", *opts.DexTypeID)
	}

	err := q.Select()
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return captures, nil
}
