package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"ecommerce-mini/config"
	"ecommerce-mini/middlewares"
	"ecommerce-mini/routes"
	"ecommerce-mini/utils"
)

func main() {
	app := fiber.New(fiber.Config{
		ErrorHandler: middlewares.ErrorHandler,
	})

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	app.Static("/", "./frontend")           
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Redirect("/user/index.html")
	})

	db := config.InitDatabase()
	utils.SeedAdminUser(db)

	routes.SetupRoutes(app, db)

	log.Println("Server running at http://localhost:8080")
	log.Fatal(app.Listen(":8080"))
}
