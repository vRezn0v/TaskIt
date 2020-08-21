angular.module('todoApp', [])
  .controller('TodoListController', function($scope, $window) {
    var todoList = this;
    todoList.todos = (localStorage.getItem('todo')!==null) ? JSON.parse(localStorage.getItem('todo')) : [];
    todoList.theme = (localStorage.getItem('theme')!==null) ? localStorage.getItem('theme') : 'light';
    todoList.archive = (localStorage.getItem('archive')!==null) ? JSON.parse(localStorage.getItem('archive')) : [];
    
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
      archive = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) todoList.todos.push(todo);
        else archive.push(todo);
      });
      todoList.archive=archive;
      angular.forEach(archive, function(todo) {
        todoList.archive.push(todo);
      });
      this.update(todoList.todos, todoList.archive);
    };

    todoList.unarchive = function() {
      var oldArchive = todoList.archive;
      todoList.archive = [];
      angular.forEach(oldArchive, function(todo) {
        if (!todo.done) todoList.archive.push(todo);
        else todoList.todos.push(todo);
      });
      this.update(todoList.todos, todoList.archive);
    };
    

    todoList.reset = function() {
      if (confirm("This Action will delete all your tasks. Please confirm.")) {
        window.localStorage.clear();
        update([] , []);
        location.reload();
      }
    }

    todoList.update = function(todos, archive) {
      window.localStorage.clear();
      window.localStorage.setItem('todo',  JSON.stringify(todos));
      if (todoList.archive!==[])
            window.localStorage.setItem('archive',  JSON.stringify(archive));
      else
            window.localStorage.setItem('archive',  null);
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
      window.localStorage.setItem('archive',  JSON.stringify(todoList.archive));
      window.localStorage.setItem('theme',  todoList.theme);
    };

    $window.onbeforeunload =  $scope.onExit;
});
