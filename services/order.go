package services

import (
	"errors"

	"ecommerce-mini/models"
	"gorm.io/gorm"
)

type OrderService struct {
	DB *gorm.DB
}

func NewOrderService(db *gorm.DB) *OrderService {
	return &OrderService{DB: db}
}

func (s *OrderService) Checkout(userID uint) error {
	var cartItems []models.CartItem
	if err := s.DB.Preload("Product").Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
		return errors.New("failed to get cart items")
	}
	if len(cartItems) == 0 {
		return errors.New("cart is empty")
	}

	order := models.Order{UserID: userID}
	err := s.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		for _, item := range cartItems {
			if item.Quantity > item.Product.Stock {
				return errors.New("not enough stock for product: " + item.Product.Name)
			}

			orderItem := models.OrderItem{
				OrderID:   order.ID,
				ProductID: item.ProductID,
				Quantity:  item.Quantity,
				Price:     item.Product.Price,
			}
			if err := tx.Create(&orderItem).Error; err != nil {
				return err
			}

			if err := tx.Model(&models.Product{}).
				Where("id = ?", item.ProductID).
				Update("stock", gorm.Expr("stock - ?", item.Quantity)).Error; err != nil {
				return err
			}
		}

		if err := tx.Where("user_id = ?", userID).Delete(&models.CartItem{}).Error; err != nil {
			return err
		}

		return nil
	})

	return err
}

func (s *OrderService) GetUserOrders(userID uint) ([]models.Order, error) {
	var orders []models.Order
	err := s.DB.Preload("OrderItems.Product").Where("user_id = ?", userID).Find(&orders).Error
	return orders, err
}

func (s *OrderService) GetAllOrders() ([]models.Order, error) {
	var orders []models.Order
	err := s.DB.Preload("User").Preload("OrderItems.Product").Find(&orders).Error
	return orders, err
}
