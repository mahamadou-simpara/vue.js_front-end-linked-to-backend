
const Todos = {
  data() {
    return {
      isLoading: false,
      todos: [],
      enteredTodoText: "",
      editTodo: null,
      url: 'http://localhost:8000/todo',
    };
  },
  methods: {
    async saveTodo(event) {
      // event.preventDefault();

      if (this.editTodo) {

          const id = this.editTodo._id
    
   
        await fetch(`${this.url}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                text: this.enteredTodoText
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })



        const todoId = this.todos.findIndex((searchId) => {
            // console.log(searchId);
          return searchId._id === id
        });

        // console.log(todoId);

        const updateTodoItem = {
            _id: this.editTodo._id,
            text: this.enteredTodoText
        };

        // console.log(updateTodoItem);
        // console.log(this.todos[todoId]);

        this.todos[todoId] = updateTodoItem;

        this.editTodo = null;
        // console.log(this.editTodo);

      } else {


        const result = await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify({
                text: this.enteredTodoText
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        const responseData = await result.json();

        // console.log(responseData);

        newTodo = {
          text: this.enteredTodoText,
          id: responseData.insertedId,
        };
        this.todos.push(newTodo);
      }
      this.enteredTodoText = "";
    },

    async updatingTodo(todoId) {
        
       this.editTodo = this.todos.find((todo) => {
        return todo._id === todoId;
      });

      this.enteredTodoText = this.editTodo.text;

    },
    async deleteTodo(todo) {

        console.log(todo);
        await fetch(`${this.url}/${todo}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        } );

        this.todos = this.todos.filter((todoItem) => {
            return todoItem._id !== todo;
        })
    }
  },

  async created() {
    this.isLoading = true;
    try {
    
        const result = await fetch(this.url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });
    
        this.isLoading = false;
        const responseData = await result.json();

        this.todos = responseData.todos;

        // console.log(this.todos);

    }catch(error){
        this.isLoading = false;
        return;
    }
  }
};

Vue.createApp(Todos).mount("#body-element");
