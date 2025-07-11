package models

import "time"

type Order struct {
	ID        uint         `gorm:"primaryKey"`
	UserID    uint         `gorm:"not null"`
	User      User
	CreatedAt time.Time
	OrderItems []OrderItem
}

type OrderItem struct {
	ID        uint `gorm:"primaryKey"`
	OrderID   uint `gorm:"not null"`
	ProductID uint `gorm:"not null"`
	Product   Product
	Quantity  int `gorm:"not null"`
	Price     int `gorm:"not null"` 
}
