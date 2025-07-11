package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"ecommerce-mini/services"
)

type CartHandler struct {
	CartService *services.CartService
}

func NewCartHandler(service *services.CartService) *CartHandler {
	return &CartHandler{CartService: service}
}

func (h *CartHandler) AddToCart(c *fiber.Ctx) error {
	type req struct {
		ProductID uint `json:"product_id"`
		Quantity  int  `json:"quantity"`
	}
	var body req
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	userID := c.Locals("user_id").(float64)
	err := h.CartService.AddToCart(uint(userID), body.ProductID, body.Quantity)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "added to cart"})
}

func (h *CartHandler) GetCart(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(float64)
	items, err := h.CartService.GetCart(uint(userID))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(items)
}

func (h *CartHandler) UpdateQuantity(c *fiber.Ctx) error {
	itemID, _ := strconv.Atoi(c.Params("item_id"))

	type req struct {
		Quantity int `json:"quantity"`
	}
	var body req
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	userID := c.Locals("user_id").(float64)
	err := h.CartService.UpdateQuantity(uint(userID), uint(itemID), body.Quantity)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "updated"})
}

func (h *CartHandler) DeleteItem(c *fiber.Ctx) error {
	itemID, _ := strconv.Atoi(c.Params("item_id"))
	userID := c.Locals("user_id").(float64)
	err := h.CartService.DeleteItem(uint(userID), uint(itemID))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"message": "deleted"})
}
