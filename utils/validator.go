package utils

import (
	"errors"
	"regexp"
)

func ValidateEmail(email string) bool {
	re := regexp.MustCompile(`^[\w\.-]+@[\w\.-]+\.\w{2,4}$`)
	return re.MatchString(email)
}

func ValidatePassword(password string) error {
	if len(password) < 6 {
		return errors.New("password must be at least 6 characters")
	}
	return nil
}
