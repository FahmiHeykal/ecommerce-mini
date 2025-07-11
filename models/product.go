package models

import (
	"time"
	"gorm.io/gorm"
)

type Product struct {
	ID          uint           `gorm:"primaryKey"`
	Name        string         `gorm:"not null"`
	Price       int            `gorm:"not null"`
	Stock       int            `gorm:"not null"`
	Description string         `gorm:"type:text"`
	ImagePath   string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}
