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
function addItem(item, dueDate, priority, completed) {
  todoList.push({ item, dueDate, priority, completed });
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
function editItem(index, newValue, newDueDate, newPriority, newCompleted) {
  todoList[index].item = newValue;
  todoList[index].dueDate = newDueDate;
  todoList[index].priority = newPriority;
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

document.getElementById('sortOption').addEventListener('change', (event) => {
  const selectedOption = event.target.value;
  sortTasks(selectedOption);
});

function renderList() {
  const listContainer = document.getElementById('container-list');
  listContainer.innerHTML = '';

  const orderedList = document.createElement('ol');

  todoList.forEach((itemData, index) => {
    const listItem = document.createElement('li');

    const itemText = document.createElement('span');
    itemText.textContent = itemData.item;

    // DueDateText
    const dueDateText = document.createElement('span');
    dueDateText.textContent = itemData.dueDate;
    dueDateText.classList.add('due-date');

    //PriorityText
    const priorityText = document.createElement('span');
    priorityText.textContent = itemData.priority;
    priorityText.classList.add('priority');

    const input = document.createElement('input');
    input.type = 'text';
    input.style.display = 'none';

    //DueDateValue
    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.style.display = 'none';

    // PrioityValue
    const priorityInput = document.createElement('select');
    priorityInput.innerHTML = `
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    `;
    priorityInput.style.display = 'none';

    // CheckBox
    const completedCheckbox = document.createElement('input');
    completedCheckbox.type = 'checkbox';
    completedCheckbox.checked = itemData.completed;
    completedCheckbox.addEventListener('change', () => {
      toggleTaskCompletionStatus(index, completedCheckbox.checked);
    });

    // CheckMark
    const checkmark = document.createElement('span');
    checkmark.innerHTML = '&#10003;'; // Checkmark symbol
    checkmark.style.display = itemData.completed ? 'inline' : 'none';
    checkmark.classList.add('checkmark'); // Add the 'checkmark' class name

    // EditButton
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => {
      editButton.style.display = 'none';
      itemText.style.display = 'none';
      input.style.display = 'inline';
      input.value = itemData.item;
      dueDateText.style.display = 'none';
      dueDateInput.style.display = 'inline';
      dueDateInput.value = itemData.dueDate;
      priorityText.style.display = 'none';
      priorityInput.style.display = 'inline';
      priorityInput.value = itemData.priority;
      saveButton.style.display = 'inline';
    });

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      removeItem(index);
      renderList();
    });

    // SaveButton
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.display = 'none';
    saveButton.addEventListener('click', () => {
      const newValue = input.value.trim();
      const newDueDate = dueDateInput.value;
      const newPriority = priorityInput.value;
      if (newValue !== '') {
        editItem(index, newValue, newDueDate, newPriority, itemData.completed);
        input.style.display = 'none';
        dueDateInput.style.display = 'none';
        priorityInput.style.display = 'none';
        saveButton.style.display = 'none';
        itemText.style.display = 'inline';
        dueDateText.style.display = 'inline';
        priorityText.style.display = 'inline';
        editButton.style.display = 'inline';
        renderList();
      }
    });

    listItem.appendChild(completedCheckbox);
    listItem.appendChild(checkmark);
    listItem.appendChild(itemText);
    listItem.appendChild(input);
    listItem.appendChild(dueDateText);
    listItem.appendChild(dueDateInput);
    listItem.appendChild(priorityText);
    listItem.appendChild(priorityInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    listItem.appendChild(saveButton);
    orderedList.appendChild(listItem);
  });

  listContainer.appendChild(orderedList);
}


// Function to SaveItems
function saveItem() {
  const input = document.getElementById('container-input');
  const item = input.value.trim();
  const dueDateInput = document.getElementById('dueDateInput');
  const dueDate = dueDateInput.value;
  const priorityInput = document.getElementById('priorityInput');
  const priority = priorityInput.value;

  if (item !== '') {
    addItem(item, dueDate, priority, false); // Set completed as false for new tasks
    input.value = '';
    dueDateInput.value = '';
    priorityInput.value = 'low';
    saveTodoListToLocalStorage();
    renderList();
  }
}

const saveButton = document.getElementById('container-save');
saveButton.addEventListener('click', saveItem);

// Rendering for PageReloads
renderList();
