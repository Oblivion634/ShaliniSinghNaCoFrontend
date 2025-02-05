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

// Array to keep track of active toasters
let activeToasters = [];

function showToaster(message) {
  const toaster = document.createElement("div"); 
  toaster.className = "toaster";  
  toaster.textContent = message; 

  // Calculate dynamic position based on existing toasters
  const offset = activeToasters.length * 50; // Adjust the gap between toasters
  toaster.style.position = "fixed";
  toaster.style.bottom = `${30 + offset}px`; // Stack toasters below each other
  toaster.style.right = "20px";
  toaster.style.padding = "10px";
  toaster.style.backgroundColor = "#333";
  toaster.style.color = "#fff";
  toaster.style.borderRadius = "5px";
  toaster.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  toaster.style.zIndex = "9999";
  toaster.style.transition = "opacity 0.3s ease-in-out";

  // Progress bar setup
  const progressBarContainer = document.createElement("div");
  progressBarContainer.style.position = "relative";
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.height = "5px";
  progressBarContainer.style.backgroundColor = "#ddd";
  progressBarContainer.style.marginTop = "5px";
  toaster.appendChild(progressBarContainer);

  const progressBar = document.createElement("div");
  progressBar.style.position = "absolute";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "100%";
  progressBar.style.width = "100%";
  progressBar.style.backgroundColor = "#f0a500";
  progressBarContainer.appendChild(progressBar);

  document.body.appendChild(toaster);
  activeToasters.push(toaster); // Add to queue

  // Progress bar animation
  let timeLeft = 5;
  const interval = setInterval(() => {
    timeLeft -= 0.1;
    progressBar.style.width = `${(timeLeft / 5) * 100}%`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      removeToaster(toaster);
    }
  }, 100);

  // Remove toaster after 5 seconds
  setTimeout(() => {
    clearInterval(interval);
    removeToaster(toaster);
  }, 5000);

  return toaster; // ✅ Return toaster element
}


// Function to remove toaster and adjust positions
function removeToaster(toaster) {
  toaster.style.opacity = "0"; // Fade out before removal
  setTimeout(() => {
    toaster.remove();
    activeToasters = activeToasters.filter(t => t !== toaster); // Remove from queue
    updateToasterPositions();
  }, 300); // Delay to allow fade-out effect
}

// Update positions of remaining toasters
function updateToasterPositions() {
  activeToasters.forEach((toaster, index) => {
    toaster.style.bottom = `${20 + index * 50}px`; // Reposition remaining toasters
  });
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
      showToaster("Task added.");
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
    showToaster("Task Added.");
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
  const undoToaster = showToaster("Task removed."); // ✅ Get toaster reference

  if (!undoToaster) return; // Prevent errors if toaster is null

  // Add Undo Button
  const undoButton = document.createElement("button");
  undoButton.textContent = "Undo";
  undoButton.style.marginLeft = "10px";
  undoButton.style.marginTop="10px";
  undoButton.style.padding = "5px 10px";
  undoButton.style.border = "none";
  undoButton.style.borderRadius = "5px";
  undoButton.style.backgroundColor = "#f0a500";
  undoButton.style.color = "#fff";
  undoButton.style.cursor = "pointer";

  undoButton.addEventListener("click", undoAction);

  undoToaster.appendChild(undoButton); // ✅ Append button properly
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
  });

  showToaster(`${selectedTasks.length} task(s) shifted to To-Do List.`); // Show a single toaster message
  saveData(); // Save updated data to localStorage
});


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
  });
  showToaster(`${selectedTasks.length} task(s) shifted to Complete List.`); // Show a single toaster message
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
