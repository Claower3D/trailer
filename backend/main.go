package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

type Trailer struct {
	ID          int      `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	ImageUrl    string   `json:"imageUrl"`
	Features    []string `json:"features"`
}

var trailers = []Trailer{
	{
		ID:          1,
		Title:       "Heavy Duty Utility Trailer",
		Description: "A rugged open utility trailer perfect for hauling equipment, ATVs, and heavy loads. Built with reinforced steel.",
		Price:       2500.00,
		ImageUrl:    "https://images.unsplash.com/photo-1589139626577-fb3b361bb500?q=80&w=800&auto=format&fit=crop",
		Features:    []string{"Steel Frame", "Fold-down ramp", "15-inch wheels"},
	},
	{
		ID:          2,
		Title:       "Enclosed Cargo Trailer",
		Description: "Secure and protect your valuable cargo with this sleek enclosed trailer. Features a weather-resistant exterior.",
		Price:       4800.00,
		ImageUrl:    "https://images.unsplash.com/photo-1621250266016-11f8b65671da?q=80&w=800&auto=format&fit=crop",
		Features:    []string{"Weather-resistant", "Side door access", "Rear ramp door"},
	},
	{
		ID:          3,
		Title:       "Pro Boat Trailer",
		Description: "Premium boat trailer designed for easy launching and retrieval. Adjustable bunks to fit various hull shapes.",
		Price:       3200.00,
		ImageUrl:    "https://images.unsplash.com/photo-1594042838965-0317e3f81eb5?q=80&w=800&auto=format&fit=crop",
		Features:    []string{"Galvanized frame", "Adjustable bunks", "Submersible lights"},
	},
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func trailersHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trailers)
}

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := filepath.Join(h.staticPath, r.URL.Path)
	_, err := os.Stat(path)
	if os.IsNotExist(err) || r.URL.Path == "/" {
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func main() {
	http.HandleFunc("/api/trailers", trailersHandler)

	distPath := os.Getenv("STATIC_DIR")
	if distPath == "" {
		distPath = filepath.Join("..", "frontend", "dist")
	}

	spa := spaHandler{staticPath: distPath, indexPath: "index.html"}
	http.Handle("/", spa)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Backend server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
