package handlers

import (
	"github.com/gofiber/fiber/v2"
	"ecommerce-mini/services"
)

type OrderHandler struct {
	OrderService *services.OrderService
}

func NewOrderHandler(service *services.OrderService) *OrderHandler {
	return &OrderHandler{OrderService: service}
}

func (h *OrderHandler) Checkout(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(float64)
	if err := h.OrderService.Checkout(uint(userID)); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"message": "checkout successful"})
}

func (h *OrderHandler) GetUserOrders(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(float64)
	orders, err := h.OrderService.GetUserOrders(uint(userID))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(orders)
}

func (h *OrderHandler) GetAllOrders(c *fiber.Ctx) error {
	orders, err := h.OrderService.GetAllOrders()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(orders)
}
