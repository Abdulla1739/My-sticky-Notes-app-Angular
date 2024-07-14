import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Todo {
  id: number;
  value: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  taskValue: string = '';
  todoList: Todo[] = [];
  nextId: number = 1;
  editMode: boolean = false;
  editTodoId: number | null = null;

  server_url = "https://json-server-angular-crud.onrender.com/api/todos/";

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  loadTodos(): void {
    this.http.get<Todo[]>(this.server_url).subscribe(data => {
      this.todoList = data;
      if (this.todoList.length > 0) {
        this.nextId = Math.max(...this.todoList.map(todo => todo.id)) + 1;
      }
    });
  }

  handleSubmit(): void {
    if (this.taskValue.trim()) {
      if (this.editMode) {
        const todo = this.todoList.find(todo => todo.id === this.editTodoId);
        if (todo) {
          todo.value = this.taskValue;
          this.http.put(this.server_url + todo.id, todo).subscribe(() => this.loadTodos());
        }
      } else {
        const newTodo = { id: this.nextId, value: this.taskValue, completed: false };
        this.http.post(this.server_url, newTodo).subscribe(() => this.loadTodos());
        this.nextId += 1;
      }
      this.taskValue = '';
      this.editMode = false;
      this.editTodoId = null;
    }
  }

  handleToggle(id: number): void {
    const todo = this.todoList.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.http.put(this.server_url + todo.id, todo).subscribe(() => this.loadTodos());
    }
  }

  handleDelete(id: number): void {
    this.http.delete(this.server_url + id).subscribe(() => this.loadTodos());
  }

  handleEdit(id: number, value: string): void {
    this.editMode = true;
    this.editTodoId = id;
    this.taskValue = value;
  }

  get completedCount(): number {
    return this.todoList.filter(todo => todo.completed).length;
  }
}
