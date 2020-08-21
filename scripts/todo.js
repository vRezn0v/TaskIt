angular.module('todoApp', [])
  .controller('TodoListController', function($scope, $window) {
    var todoList = this;
    todoList.todos = (localStorage.getItem('todo')!==null) ? JSON.parse(localStorage.getItem('todo')) : [{text:'Hello There', done:true},{text:'Get Started', done:false}];
    todoList.theme = (localStorage.getItem('theme')!==null) ? localStorage.getItem('theme') : 'light';
    todoList.todoarchive = (localStorage.getItem('archive')!==null) ? JSON.parse(localStorage.getItem('archive')) : [];

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
        else todoList.todoarchive.push(todo);
      });
    };
    
    todoList.reset = function() {
      if (confirm("This Action will delete all your tasks. Please confirm.")) {
        window.localStorage.clear();
        todoList.todos = [];
        window.localStorage.setItem('todo',  JSON.stringify(todoList.todos));
      }
    }
    todoList.exportJSON = function() {
      var exportFile = "tasks.json";
      var fstr = JSON.stringify(todoList.todos);
      var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(fstr);
      document.getElementById('exportJSON').href = dataUri;
      document.getElementById('exportJSON').setAttribute('download', exportFile);
      console.log("DATA EXPORTED");
    }
    todoList.importJSON = function() {
      var files = document.getElementsByClassName('importJSON')[0].files;
      console.log(files);
      if (files.length <= 0) {
        return false;
      }
      var fr = new FileReader();

      fr.onload = function(e) { 
        console.log(e);
        var result = JSON.parse(e.target.result);
        todoList.todos = result;
        window.localStorage.setItem('todo',  JSON.stringify(todoList.todos));
      }
      fr.readAsText(files.item(0));
      console.log("DATA IMPORTED");
      location.reload();
    }

    $scope.onExit = function() {
      window.localStorage.clear();
      window.localStorage.setItem('todo',  JSON.stringify(todoList.todos));
      window.localStorage.setItem('archive',  JSON.stringify(todoList.todoarchive));
      window.localStorage.setItem('theme',  todoList.theme);
    };

    $window.onbeforeunload =  $scope.onExit;
});
