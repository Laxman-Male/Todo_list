package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

type TodoFromFrontEnd struct {
	Id          int    `json:"Id"`
	Title       string `json:"title"`
	IsCompleted bool   `json:"isCompleted"`
}

var BackTodo []TodoFromFrontEnd
var nextID = 1

func handleTodo(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "application/json") // browser is sending json data
		json.NewEncoder(w).Encode(BackTodo)
		return

	} else if r.Method == http.MethodPost {
		var newTodo TodoFromFrontEnd
		//Decode json body into newTodo struct
		err := json.NewDecoder(r.Body).Decode(&newTodo)
		if err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}
		//set unique ID
		newTodo.Id = nextID
		nextID++

		//add to the already available memory-slice
		BackTodo = append(BackTodo, newTodo)

		//response back with the new todo in JSON
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(newTodo)
	} else {
		http.Error(w, "Didn't post", http.StatusMethodNotAllowed)
	}
}
func handleDelete(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodDelete {
		idStr := r.URL.Path[len("/todos/"):]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "invalid id", http.StatusBadRequest)
			return
		}
		var updateTodo []TodoFromFrontEnd
		for _, todo := range BackTodo {
			if todo.Id == id {
				continue
			} else {
				updateTodo = append(updateTodo, todo)
			}
		}
		BackTodo = updateTodo

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(BackTodo)
		return
	} else {
		http.Error(w, "Didn't post", http.StatusMethodNotAllowed)
	}
}

var completedTodo []TodoFromFrontEnd

func handleDone(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodPatch {
		idStr := r.URL.Path[len("/todos/"):]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "invalid id", http.StatusBadRequest)
			return
		}
		// var updateTodo []TodoFromFrontEnd
		for i, todo := range BackTodo {
			if todo.Id == id {
				BackTodo[i].IsCompleted = true
				completedTodo = append(completedTodo, BackTodo[i])
				// if BackTodo[i].Id == id {
				// 	BackTodo[i].IsCompleted = true
				// }

			} else {
				continue
			}
		}
		// completed = updateTodo

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(completedTodo)
		return
	} else {
		http.Error(w, "Didn't post", http.StatusMethodNotAllowed)
	}
}

func handleCompleted(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(completedTodo)
	// return completedTodo
}
func handlePending(w http.ResponseWriter, r *http.Request) {
	var pendingArr []TodoFromFrontEnd
	// extractLink:= r.URL.Path[len("/todos"):]
	for i, todo := range BackTodo {
		if BackTodo[i].IsCompleted == false {
			pendingArr = append(pendingArr, todo)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pendingArr)
	return

}

func handleAllMethod(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		handleTodo(w, r)
	case http.MethodPost:
		handleTodo(w, r)
	case http.MethodDelete:
		handleDelete(w, r)
	case http.MethodPatch:
		handleDone(w, r)
	}
}

func main() {

	fmt.Println("todo ")
	// http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	fmt.Fprintln(w, "Server is working!")
	// })
	http.Handle("/", http.FileServer(http.Dir("./frontEnd")))
	// http.HandleFunc("/todos", handleTodo)
	// http.HandleFunc("/todos/", handleDelete)
	http.HandleFunc("/todos", handleAllMethod)
	http.HandleFunc("/todos/", handleAllMethod)
	http.HandleFunc("/todos/completed", handleCompleted)
	http.HandleFunc("/todos/pending", handlePending)
	fmt.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))

}

//add db
