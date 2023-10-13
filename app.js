const saveTodoBtn = document.getElementById('save');
const inputElement = document.querySelector('#title');
const todosSectionElement = document.getElementById('todo-lists')

const url = 'http://localhost:8000/todo';

function elementCreation(responseData, ulElemet) {
    for(const todo of responseData.todos){
        const liElemet = document.createElement('li');
        const firstDiv = document.createElement('div');
        const secondDiv = document.createElement('div');
        const pElement = document.createElement('p');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        pElement.textContent = todo.text;
        firstDiv.appendChild(pElement);
        editBtn.textContent = 'Edit';
        deleteBtn.textContent = 'Delete';
        editBtn.classList.add('edit-btn');
        deleteBtn.classList.add('delete-btn');
        secondDiv.appendChild(editBtn);
        secondDiv.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', deleteTodo);
        editBtn.addEventListener('click', updateTodo);
        liElemet.innerHTML = '';

        liElemet.appendChild(firstDiv)
        liElemet.appendChild(secondDiv)
        // console.log(liElemet);
        // liElemet.textContent = todo.text;
        liElemet.dataset.id = todo._id;
        liElemet.classList.add('todo');
        ulElemet.appendChild(liElemet);
        // console.log(todo);
    }

}



async function loadTodos() {
    try {
        
    
    const result = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });

    
    const responseData = await result.json();

    if(responseData.todos.length <= 0){
        console.log(todosSectionElement);
        todosSectionElement.innerHTML = '';
        todosSectionElement.textContent = 'No Todos found, Please create some!';
        return;
    }

    // console.log(responseData.todos);
    const ulElemet = document.createElement('ul');


    // for(const todo of responseData.todos){
    //     const liElemet = document.createElement('li');
    //     const firstDiv = document.createElement('div');
    //     const secondDiv = document.createElement('div');
    //     const pElement = document.createElement('p');
    //     const editBtn = document.createElement('button');
    //     const deleteBtn = document.createElement('button');
    //     pElement.textContent = todo.text;
    //     firstDiv.appendChild(pElement);
    //     editBtn.textContent = 'Edit';
    //     deleteBtn.textContent = 'Delete';
    //     editBtn.classList.add('edit-btn');
    //     deleteBtn.classList.add('delete-btn');
    //     secondDiv.appendChild(editBtn);
    //     secondDiv.appendChild(deleteBtn);
    //     liElemet.innerHTML = '';

    //     liElemet.appendChild(firstDiv)
    //     liElemet.appendChild(secondDiv)
    //     console.log(liElemet);
    //     // liElemet.textContent = todo.text;
    //     liElemet.dataset.id = todo._id;
    //     liElemet.classList.add('todo');
    //     ulElemet.appendChild(liElemet);
    //     console.log(todo);
    // }
    elementCreation(responseData, ulElemet)


    // console.log(ulElemet);
    todosSectionElement.innerHTML = '';
  
    todosSectionElement.appendChild(ulElemet)
} catch (error) {
 alert('Something went wrong!')
}
}


async function addTodo(event) {

    const btnElement = event.target;

    const title = inputElement.value;

    if(!title || title.length > 32){
        alert('Title must have value')
        return;
    };


    let ifIdExist = btnElement.dataset.id;
  
    // saveTodoBtn.dataset.id = null;
    console.log(btnElement.dataset.id );

    if(btnElement.dataset.id && btnElement.dataset.id !== "null"){
        btnElement.dataset.id = null
        saveTodoBtn.dataset.id = null
        await updateHandler(ifIdExist, title);
  
        btnElement.dataset.id
        return;
    }

    console.log(btnElement.dataset.id);

 

    const result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            text: title
        }),
        headers: {
            "Content-Type": "application/json",
        }
    });
    
    inputElement.value = "";
 
    loadTodos();
}

async function deleteTodo(event){

    const deleteBtn = event.target;

    const liElemet = deleteBtn.parentElement.parentElement; 
    const id = liElemet.dataset.id
    
    await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    } );

    loadTodos();
}


async function updateTodo(event){


    const updateBtn = event.target;
    
    
    const liElemet = updateBtn.parentElement.parentElement; 
    const pElement = liElemet.querySelector('p');
    pValue = pElement.textContent;
    inputElement.value = pValue;
    const id = liElemet.dataset.id;
    saveTodoBtn.dataset.id = id;
   

    // await fetch(`${url}/${id}`, {
    //     method: 'PATCH',
    //     body: JSON.stringify({
    //         text
    //     }),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // } );

    // loadTodos();
}


async function updateHandler(btnElement, title) {
    // console.log('Cool');

    const id = btnElement
    await fetch(`${url}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
        text: title
    }),
    headers: {
        'Content-Type': 'application/json'
    }
} );

inputElement.value = '';
saveTodoBtn.dataset.id = 'null'
loadTodos();

}
loadTodos()
saveTodoBtn.addEventListener('click', addTodo);


