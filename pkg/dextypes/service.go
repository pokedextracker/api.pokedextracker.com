package dextypes

import (
	"context"

	"github.com/go-pg/pg/v10"
	"github.com/pkg/errors"
)

type Service struct {
	db *pg.DB
}

func NewService(db *pg.DB) *Service {
	return &Service{db}
}

func (svc *Service) ListDexTypes(ctx context.Context) ([]*DexType, error) {
	dexTypes := make([]*DexType, 0)

	q := svc.db.
		ModelContext(ctx, &dexTypes).
		Join("INNER JOIN game_families gf ON dt.game_family_id = gf.id").
		Order("gf.order DESC", "dt.order ASC")

	err := q.Select()
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return dexTypes, nil
}
