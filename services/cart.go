package services

import (
	"errors"
	"ecommerce-mini/models"
	"gorm.io/gorm"
)

type CartService struct {
	DB *gorm.DB
}

func NewCartService(db *gorm.DB) *CartService {
	return &CartService{DB: db}
}

func (s *CartService) AddToCart(userID, productID uint, quantity int) error {
	if quantity <= 0 {
		return errors.New("invalid quantity")
	}

	var product models.Product
	if err := s.DB.First(&product, productID).Error; err != nil {
		return errors.New("product not found")
	}

	if quantity > product.Stock {
		return errors.New("quantity exceeds stock")
	}

	var item models.CartItem
	err := s.DB.Where("user_id = ? AND product_id = ?", userID, productID).First(&item).Error
	if err == nil {
		item.Quantity += quantity
		return s.DB.Save(&item).Error
	}

	newItem := models.CartItem{
		UserID:    userID,
		ProductID: productID,
		Quantity:  quantity,
	}

	return s.DB.Create(&newItem).Error
}

func (s *CartService) GetCart(userID uint) ([]models.CartItem, error) {
	var items []models.CartItem
	err := s.DB.Preload("Product").Where("user_id = ?", userID).Find(&items).Error
	return items, err
}

func (s *CartService) UpdateQuantity(userID, itemID uint, quantity int) error {
	if quantity <= 0 {
		return errors.New("invalid quantity")
	}

	var item models.CartItem
	if err := s.DB.Where("id = ? AND user_id = ?", itemID, userID).First(&item).Error; err != nil {
		return errors.New("item not found")
	}

	var product models.Product
	if err := s.DB.First(&product, item.ProductID).Error; err != nil {
		return errors.New("product not found")
	}

	if quantity > product.Stock {
		return errors.New("quantity exceeds stock")
	}

	item.Quantity = quantity
	return s.DB.Save(&item).Error
}

func (s *CartService) DeleteItem(userID, itemID uint) error {
	return s.DB.Where("id = ? AND user_id = ?", itemID, userID).Delete(&models.CartItem{}).Error
}
