package main

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

func main() {
	// Initialize a new Fiber app
	app := fiber.New()

	app.Use(logger.New(logger.Config{
		Format: "[${ip}]:${port} ${status} - ${method} ${path}\n",
	}))

	// Define a route for the GET method on the root path '/'
	app.Get("/", func(c fiber.Ctx) error {
		// Send a string response to the client
		return c.SendString("Hello, World 👋!")
	})

	app.Get("/400", func(c fiber.Ctx) error {
		return c.Status(fiber.StatusBadRequest).SendString("Bad Request")
	})

	app.Get("/500", func(c fiber.Ctx) error {
		return c.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	})

	// Start the server on port 3001
	log.Fatal(app.Listen(":3001"))
}
