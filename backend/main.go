package main

import (
	"encoding/json"
	"fmt"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"sync"
)

type Trailer struct {
	ID          int      `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	ImageUrl    string   `json:"imageUrl"`
	Features    []string `json:"features"`
}

var (
	trailers []Trailer
	mutex    sync.Mutex
	dataFile = "trailers_v2.json"
)

func init() {
	loadTrailers()
}

func loadTrailers() {
	file, err := os.ReadFile(dataFile)
	if err != nil {
		trailers = []Trailer{
			{ID: 1, Title: "Усиленный грузовой прицеп", Description: "Прочный открытый грузовой прицеп, идеально подходящий для перевозки оборудования, квадроциклов и тяжелых грузов. Надежная стальная конструкция.", Price: 2500, ImageUrl: "/utility_trailer.png", Features: []string{"Стальная рама", "Откидной трап", "15-дюймовые колеса"}},
			{ID: 2, Title: "Закрытый фургон-прицеп", Description: "Обеспечьте безопасность и сохранность вашего груза с помощью этого современного закрытого прицепа. Влагозащищенный корпус.", Price: 4800, ImageUrl: "/cargo_trailer.png", Features: []string{"Защита от влаги", "Боковая дверь", "Задняя дверь-трап"}},
			{ID: 3, Title: "Прицеп для лодок Pro", Description: "Премиальный лодочный прицеп для удобного спуска на воду. Регулируемые направляющие под любую форму корпуса.", Price: 3200, ImageUrl: "/boat_trailer.png", Features: []string{"Оцинкованная рама", "Регулируемые упоры", "Водонепроницаемые фары"}},
		}
		saveTrailers()
		return
	}
	json.Unmarshal(file, &trailers)
}

func saveTrailers() {
	data, _ := json.MarshalIndent(trailers, "", "  ")
	os.WriteFile(dataFile, data, 0644)
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func trailersHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "OPTIONS" {
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	switch r.Method {
	case "GET":
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(trailers)
	case "POST":
		var t Trailer
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		t.ID = 1
		if len(trailers) > 0 {
			t.ID = trailers[len(trailers)-1].ID + 1
		}
		trailers = append(trailers, t)
		saveTrailers()
		json.NewEncoder(w).Encode(t)
	case "PUT":
		var t Trailer
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		for i, tr := range trailers {
			if tr.ID == t.ID {
				trailers[i] = t
				saveTrailers()
				json.NewEncoder(w).Encode(t)
				return
			}
		}
		http.Error(w, "Trailer not found", http.StatusNotFound)
	case "DELETE":
		idStr := r.URL.Query().Get("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}
		for i, tr := range trailers {
			if tr.ID == id {
				trailers = append(trailers[:i], trailers[i+1:]...)
				saveTrailers()
				w.WriteHeader(http.StatusOK)
				return
			}
		}
		http.Error(w, "Trailer not found", http.StatusNotFound)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" || r.URL.Path == "/index.html" {
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	}

	path := filepath.Join(h.staticPath, r.URL.Path)
	isAsset := filepath.Ext(path) != ""

	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		if isAsset {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func main() {
	mime.AddExtensionType(".css", "text/css; charset=utf-8")
	mime.AddExtensionType(".js", "application/javascript")
	mime.AddExtensionType(".svg", "image/svg+xml")

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
