package routes

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"ecommerce-mini/handlers"
	"ecommerce-mini/middlewares"
	"ecommerce-mini/services"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	authService := services.NewAuthService(db)
	authHandler := handlers.NewAuthHandler(authService)
	app.Post("/auth/register", authHandler.Register)
	app.Post("/auth/login", authHandler.Login)

	productService := services.NewProductService(db)
	productHandler := handlers.NewProductHandler(productService)
	app.Get("/products", productHandler.GetAll)
	app.Get("/products/:id", productHandler.GetDetail)
	admin := app.Group("/admin", middlewares.RequireJWT(), middlewares.IsAdmin())
	admin.Post("/products", productHandler.CreateProduct)
	admin.Put("/products/:id", productHandler.Update)
	admin.Delete("/products/:id", productHandler.Delete)

	cartService := services.NewCartService(db)
	cartHandler := handlers.NewCartHandler(cartService)
	cart := app.Group("/cart", middlewares.RequireJWT())
	cart.Post("/", cartHandler.AddToCart)
	cart.Get("/", cartHandler.GetCart)
	cart.Put("/:item_id", cartHandler.UpdateQuantity)
	cart.Delete("/:item_id", cartHandler.DeleteItem)

	orderService := services.NewOrderService(db)
	orderHandler := handlers.NewOrderHandler(orderService)
	app.Post("/checkout", middlewares.RequireJWT(), orderHandler.Checkout)
	app.Get("/orders", middlewares.RequireJWT(), orderHandler.GetUserOrders)
	admin.Get("/orders", orderHandler.GetAllOrders)
}
