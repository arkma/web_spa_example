var taskInput = document.getElementById("new-task");
var addButton = document.getElementById("new-task-btn");
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");

/* Task Object definition
taskObject = {
  id: "random_id",
  text: "task_text"
  done: "false"|"true"
}
*/


// // CRUD OPERATIONS
// function saveTask(taskObject) {
//     let todos;
    
//     if (localStorage.getItem("todos_items") === null) {
//       todos = [];
//     } else {
//       todos = JSON.parse(localStorage.getItem("todos_items"));
//     }
    
//     todos.push(taskObject);
//     localStorage.setItem("todos_items", JSON.stringify(todos));
// }

// function removeTask(taskObject) {
//     let todos;
    
//     if (localStorage.getItem("todos_items") === null) {
//       return;
//     }
//     todos = JSON.parse(localStorage.getItem("todos_items"));
//     for (let i = 0; i < todos.length; i++) {
//       if (todos[i].id === taskObject.id) {
//         todos.splice(i, 1);
//       }
//     }
  
//     localStorage.setItem("todos_items", JSON.stringify(todos));
//   }
  
//   function getAllTasks() {
//     let todos;
    
//     if (localStorage.getItem("todos_items") === null) {
//       todos = [];
//     }
//     else {
//       todos = JSON.parse(localStorage.getItem("todos_items"));
//     }
//     return todos;
//   }
  
//   function updateTask(taskObject) {
//     let todos;
    
//     if (localStorage.getItem("todos_items") === null) {
//       return;
//     }
//     todos = JSON.parse(localStorage.getItem("todos_items"));
//     for (let i = 0; i < todos.length; i++) {
//       if (todos[i].id === taskObject.id) {
//         todos[i] = taskObject;
//       }
//     }
//     localStorage.setItem("todos_items", JSON.stringify(todos));
//   }
//   // END CRUD OPERATIONS


const apiAddress = "http://localhost:3000";

async function saveTask(taskObject) {
    try {
      // send POST request with user input as the req body
      const response = await fetch(`${apiAddress}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskObject),
      });
  
      const result = await response.json();
      console.log("Success:", result.message);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  async function getAllTasks() {
    try {
      const response = await fetch(`${apiAddress}/tasks`)
      if (!response.ok) throw new Error(response.statusText)
      const json = await response.json()
      console.log(json)
      return json
    } catch (err) {
      console.error(err.message || err)
    }
  }
  
  async function removeTask(taskObject) {
    try {
      // send POST request with user input as the req body
      const response = await fetch(`${apiAddress}/tasks/${taskObject.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
      console.log("Success:", result.message);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  async function updateTask(taskObject) {
    try {
      // send POST request with user input as the req body
      const response = await fetch(`${apiAddress}/tasks/${taskObject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskObject),
      });
  
      const result = await response.json();
      console.log("Success:", result.message);
    } catch (error) {
      console.error("Error:", error);
    }
  }


// Helpers
function createTaskObject(taskText) {
    return {
      id: crypto.randomUUID(),
      text: taskText,
      done: "false"
    }
}
  
  function createTaskObjectFromElement(taskElement) {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*
    return {
      id: taskElement.getAttribute('data-task-id'),
      text: taskElement.querySelector('label').innerText,
      done: taskElement.getAttribute('data-task-done')
    }
  }
  

  var createNewTaskElement = function(taskObject) {
	// create List Item
    var listItem = document.createElement("li");
    // input checkbox
    var checkBox = document.createElement("input");
    // label
    var label = document.createElement("label");
    // input (text)
    var editInput = document.createElement("input");
    // button.edit
    var editButton = document.createElement("button");
    // button.delete
    var deleteButton = document.createElement("button");
    //Each element needs modified 
    
    checkBox.type = "checkBox";
    checkBox.checked = taskObject.done == "true" ? true : false;

    editInput.type = "text";
    
    editButton.innerText = "Edit";
    editButton.className = "edit";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";
    
    label.innerText = taskObject.text;
    listItem.setAttribute('data-task-id', taskObject.id);
    listItem.setAttribute('data-task-done', taskObject.done);
    
    // Each element needs appending
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
  
    return listItem;
}

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
    console.log("Bind List item events");
    // select listitems chidlren
    var checkBox = taskListItem.querySelector('input[type="checkbox"]');
    var editButton = taskListItem.querySelector("button.edit");
    var deleteButton = taskListItem.querySelector("button.delete");
    //bind editTask to edit button
    editButton.onclick = editTask;
    //bind deleteTask to delete button
     deleteButton.onclick = deleteTask;
    //bind checkBoxEventHandler to checkbox
    checkBox.onchange = checkBoxEventHandler;
  
  }

  

// Task actions
var addTask = function() {
    console.log("Adding new task...")
    taskObject = createTaskObject(taskInput.value);
 
    var listItem = createNewTaskElement(taskObject);
    saveTask(taskObject);

    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
    taskInput.value = "";
}

var editTask = function() {
    console.log("Edit Task...");
  
  var listItem = this.parentNode;
    
  var editInput = listItem.querySelector("input[type=text]");
  var label = listItem.querySelector("label");
  /*
  https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
  */
  var containsClass = listItem.classList.contains("editMode");
  
  // if class of the parent is .editMode
  if (containsClass) {
      //Switch from .editMode
      //label text become the input's value
      label.innerText = editInput.value;
      taskObject = createTaskObjectFromElement(listItem)
      updateTask(taskObject);
  } else {
      //Switch to .editMode
      //input value becomes the labels text
     	editInput.value = label.innerText;
  }
  //Toggle .editMode on the parent 
  listItem.classList.toggle("editMode");
}

var deleteTask = function () {
    console.log("Delete Task...");
  	var listItem = this.parentNode;
    taskObject = createTaskObjectFromElement(listItem);
    removeTask(taskObject);

    //Remove the parent list item from the ul
  	var ul = listItem.parentNode;
  
  	ul.removeChild(listItem);
}

var taskCompleted = function() {
    console.log("Task Complete...");
   //When the Checkbox is checked 
   //Append the task list item to the #completed-tasks ul
    var listItem = this.parentNode;

    taskObject = createTaskObjectFromElement(listItem);
    taskObject.done = "true";
    updateTask(taskObject);

    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
 }

var taskIncomplete = function() {
  console.log("Task Incomplete...");
 	//When the checkbox is unchecked appendTo #incomplete-tasks
  var listItem = this.parentNode;
  taskObject = createTaskObjectFromElement(listItem);
  taskObject.done = "false";
  updateTask(taskObject);
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
}




// Event listener for a new task
addButton.addEventListener("click", addTask); 



// all_tasks = getAllTasks()
// console.log("All tasks: ", all_tasks);
// all_tasks.forEach(function (taskObject) {
//   var listItem = createNewTaskElement(taskObject);
//   if (taskObject.done == "true") {
//     completedTasksHolder.appendChild(listItem);
//     bindTaskEvents(listItem, taskIncomplete);
//   } else {
//     incompleteTasksHolder.appendChild(listItem);
//     bindTaskEvents(listItem, taskCompleted);
//   }

// });


// Load tasks from local storage/database
all_tasks = getAllTasks().then(function (tasks) {
    tasks.forEach(function (taskObject) {
      var listItem = createNewTaskElement(taskObject);
      if (taskObject.done == "true") {
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete);
      } else {
        incompleteTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);
      }
    });
  });
  


