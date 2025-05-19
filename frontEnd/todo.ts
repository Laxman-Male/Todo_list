console.log("stating tsc")

class Todo {
   Id: number;
   title: string;
   isCompleted: boolean;
   constructor(id: number, title: string, isCompleted: boolean) {
      this.Id = id
      this.title = title
      this.isCompleted = isCompleted
   }
}


class TodoManager {

   todoArr: Todo[] = []

   addTodo(title: string) {
      let id: number = this.todoArr.length + 1
      let NewTodo = new Todo(id, title, false);
      this.todoArr.push(NewTodo);
      console.log(this.todoArr)

   }
   getCompletedTodo() {
      return this.todoArr.filter((i) => i.isCompleted == true)
   }
   getIncompleteTodo() {
      return this.todoArr.filter((i) => i.isCompleted == false)
   }
}

let addBtn = document.getElementById("AddBtn")
let TodoInput = document.getElementById("TodoInput") as HTMLInputElement
let mainSection = document.querySelector("mainSection")
let ul = document.getElementById("listUl")
let allListBtn = document.getElementById("All_list") as HTMLButtonElement
let completedTodo = document.getElementById("completedTodo") as HTMLButtonElement
let PendingTodo= document.getElementById("PendingTodo") as HTMLButtonElement
let todoManagerObj = new TodoManager()
//   let deleteBtn= document.createElement("button")

document.addEventListener("DOMContentLoaded", () => {
   addBtn?.addEventListener("click", addList);
});


async function addList(event: Event) {

   console.log("event in add")
   event.preventDefault()
   if (TodoInput.value.trim() === "") {
      alert("Please enter a todo!");
      return;
   }

   try {

      const response = await fetch("http://localhost:8080/todos", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            title: TodoInput.value,
            isCompleted: false
         })
      })
      if (!(response).ok) {
         throw new Error("failed to add todo")
      }
      const data = await response.json()
      console.log("todo added", data)


      console.log("click")
      let eachTodoDiv = document.createElement("div")
      let deleteBtn = document.createElement("button")
      deleteBtn.innerText = "Delete"
      deleteBtn.setAttribute("style", "padding:4px; margin:2px; border-radius:5px")

      deleteBtn.addEventListener("click", async () => {
         const todoId = deleteBtn.getAttribute("data-id")
         if (!todoId) {
            return
         }
         try {
            const res = await fetch(`http://localhost:8080/todos/${todoId}`, {
               method: "DELETE"
            });
            if (!res.ok) {
               throw new Error("failed to delete")
            }
            eachTodoDiv.remove()
         } catch (error) {
            console.log("error in deleting", error)
         }
      })

      deleteBtn.setAttribute("data-id", data.Id.toString());



      let doneBtn = document.createElement("button")
      doneBtn.setAttribute("style", "padding:4px; margin:2px; border-radius:5px")
      doneBtn.innerText = "Done"
      doneBtn.setAttribute("data-id", data.Id.toString());

      doneBtn.addEventListener("click", async () => {
         const todoId = doneBtn.getAttribute("data-id")
         if (!todoId) {
            return
         }
         try {
            const res = await fetch(`http://localhost:8080/todos/${todoId}`, {
               method: "PATCH",
            });
            if (!res.ok) {
               throw new Error("failed to DONE")
            }
            // eachTodoDiv.remove()
            li.style.textDecoration = "line-through";
            doneBtn.style.pointerEvents = "none"

         } catch (error) {
            console.log("error in deleting", error)
         }
      })
      let li = document.createElement("li")
      eachTodoDiv.appendChild(li)
      eachTodoDiv.appendChild(deleteBtn)
      eachTodoDiv.appendChild(doneBtn)
      li.innerText = data.title;
      ul?.prepend(eachTodoDiv);

      // todoManagerObj.addTodo(TodoInput.value)
      TodoInput.value = ""
   } catch (error) {
      console.log("Error", error)
   }

}
document.addEventListener("DOMContentLoaded", () => {
   allListBtn.addEventListener("click", getAllTodolist)
});

console.log("all list btn", allListBtn)


async function getAllTodolist(event: Event) {
   event.preventDefault()

   console.log("all list btn click")
         addBtn!.style.display="block";

   try {

      const response = await fetch("http://localhost:8080/todos", {
         method: "GET",
      });
      if (!response.ok) {
         throw new Error("Failed to fetch todos");
      }
      
      const data = await response.json();
      if(data==null){
         ul!.innerHTML="<h3 style='color:white'> No Todos </h3>"
         return
      }
      ul!.innerHTML = " "
      console.log("all todos after getting from server", data);

      data.forEach((todo: Todo) => {

         let eachTodoDiv = document.createElement("div")
         let deleteBtn = document.createElement("button")
         deleteBtn.innerText = "Delete"
         deleteBtn.setAttribute("style", "padding:4px; margin:2px; border-radius:5px")

         deleteBtn.setAttribute("data-id", todo.Id.toString());
         deleteBtn.addEventListener("click", () => {
            let todoId = deleteBtn.getAttribute("data-id")
            console.log("data after click os get attribute & getting data", todoId)
         })
         deleteBtn.addEventListener("click", async () => {
            const todoId = deleteBtn.getAttribute("data-id")
            if (!todoId) {
               return
            }
            try {
               const res = await fetch(`http://localhost:8080/todos/${todoId}`, {
                  method: "DELETE",
               });
               if (!res.ok) {
                  throw new Error("failed to delete")
               }
               eachTodoDiv.remove()
            } catch (error) {
               console.log("error in deleting", error)
            }
         })

         let doneBtn = document.createElement("button")
         doneBtn.setAttribute("style", "padding:4px; margin:2px; border-radius:5px")
         doneBtn.innerText = "Done"
         doneBtn.setAttribute("data-id", todo.Id.toString());

         doneBtn.addEventListener("click", async () => {
            const todoId = doneBtn.getAttribute("data-id")
            if (!todoId) {
               return
            }
            try {
               const res = await fetch(`http://localhost:8080/todos/${todoId}`, {
                  method: "PATCH",
               });
               if (!res.ok) {
                  throw new Error("failed to DONE")
               }
               // eachTodoDiv.remove()
               li.style.textDecoration = "line-through";
            doneBtn.style.pointerEvents = "none"

            } catch (error) {
               console.log("error in deleting", error)
            }

         })
         let li = document.createElement("li")
         eachTodoDiv.appendChild(li)
         eachTodoDiv.appendChild(deleteBtn)
         li.innerText = todo.title;
         if (todo.isCompleted==true) {
            li.style.textDecoration = "line-through";
            doneBtn.disabled = true;
            doneBtn.style.opacity = "0.1";
            doneBtn.style.cursor = "not-allowed";
         }
         eachTodoDiv.appendChild(doneBtn)

         ul?.prepend(eachTodoDiv);

      });

   }
   catch (error) {
      console.log("Error in catch block", error);
   }
}


completedTodo.addEventListener("click", async () => {
      addBtn!.style.display="none";

   try {

      const response = await fetch("http://localhost:8080/todos/completed", {
         method: "GET",
      });
      if (!response.ok) {
         throw new Error("Failed to fetch todos");
      }
      const data = await response.json()
      if(data==null){
         ul!.innerHTML="<h3 style='color:white'> No Todos </h3>"
         return
      }
      ul!.innerHTML = " "
      data.forEach((todo: Todo) => {
         let eachTodoDiv = document.createElement("div")
         let li = document.createElement("li")
         eachTodoDiv.appendChild(li)
         li.innerText = todo.title;
         ul?.prepend(eachTodoDiv);

      })
   } catch (error) {
      console.log("error in call for complete", error)
   }
})

PendingTodo.addEventListener("click",async ()=>{
   addBtn!.style.display="none";
   try{

      const response= await fetch("http://localhost:8080/todos/pending")
      if(!response.ok){
         throw new Error("error in response")
      }
      const data= await response.json();
      if(data==null){
         ul!.innerHTML="<h3 style='color:white'> No Todos </h3>"
         return
      }
      ul!.innerHTML=""
      data.forEach((todo: Todo) => {
         if(todo.isCompleted==false){
            let eachTodoDiv = document.createElement("div")
            let li = document.createElement("li")
          let deleteBtn = document.createElement("button")
         deleteBtn.innerText = "Delete"
         deleteBtn.setAttribute("style", "padding:4px; margin:2px; border-radius:5px")

         deleteBtn.setAttribute("data-id", todo.Id.toString());
         deleteBtn.addEventListener("click", () => {
            let todoId = deleteBtn.getAttribute("data-id")
            console.log("data after click os get attribute & getting data", todoId)
         })
         deleteBtn.addEventListener("click", async () => {
            const todoId = deleteBtn.getAttribute("data-id")
            if (!todoId) {
               return
            }
            try {
               const res = await fetch(`http://localhost:8080/todos/${todoId}`, {
                  method: "DELETE",
               });
               if (!res.ok) {
                  throw new Error("failed to delete")
               }
               eachTodoDiv.remove()
            } catch (error) {
               console.log("error in deleting", error)
            }
         })

         let doneBtn = document.createElement("button")
         doneBtn.setAttribute("style", "padding:4px; margin:2px; border-radius:5px")
         doneBtn.innerText = "Done"
         doneBtn.setAttribute("data-id", todo.Id.toString());

         doneBtn.addEventListener("click", async () => {
            const todoId = doneBtn.getAttribute("data-id")
            if (!todoId) {
               return
            }
            try {
               const res = await fetch(`http://localhost:8080/todos/${todoId}`, {
                  method: "PATCH",
               });
               if (!res.ok) {
                  throw new Error("failed to DONE")
               }
               // eachTodoDiv.remove()
               li.style.textDecoration = "line-through";
            doneBtn.style.pointerEvents = "none"

            } catch (error) {
               console.log("error in deleting", error)
            }

         })
            eachTodoDiv.appendChild(li)
            eachTodoDiv.appendChild(deleteBtn)
            eachTodoDiv.appendChild(doneBtn)
            li.innerText = todo.title;
            ul?.prepend(eachTodoDiv);
         } else{
            
         }

      })
   }catch(error){
      console.log("error in api call",error)
   }


})


//add db