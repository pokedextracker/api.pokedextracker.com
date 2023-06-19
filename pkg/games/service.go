package games

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

func (svc *Service) ListGames(ctx context.Context) ([]*Game, error) {
	games := make([]*Game, 0)

	q := svc.db.
		ModelContext(ctx, &games).
		Relation("GameFamily").
		Where("gf.published = ?", true).
		Order("gf.order DESC", "g.order ASC")

	err := q.Select()
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return games, nil
}
