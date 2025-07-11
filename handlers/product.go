package handlers

import (
	"fmt"
	"strconv"
	"time"

	"ecommerce-mini/models"
	"ecommerce-mini/services"

	"github.com/gofiber/fiber/v2"
)

type ProductHandler struct {
	ProductService *services.ProductService
}

func NewProductHandler(p *services.ProductService) *ProductHandler {
	return &ProductHandler{ProductService: p}
}

func (h *ProductHandler) CreateProduct(c *fiber.Ctx) error {
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid form"})
	}

	name := form.Value["name"][0]
	price, _ := strconv.Atoi(form.Value["price"][0])
	stock, _ := strconv.Atoi(form.Value["stock"][0])
	description := form.Value["description"][0]

	fileHeader := form.File["image"][0]
	ext := fileHeader.Filename[len(fileHeader.Filename)-4:]
	if ext != ".jpg" && ext != ".png" {
		return c.Status(400).JSON(fiber.Map{"error": "invalid file format"})
	}

	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), fileHeader.Filename)
	savePath := "./public/uploads/" + filename
	if err := c.SaveFile(fileHeader, savePath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to upload image"})
	}

	product := &models.Product{
		Name:        name,
		Price:       price,
		Stock:       stock,
		Description: description,
		ImagePath:   "/public/uploads/" + filename,
	}

	err = h.ProductService.CreateProduct(product)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(product)
}

func (h *ProductHandler) GetAll(c *fiber.Ctx) error {
	products, err := h.ProductService.GetAllProducts()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to fetch products"})
	}
	return c.JSON(products)
}

func (h *ProductHandler) GetDetail(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	product, err := h.ProductService.GetProductByID(uint(id))
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "product not found"})
	}
	return c.JSON(product)
}

func (h *ProductHandler) Update(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))

	var input models.Product
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	err := h.ProductService.UpdateProduct(uint(id), input)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"message": "updated successfully"})
}

func (h *ProductHandler) Delete(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	err := h.ProductService.DeleteProduct(uint(id))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"message": "deleted successfully"})
}
