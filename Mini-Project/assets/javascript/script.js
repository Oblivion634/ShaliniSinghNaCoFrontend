// Select HTML elements
const taskInput = document.getElementById("taskInput"); // Input field to enter tasks
const addTaskBtn = document.getElementById("addTaskBtn"); // Button to add tasks
const removeTaskBtn = document.getElementById("removeTaskBtn"); // Button to remove tasks
const todoList = document.getElementById("todoList"); // The list to store active tasks (To-Do)
const completeList = document.getElementById("completeList"); // The list to store completed tasks
const moveToComplete = document.getElementById("moveToComplete"); // Button to move tasks to Complete list
const moveToTodo = document.getElementById("moveToTodo"); // Button to move tasks to To-Do list
const buttons = document.getElementById("buttons"); // Container for buttons

// Helper function to save data to localStorage
const saveData = () => {
  // Save tasks as an array of text content from todoList and completeList
  localStorage.setItem(
    "todoList",
    JSON.stringify([...todoList.children].map((task) => task.textContent))
  );
  localStorage.setItem(
    "completeList",
    JSON.stringify([...completeList.children].map((task) => task.textContent))
  );
};

// Helper function to load data from localStorage
const loadData = () => {
  // Retrieve saved tasks from localStorage
  const todos = JSON.parse(localStorage.getItem("todoList") || "[]");
  const completed = JSON.parse(localStorage.getItem("completeList") || "[]");

  // Add saved tasks to the respective lists
  todos.forEach((task) => addTaskToList(todoList, task));
  completed.forEach((task) => addTaskToList(completeList, task));
};

// Function to add a task to a list (either To-Do or Complete)
const addTaskToList = (list, taskText) => {
  const li = document.createElement("li"); // Create a new list item (task)
  //Styling for li items
  li.textContent = taskText;
  li.style.borderBottom = "2px solid black";
  li.className = "list-group-item";
  li.addEventListener("click", () => li.classList.toggle("active"));
  list.appendChild(li); // Append the task to the provided list (either To-Do or Complete)
};

//Toaster message functionality for adding tasks
function showAddBox() {
  const addBox = document.createElement("div"); // Create the add box container
  addBox.className = "add-box"; // Assign a class for styling
  addBox.textContent = "Task added. "; // Text content 

  // Style the add box to appear at the bottom-right corner
  addBox.style.position = "fixed";
  addBox.style.bottom = "20px";
  addBox.style.right = "20px";
  addBox.style.padding = "10px";
  addBox.style.backgroundColor = "#333";
  addBox.style.color = "#fff";
  addBox.style.borderRadius = "5px";
  addBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  addBox.style.zIndex = "9999";

  // Create the progress bar container and progress bar
  const progressBarContainer = document.createElement("div");
  progressBarContainer.style.position = "relative";
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.height = "5px";
  progressBarContainer.style.backgroundColor = "#ddd";
  progressBarContainer.style.marginTop = "2px";
  addBox.appendChild(progressBarContainer);

  const progressBar = document.createElement("div");
  progressBar.style.position = "absolute";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "100%";
  progressBar.style.width = "100%";
  progressBar.style.backgroundColor = "#f0a500";
  progressBarContainer.appendChild(progressBar);

  // Append the add box to the body
  document.body.appendChild(addBox);

  // Countdown timer for the progress bar
  let timeLeft = 5; // 5 seconds countdown
  const interval = setInterval(() => {
    timeLeft -= 0.1; // Decrease time by 0.1 seconds every interval
    progressBar.style.width = `${(timeLeft / 5) * 100}%`; // Update progress bar width

    if (timeLeft <= 0) {
      clearInterval(interval); // Stop the countdown
      addBox.remove(); // Remove the box when time is up
    }
  }, 100); // Update every 100ms

  // Automatically hide the box after 5 seconds
  setTimeout(() => {
    clearInterval(interval); // Stop the progress bar countdown
    addBox.remove();
  }, 5000); // Hide after 5 seconds
}

//Function for checking duplicate entries
const isDuplicateTask = (taskText) => {
  const tasks = [
    ...todoList.children,
    ...completeList.children
  ].map((task) => task.textContent.trim().toLowerCase());
  
  return tasks.includes(taskText.trim().toLowerCase());
};


// Event listener for adding a task when "Enter" key is pressed in the input field
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const task = taskInput.value.trim(); // Get the task input value
    if (task === "") {
      alert("Please enter a task!"); // Show an alert if the input is empty
    } else if (isDuplicateTask(task)) {
      alert("Task already exists!"); // Show an alert if the task is a duplicate
    } else {
      addTaskToList(todoList, task); // Add the task to the To-Do list
      taskInput.value = ""; // Clear the input field
      showAddBox();
      saveData(); // Save updated data to localStorage
    }
  }
});


// Event listener for adding a task when the "Add Task" button is clicked
addTaskBtn.addEventListener("click", () => {
  const task = taskInput.value.trim(); // Get the task input value
  if (task === "") {
    alert("Please enter a task!"); // Show an alert if the input is empty
  } else if (isDuplicateTask(task)) {
    alert("Task already exists!"); // Show an alert if the task is a duplicate
  } else {
    addTaskToList(todoList, task); // Add the task to the To-Do list
    taskInput.value = ""; // Clear the input field
    showAddBox();
    saveData(); // Save updated data to localStorage
  }
});

// Variables for Undo functionality
let lastRemovedTasks = []; // Store the last removed tasks temporarily (by text)
let undoTimeout = null; // Store timeout for clearing the undo data

// Function to remove selected tasks
function remove() {
  const tasksToRemove = [
    ...todoList.querySelectorAll(".active"), // Get selected tasks in the To-Do list
    ...completeList.querySelectorAll(".active"), // Get selected tasks in the Complete list
  ];

  if (tasksToRemove.length === 0) {
    alert("Please select a task!"); // Alert if no task is selected
    return; // Exit the function if no task is selected
  }

  let ans = confirm("Are you sure you want to remove the task?"); // Confirm removal
  if (ans) {
    // Save the text content and list (To-Do/Complete) of removed tasks for undo functionality
    lastRemovedTasks = tasksToRemove.map((task) => ({
      text: task.textContent,
      list: task.parentElement === todoList ? "todo" : "complete",
    }));

    tasksToRemove.forEach((task) => task.remove()); // Remove the selected tasks from the DOM
    showUndoBox(); // Show the undo box
    saveData(); // Save updated data to localStorage

    undoTimeout = setTimeout(() => {
      lastRemovedTasks = []; // Clear the last removed tasks after timeout
    }, 5000); // Timeout set for 5 seconds
  } else {
    tasksToRemove.forEach((task) => task.classList.remove("active")); // Remove the selection if cancellation occurs
    saveData(); // Save data after canceling removal
  }
}

// Function to show the Undo Box for a limited time
function showUndoBox() {
  const undoBox = document.createElement("div"); // Create the undo box container
  undoBox.className = "undo-box"; // Assign a class for styling
  undoBox.textContent = "Task removed. "; // Text content for undo message

  // Style the undo box to appear at the bottom-right corner
  undoBox.style.position = "fixed";
  undoBox.style.bottom = "20px";
  undoBox.style.right = "20px";
  undoBox.style.padding = "10px";
  undoBox.style.backgroundColor = "#333";
  undoBox.style.color = "#fff";
  undoBox.style.borderRadius = "5px";
  undoBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  undoBox.style.zIndex = "9999";

  // Create the undo button
  const undoButton = document.createElement("button");
  undoButton.textContent = "Undo"; // Button text
  undoButton.style.marginTop = "10px"; // Add margin to the button
  undoButton.style.padding = "5px 10px"; // Style the button
  undoButton.style.border = "none";
  undoButton.style.borderRadius = "5px";
  undoButton.style.backgroundColor = "#f0a500";
  undoButton.style.color = "#fff";
  undoButton.style.cursor = "pointer";
  undoButton.addEventListener("click", undoAction); // Add event listener to undo action
  undoBox.appendChild(undoButton); // Add button to the undo box

  // Create the progress bar container and progress bar
  const progressBarContainer = document.createElement("div");
  progressBarContainer.style.position = "relative";
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.height = "5px";
  progressBarContainer.style.backgroundColor = "#ddd";
  progressBarContainer.style.marginTop = "2px";
  undoBox.appendChild(progressBarContainer);

  const progressBar = document.createElement("div");
  progressBar.style.position = "absolute";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "100%";
  progressBar.style.width = "100%";
  progressBar.style.backgroundColor = "#f0a500";
  progressBarContainer.appendChild(progressBar);

  // Append the undo box to the body
  document.body.appendChild(undoBox);

  // Countdown timer for the progress bar
  let timeLeft = 5; // 5 seconds countdown
  const interval = setInterval(() => {
    timeLeft -= 0.1; // Decrease time by 0.1 seconds every interval
    progressBar.style.width = `${(timeLeft / 5) * 100}%`; // Update progress bar width

    if (timeLeft <= 0) {
      clearInterval(interval); // Stop the countdown
      undoBox.remove(); // Remove the undo box when time is up
    }
  }, 100); // Update every 100ms

  // Automatically hide the undo box after 5 seconds
  setTimeout(() => {
    clearInterval(interval); // Stop the progress bar countdown
    undoBox.remove();
  }, 5000); // Hide after 5 seconds
}

// Function to undo the removal of tasks
function undoAction() {
  if (lastRemovedTasks.length > 0) {
    lastRemovedTasks.forEach((task) => {
      // Recreate the task element and add it back to the respective list (To-Do/Complete)
      addTaskToList(task.list === "todo" ? todoList : completeList, task.text);
    });

    // Remove the undo box and clear the undo timeout
    const undoBox = document.querySelector(".undo-box");
    if (undoBox) undoBox.remove();
    clearTimeout(undoTimeout);

    // Clear the last removed tasks
    lastRemovedTasks = [];
    saveData(); // Save data after undo
  }
}

//Toaster message functionality for moving tasks from complete list to to-do list
function showTodoBox() {
  const TodoListBox = document.createElement("div"); // Create the todo box container
  TodoListBox.className = "todolist-box"; // Assign a class for styling
  TodoListBox.textContent = "Task shifted to To-do List. "; // Text content 

  //Style the complete box to appear at the bottom-right corner
  TodoListBox.style.position = "fixed";
  TodoListBox.style.bottom = "20px";
  TodoListBox.style.right = "20px";
  TodoListBox.style.padding = "10px";
  TodoListBox.style.backgroundColor = "#333";
  TodoListBox.style.color = "#fff";
  TodoListBox.style.borderRadius = "5px";
  TodoListBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  TodoListBox.style.zIndex = "9999";

  // Create the progress bar container and progress bar
  const progressBarContainer = document.createElement("div");
  progressBarContainer.style.position = "relative";
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.height = "5px";
  progressBarContainer.style.backgroundColor = "#ddd";
  progressBarContainer.style.marginTop = "2px";
  TodoListBox.appendChild(progressBarContainer);

  const progressBar = document.createElement("div");
  progressBar.style.position = "absolute";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "100%";
  progressBar.style.width = "100%";
  progressBar.style.backgroundColor = "#f0a500";
  progressBarContainer.appendChild(progressBar);

  // Append the box to the body
  document.body.appendChild(TodoListBox);

  // Countdown timer for the progress bar
  let timeLeft = 5; // 5 seconds countdown
  const interval = setInterval(() => {
    timeLeft -= 0.1; // Decrease time by 0.1 seconds every interval
    progressBar.style.width = `${(timeLeft / 5) * 100}%`; // Update progress bar width

    if (timeLeft <= 0) {
      clearInterval(interval); // Stop the countdown
      TodoListBox.remove(); // Remove the box when time is up
    }
  }, 100); // Update every 100ms

  // Automatically hide the box after 5 seconds
  setTimeout(() => {
    clearInterval(interval); // Stop the progress bar countdown
    TodoListBox.remove();
  }, 5000); // Hide after 5 seconds
}

// Event listener to move tasks from Complete list back to To-Do list
moveToTodo.addEventListener("click", () => {
  if (completeList.children.length === 0) {
    alert("Complete list is empty!"); // Alert if the Complete list is empty
    return; // Exit the function if the Complete list is empty
  }
  const selectedTasks = [...completeList.querySelectorAll(".active")]; // Get selected tasks

  // Check if no tasks are selected
  if (selectedTasks.length === 0) {
    alert("Please select a task to move!"); // Alert if no task is selected
    return; // Exit if no task is selected
  }

  // Move selected tasks back to the To-Do list
  selectedTasks.forEach((task) => {
    task.classList.remove("active"); // Remove the selection
    todoList.appendChild(task); // Append task back to To-Do list
    showTodoBox(); // Show toaster message
  });
  saveData(); // Save updated data to localStorage
});


//Toaster message functionality for moving tasks from To-do list to complete list
function showCompleteBox() {
  const completeListBox = document.createElement("div"); // Create the complete box container
  completeListBox.className = "completelist-box"; // Assign a class for styling
  completeListBox.textContent = "Task shifted to Complete List. "; // Text content 

  //Style the complete box to appear at the bottom-right corner
  completeListBox.style.position = "fixed";
  completeListBox.style.bottom = "20px";
  completeListBox.style.right = "20px";
  completeListBox.style.padding = "10px";
  completeListBox.style.backgroundColor = "#333";
  completeListBox.style.color = "#fff";
  completeListBox.style.borderRadius = "5px";
  completeListBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  completeListBox.style.zIndex = "9999";

  // Create the progress bar container and progress bar
  const progressBarContainer = document.createElement("div");
  progressBarContainer.style.position = "relative";
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.height = "5px";
  progressBarContainer.style.backgroundColor = "#ddd";
  progressBarContainer.style.marginTop = "2px";
  completeListBox.appendChild(progressBarContainer);

  const progressBar = document.createElement("div");
  progressBar.style.position = "absolute";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "100%";
  progressBar.style.width = "100%";
  progressBar.style.backgroundColor = "#f0a500";
  progressBarContainer.appendChild(progressBar);

  // Append the box to the body
  document.body.appendChild(completeListBox);

  // Countdown timer for the progress bar
  let timeLeft = 5; // 5 seconds countdown
  const interval = setInterval(() => {
    timeLeft -= 0.1; // Decrease time by 0.1 seconds every interval
    progressBar.style.width = `${(timeLeft / 5) * 100}%`; // Update progress bar width

    if (timeLeft <= 0) {
      clearInterval(interval); // Stop the countdown
      completeListBox.remove(); // Remove the box when time is up
    }
  }, 100); // Update every 100ms

  // Automatically hide the box after 5 seconds
  setTimeout(() => {
    clearInterval(interval); // Stop the progress bar countdown
    completeListBox.remove();
  }, 5000); // Hide after 5 seconds
}

// Event listener to move tasks from To-Do list to Complete list
moveToComplete.addEventListener("click", () => {
  if (todoList.children.length === 0) {
    alert("To-Do list is empty!"); // Alert if the To-Do list is empty
    return; // Exit the function if the To-Do list is empty
  }
  const selectedTasks = [...todoList.querySelectorAll(".active")]; // Get selected tasks

  // Check if no tasks are selected
  if (selectedTasks.length === 0) {
    alert("Please select a task to move!"); // Alert if no task is selected
    return; // Exit if no task is selected
  }

  // Move selected tasks to the Complete list
  selectedTasks.forEach((task) => {
    task.classList.remove("active"); // Remove the selection
    completeList.appendChild(task); // Append task to Complete list
    showCompleteBox();
  });
  saveData(); // Save updated data to localStorage
});

// Media query for responsive design (for screens <= 767.5px)
const mediaQuery = window.matchMedia("(max-width: 767.5px)");

// Function to handle media query changes
function handleMediaChange(event) {
  if (event.matches) {
    // If viewport is <= 767.5px (mobile view)
    moveToComplete.innerHTML = "<b>MOVE DOWN &darr;</b>";
    moveToTodo.innerHTML = "<b> &uarr; MOVE UP</b>";
  } else {
    // If viewport is > 767.5px (desktop view)
    moveToComplete.innerHTML = " <b> MOVE TO RIGHT &gt;</b>";
    moveToTodo.innerHTML = "<b> &lt; MOVE TO LEFT</b>";
  }
}

// Listen for media query changes
mediaQuery.addEventListener("change", handleMediaChange);

// Execute the media query handler initially
handleMediaChange(mediaQuery);

//Event Listeners for remove buttons
removeTaskBtn.addEventListener("click", remove);

// Initial data load
loadData();
