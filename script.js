// Light Mode - Dark Mode
var toggled = false;
var hTag = document.getElementsByTagName("h3")[0];
var h1Tag = document.getElementsByTagName("h1")[0];
var bodyTag = document.getElementsByTagName("body")[0];
var circle = document.getElementById("circle");

document.getElementById("outer").onclick = function () {
  if (!toggled) {
    hTag.classList.add("white");
    h1Tag.classList.add("white");
    bodyTag.classList.add("rgba");
    circle.style.marginLeft = "33px";
    toggled = true;
  } else {
    hTag.classList.remove("white");
    h1Tag.classList.remove("white");
    bodyTag.classList.remove("rgba");
    circle.style.marginLeft = "1px";
    toggled = false;
  }
};

// To Initialise the array with Local Storage or simply initialising with an empty array if local storage is empty
let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

// Function to save Task to Local Storage
function saveTodoListToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

// Function to Add a Task
function addItem(item, dueDate, priority, category, tags, completed) {
  todoList.push({ item, dueDate, priority, category, tags, subtasks: [], completed });
  saveTodoListToLocalStorage();
  renderList();
}

// Function to Remove the task
function removeItem(index) {
  todoList.splice(index, 1);
  saveTodoListToLocalStorage();
  renderList();
}

// Function to Edit Items of Tasks
function editItem(index, newValue, newDueDate, newPriority, newCategory, newTags, newCompleted) {
  todoList[index].item = newValue;
  todoList[index].dueDate = newDueDate;
  todoList[index].priority = newPriority;
  todoList[index].category = newCategory;
  todoList[index].tags = newTags;
  todoList[index].completed = newCompleted;
  saveTodoListToLocalStorage();
  const sortOption = document.getElementById('sortOption').value;
  sortTasks(sortOption);
}

// Function to toggle over Task for completion
function toggleTaskCompletionStatus(index, completed) {
  todoList[index].completed = completed;
  saveTodoListToLocalStorage();
  renderList();
}

// Function to toggle subtask completion status
function toggleSubtaskCompletionStatus(taskIndex, subtaskName, completed) {
  const subtaskIndex = todoList[taskIndex].subtasks.findIndex(subtask => subtask.name === subtaskName);
  if (subtaskIndex !== -1) {
    todoList[taskIndex].subtasks[subtaskIndex].completed = completed;
    saveTodoListToLocalStorage();
    renderFilteredList(todoList); // Render the filtered list to show the updated subtask status
  }
}


// Function to Sort Tasks
function sortTasks(sortOption) {
  switch (sortOption) {
    case 'dueDate':
      todoList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case 'priority':
      const priorityOrder = { 'low': 2, 'medium': 1, 'high': 0 };
      todoList.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      break;
    default:
      break;
  }
  renderList();
}

// Function to Add a Subtask
function addSubtaskToList(index, subtaskText) {
  if (!todoList[index].subtasks) {
    todoList[index].subtasks = [];
  }
  todoList[index].subtasks.push({ task: subtaskText, completed: false });
  saveTodoListToLocalStorage();
  renderList();
}

// Function to Remove a Subtask
function removeSubtask(index, itemData, subtask) {
  if (itemData.subtasks && Array.isArray(itemData.subtasks)) {
    const subtaskIndex = itemData.subtasks.indexOf(subtask);
    if (subtaskIndex !== -1) {
      itemData.subtasks.splice(subtaskIndex, 1);
      saveTodoListToLocalStorage();
      renderList();
    }
  }
}

function renderList() {
  const listContainer = document.getElementById('container-list');
  listContainer.innerHTML = '';

  todoList.forEach((itemData, index) => {
    const listItem = document.createElement('li');
    const completedCheckbox = document.createElement('input');
    const checkmark = document.createElement('span');
    const itemText = document.createElement('span');
    const input = document.createElement('input');
    const dueDateText = document.createElement('span');
    const dueDateInput = document.createElement('input');
    const priorityText = document.createElement('span');
    const priorityInput = document.createElement('select');
    const categoryText = document.createElement('span');
    const categoryInput = document.createElement('select');
    const tagsText = document.createElement('span');
    const tagsInput = document.createElement('input');
    const subtasksContainer = document.createElement('div'); // Added for subtasks
    const saveButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');

    // Set up task item properties
    itemText.textContent = itemData.item;
    completedCheckbox.type = 'checkbox';
    completedCheckbox.checked = itemData.completed;
    completedCheckbox.addEventListener('change', () => {
      toggleTaskCompletionStatus(index, completedCheckbox.checked);
    });
    checkmark.textContent = '\u2713';
    checkmark.classList.add('checkmark');
    checkmark.style.display = itemData.completed ? 'inline' : 'none';
    input.type = 'text';
    input.style.display = 'none';
    input.value = itemData.item;
    dueDateText.textContent = itemData.dueDate;
    dueDateText.classList.add('due-date');
    dueDateInput.type = 'date';
    dueDateInput.style.display = 'none';
    dueDateInput.value = itemData.dueDate;
    priorityText.textContent = itemData.priority;
    priorityText.classList.add('priority');
    priorityInput.innerHTML = `
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    `;
    priorityInput.style.display = 'none';
    priorityInput.value = itemData.priority;
    categoryText.textContent = itemData.category;
    categoryText.classList.add('category');
    categoryInput.innerHTML = `
      <option value="default">Select Category</option>
      <option value="work">Work</option>
      <option value="personal">Personal</option>
      <option value="shopping">Shopping</option>
    `;
    categoryInput.style.display = 'none';
    categoryInput.value = itemData.category;
    tagsText.textContent = itemData.tags ? itemData.tags.join(', ') : '';
    tagsText.classList.add('tags');
    tagsInput.type = 'text';
    tagsInput.style.display = 'none';
    tagsInput.value = itemData.tags ? itemData.tags.join(', ') : '';

    // Add event listeners to edit and delete buttons
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => {
      editButton.style.display = 'none';
      itemText.style.display = 'none';
      input.style.display = 'inline';
      dueDateText.style.display = 'none';
      dueDateInput.style.display = 'inline';
      priorityText.style.display = 'none';
      priorityInput.style.display = 'inline';
      categoryText.style.display = 'none';
      categoryInput.style.display = 'inline';
      tagsText.style.display = 'none';
      tagsInput.style.display = 'inline';
      saveButton.style.display = 'inline';
    });

    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      removeItem(index);
    });

    // SaveButton
    saveButton.textContent = 'Save';
    saveButton.style.display = 'none';
    saveButton.addEventListener('click', () => {
      const newValue = input.value.trim();
      const newDueDate = dueDateInput.value;
      const newPriority = priorityInput.value;
      const newCategory = categoryInput.value;
      const newTags = tagsInput.value.split(',').map(tag => tag.trim());

      if (newValue !== '') {
        editItem(index, newValue, newDueDate, newPriority, newCategory, newTags, itemData.completed);
        input.style.display = 'none';
        dueDateInput.style.display = 'none';
        priorityInput.style.display = 'none';
        categoryInput.style.display = 'none';
        tagsInput.style.display = 'none';
        saveButton.style.display = 'none';
        itemText.style.display = 'inline';
        dueDateText.style.display = 'inline';
        priorityText.style.display = 'inline';
        categoryText.style.display = 'inline';
        tagsText.style.display = 'inline';
        editButton.style.display = 'inline';
        renderList();
      }
    });

    // Add Subtask Button
    const addSubtaskBtn = document.createElement('button');
    addSubtaskBtn.textContent = 'Add Subtask';
    addSubtaskBtn.addEventListener('click', () => {
      const subtaskText = window.prompt('Enter subtask:');
      if (subtaskText !== null && subtaskText.trim() !== '') {
        addSubtaskToList(index, subtaskText);
      }
    });

    // Render Subtasks
    if (itemData.subtasks && Array.isArray(itemData.subtasks)) {
      itemData.subtasks.forEach(subtask => {
        const subtaskItem = document.createElement('div');
        const subtaskCheckbox = document.createElement('input');
        const subtaskText = document.createElement('span');
        const subtaskDeleteButton = document.createElement('button');

        subtaskText.textContent = subtask.task;
        subtaskCheckbox.type = 'checkbox';
        subtaskCheckbox.checked = subtask.completed;
        subtaskCheckbox.addEventListener('change', () => {
          toggleSubtaskCompletionStatus(index, itemData, subtask, subtaskCheckbox.checked);
        });

        subtaskDeleteButton.textContent = 'Delete';
        subtaskDeleteButton.addEventListener('click', () => {
          removeSubtask(index, itemData, subtask);
        });

        subtaskItem.appendChild(subtaskCheckbox);
        subtaskItem.appendChild(subtaskText);
        subtaskItem.appendChild(subtaskDeleteButton);

        subtasksContainer.appendChild(subtaskItem);
      });
    }

    listItem.appendChild(completedCheckbox);
    listItem.appendChild(checkmark);
    listItem.appendChild(itemText);
    listItem.appendChild(input);
    listItem.appendChild(dueDateText);
    listItem.appendChild(dueDateInput);
    listItem.appendChild(priorityText);
    listItem.appendChild(priorityInput);
    listItem.appendChild(categoryText);
    listItem.appendChild(categoryInput);
    listItem.appendChild(tagsText);
    listItem.appendChild(tagsInput);
    listItem.appendChild(subtasksContainer);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    listItem.appendChild(saveButton);
    listItem.appendChild(addSubtaskBtn);
    listContainer.appendChild(listItem);
  });
}

// Function to render filtered tasks
function renderFilteredList(filteredTasks) {
  const listContainer = document.getElementById('container-list');
  listContainer.innerHTML = '';

  filteredTasks.forEach((itemData, index) => {
    const listItem = document.createElement('li');
    const completedCheckbox = document.createElement('input');
    const checkmark = document.createElement('span');
    const itemText = document.createElement('span');
    const input = document.createElement('input');
    const dueDateText = document.createElement('span');
    const dueDateInput = document.createElement('input');
    const priorityText = document.createElement('span');
    const priorityInput = document.createElement('select');
    const categoryText = document.createElement('span');
    const categoryInput = document.createElement('select');
    const tagsText = document.createElement('span');
    const tagsInput = document.createElement('input');
    const subtasksContainer = document.createElement('div'); // Added for subtasks
    const saveButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');

    // Set up task item properties
    itemText.textContent = itemData.item;
    completedCheckbox.type = 'checkbox';
    completedCheckbox.checked = itemData.completed;
    completedCheckbox.addEventListener('change', () => {
      toggleTaskCompletionStatus(index, completedCheckbox.checked);
    });
    checkmark.textContent = '\u2713';
    checkmark.classList.add('checkmark');
    checkmark.style.display = itemData.completed ? 'inline' : 'none';
    input.type = 'text';
    input.style.display = 'none';
    input.value = itemData.item;
    dueDateText.textContent = itemData.dueDate;
    dueDateText.classList.add('due-date');
    dueDateInput.type = 'date';
    dueDateInput.style.display = 'none';
    dueDateInput.value = itemData.dueDate;
    priorityText.textContent = itemData.priority;
    priorityText.classList.add('priority');
    priorityInput.innerHTML = `
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    `;
    priorityInput.style.display = 'none';
    priorityInput.value = itemData.priority;
    categoryText.textContent = itemData.category;
    categoryText.classList.add('category');
    categoryInput.innerHTML = `
      <option value="default">Select Category</option>
      <option value="work">Work</option>
      <option value="personal">Personal</option>
      <option value="shopping">Shopping</option>
    `;
    categoryInput.style.display = 'none';
    categoryInput.value = itemData.category;
    tagsText.textContent = itemData.tags ? itemData.tags.join(', ') : '';
    tagsText.classList.add('tags');
    tagsInput.type = 'text';
    tagsInput.style.display = 'none';
    tagsInput.value = itemData.tags ? itemData.tags.join(', ') : '';

    // Add event listeners to edit and delete buttons
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => {
      editButton.style.display = 'none';
      itemText.style.display = 'none';
      input.style.display = 'inline';
      dueDateText.style.display = 'none';
      dueDateInput.style.display = 'inline';
      priorityText.style.display = 'none';
      priorityInput.style.display = 'inline';
      categoryText.style.display = 'none';
      categoryInput.style.display = 'inline';
      tagsText.style.display = 'none';
      tagsInput.style.display = 'inline';
      saveButton.style.display = 'inline';
    });

    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      removeItem(index);
    });

    // SaveButton
    saveButton.textContent = 'Save';
    saveButton.style.display = 'none';
    saveButton.addEventListener('click', () => {
      const newValue = input.value.trim();
      const newDueDate = dueDateInput.value;
      const newPriority = priorityInput.value;
      const newCategory = categoryInput.value;
      const newTags = tagsInput.value.split(',').map(tag => tag.trim());

      if (newValue !== '') {
        editItem(index, newValue, newDueDate, newPriority, newCategory, newTags, itemData.completed);
        input.style.display = 'none';
        dueDateInput.style.display = 'none';
        priorityInput.style.display = 'none';
        categoryInput.style.display = 'none';
        tagsInput.style.display = 'none';
        saveButton.style.display = 'none';
        itemText.style.display = 'inline';
        dueDateText.style.display = 'inline';
        priorityText.style.display = 'inline';
        categoryText.style.display = 'inline';
        tagsText.style.display = 'inline';
        editButton.style.display = 'inline';
        renderList();
      }
    });

    // Add Subtask Button
    const addSubtaskBtn = document.createElement('button');
    addSubtaskBtn.textContent = 'Add Subtask';
    addSubtaskBtn.addEventListener('click', () => {
      const subtaskText = window.prompt('Enter subtask:');
      if (subtaskText !== null && subtaskText.trim() !== '') {
        addSubtaskToList(index, subtaskText);
      }
    });

    // Render Subtasks
    if (itemData.subtasks && Array.isArray(itemData.subtasks)) {
      itemData.subtasks.forEach(subtask => {
        const subtaskItem = document.createElement('div');
        const subtaskCheckbox = document.createElement('input');
        const subtaskText = document.createElement('span');
        const subtaskDeleteButton = document.createElement('button');

        subtaskText.textContent = subtask.task;
        subtaskCheckbox.type = 'checkbox';
        subtaskCheckbox.checked = subtask.completed;
        subtaskCheckbox.addEventListener('change', () => {
          toggleSubtaskCompletionStatus(index, itemData, subtask, subtaskCheckbox.checked);
        });

        subtaskDeleteButton.textContent = 'Delete';
        subtaskDeleteButton.addEventListener('click', () => {
          removeSubtask(index, itemData, subtask);
        });

        subtaskItem.appendChild(subtaskCheckbox);
        subtaskItem.appendChild(subtaskText);
        subtaskItem.appendChild(subtaskDeleteButton);

        subtasksContainer.appendChild(subtaskItem);
      });
    }

    listItem.appendChild(completedCheckbox);
    listItem.appendChild(checkmark);
    listItem.appendChild(itemText);
    listItem.appendChild(input);
    listItem.appendChild(dueDateText);
    listItem.appendChild(dueDateInput);
    listItem.appendChild(priorityText);
    listItem.appendChild(priorityInput);
    listItem.appendChild(categoryText);
    listItem.appendChild(categoryInput);
    listItem.appendChild(tagsText);
    listItem.appendChild(tagsInput);
    listItem.appendChild(subtasksContainer);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    listItem.appendChild(saveButton);
    listItem.appendChild(addSubtaskBtn);
    listContainer.appendChild(listItem);
  });
}


// Function to perform search based on user input
function searchTasks() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
  const filteredTasks = todoList.filter(task => {
    // Check if the task name, category, or any tag contains the search input
    return (
      task.item.toLowerCase().includes(searchInput) ||
      (task.category && task.category.toLowerCase().includes(searchInput)) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchInput)))
    );
  });

  renderFilteredList(filteredTasks);
}


// Function to Save Items
function saveItem() {
  const input = document.getElementById('container-input');
  const item = input.value.trim();
  const dueDateInput = document.getElementById('dueDateInput');
  const dueDate = dueDateInput.value;
  const priorityInput = document.getElementById('priorityInput');
  const priority = priorityInput.value;
  const categoryInput = document.getElementById('categoryInput');
  const category = categoryInput.value;
  const tagsInput = document.getElementById('tagsInput');
  const tags = tagsInput.value.split(',').map(tag => tag.trim());

  if (item !== '') {
    addItem(item, dueDate, priority, category, tags, false); // Set completed as false for new tasks
    input.value = '';
    dueDateInput.value = '';
    priorityInput.value = 'low';
    categoryInput.value = 'default';
    tagsInput.value = '';
    saveTodoListToLocalStorage();
    renderList();
  }
}

// Event listener for Save button
const saveButton = document.getElementById('container-save');
saveButton.addEventListener('click', saveItem);

// Event listener for Sort option
document.getElementById('sortOption').addEventListener('change', (event) => {
  const selectedOption = event.target.value;
  sortTasks(selectedOption);
});

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', searchTasks);

// Rendering for Page Reloads
renderList();
