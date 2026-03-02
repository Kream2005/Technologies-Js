let id = 1
localStorage.setItem('id', id.toString());

var todoList = [{
  name: 'review course',
  dueDate: '2025-09-29',
  id: 1
}];

renderTodoList();

function renderTodoList() {
  let todoListHTML = '';

  // Loop over every toDo object and append it to "todoListHTML"
  // Show the objects inside the class "js-todo-list"
  // Loop over evey delete button and add an eventListener that deletes the toDo and rerender the Tasks
  
  for (let todo of todoList){
    todoListHTML += `
      <div>
        <span>${todo.name}</span>
        <span>${todo.dueDate}</span>
        <button class = "delete-todo-button" data-id=${todo.id}>Delete</button>
      </div>
    `
  }

  document.querySelector('.js-todo-list').innerHTML = todoListHTML
  document.querySelectorAll('.delete-todo-button')
    .forEach(button => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.id);
        delete_todo(id);
      });
    });
}



const delete_todo = (id) => {
  todoList = todoList.filter(todo => todo.id !== id)
  renderTodoList();
}

document.querySelector('.js-add-todo-button')
  .addEventListener('click', (id) => {
    addTodo(id);
  });


function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputElement.value;
  let newId = Number(localStorage.getItem("id")) + 1;
  localStorage.setItem("id", newId.toString());
  todoList.push({ name, dueDate, id: newId });
  inputElement.value = '';

  renderTodoList();
}