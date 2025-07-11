package utils

import (
	"log"

	"ecommerce-mini/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedAdminUser(db *gorm.DB) {
	var admin models.User
	if err := db.Where("role = ?", "admin").First(&admin).Error; err == nil {
		log.Println("Admin user already exists, skipping seeder")
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)

	admin = models.User{
		Email:    "admin@example.com",
		Password: string(hash),
		Role:     "admin",
	}

	if err := db.Create(&admin).Error; err != nil {
		log.Println("Failed to seed admin user:", err)
	} else {
		log.Println("Admin user seeded: admin@example.com / 123456")
	}
}
