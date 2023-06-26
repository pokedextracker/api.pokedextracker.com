package errcodes

import (
	"github.com/go-pg/pg/v10"
	"github.com/pkg/errors"
)

// Constants for Postgres error codes as found here:
// https://www.postgresql.org/docs/10/static/errcodes-appendix.html.
const (
	PGDeadlockDetectedCode = "40P01"
	PGUniqueViolationCode  = "23505"
)

func IsPGDeadlockDetected(err error) bool {
	var pgerr pg.Error
	return errors.As(err, &pgerr) && pgerr.Field('C') == PGDeadlockDetectedCode
}

func IsPGUniqueViolation(err error) bool {
	var pgerr pg.Error
	return errors.As(err, &pgerr) && pgerr.Field('C') == PGUniqueViolationCode
}
