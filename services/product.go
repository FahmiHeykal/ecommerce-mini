package services

import (
	"errors"
	"ecommerce-mini/models"
	"gorm.io/gorm"
)

type ProductService struct {
	DB *gorm.DB
}

func NewProductService(db *gorm.DB) *ProductService {
	return &ProductService{DB: db}
}

func (s *ProductService) CreateProduct(p *models.Product) error {
	if p.Price <= 0 || p.Stock < 0 {
		return errors.New("invalid price or stock")
	}
	return s.DB.Create(p).Error
}

func (s *ProductService) GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	err := s.DB.Find(&products).Error
	return products, err
}

func (s *ProductService) GetProductByID(id uint) (*models.Product, error) {
	var product models.Product
	err := s.DB.First(&product, id).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (s *ProductService) UpdateProduct(id uint, update models.Product) error {
	return s.DB.Model(&models.Product{}).Where("id = ?", id).Updates(update).Error
}

func (s *ProductService) DeleteProduct(id uint) error {
	return s.DB.Delete(&models.Product{}, id).Error
}
