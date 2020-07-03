angular.module('todoApp', [])
  .controller('TodoListController', function($scope, $window) {
    var todoList = this;
    console.log(window.localStorage.todo);
    todoList.todos = (localStorage.getItem('todo')!==null) ? JSON.parse(localStorage.getItem('todo')) : [{text:'Use Bootstrap', done:true},{text:'Implement jQuery', done:true}];
    todoList.theme = (localStorage.getItem('theme')!==null) ? localStorage.getItem('theme') : 'light';
    console.log(todoList.theme);
    todoList.changeTheme = function(themeclass){
      todoList.theme = themeclass;
      window.localStorage.setItem('theme', todoList.theme);
      console.log(localStorage.getItem('theme'));
    }

    todoList.addTodo = function() {
      todoList.todos.push({text:todoList.todoText, done:false});
      todoList.todoText = '';
    };
 
    todoList.remaining = function() {
      var count = 0;
      angular.forEach(todoList.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };
 
    todoList.archive = function() {
      var oldTodos = todoList.todos;
      todoList.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) todoList.todos.push(todo);
      });
    };
    
    todoList.reset = function() {
      if (confirm("This Action will delete all your tasks. Please confirm.")) {
        window.localStorage.clear();
        todoList.todos = [];
        window.localStorage.setItem('todo',  JSON.stringify(todoList.todos));
      }
    }

    $scope.onExit = function() {
      window.localStorage.clear();
      window.localStorage.setItem('todo',  JSON.stringify(todoList.todos));
      window.localStorage.setItem('theme',  todoList.theme);
    };

   $window.onbeforeunload =  $scope.onExit;
});
