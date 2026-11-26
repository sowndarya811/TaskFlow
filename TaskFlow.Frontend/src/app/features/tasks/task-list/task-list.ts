
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TaskService } from '../../../core/services/task.service';

import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskFilters,
  UpdateTaskRequest
} from '../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {

  private readonly taskService = inject(TaskService);

  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');

  searchTerm = signal<string>('');
  selectedStatus = signal<TaskStatus | ''>('');
  selectedPriority = signal<TaskPriority | ''>('');

  updatingTaskIds = signal<number[]>([]);
  statusUpdateError = signal<string>('');

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set('');

    const filters: TaskFilters = {
      search: this.searchTerm(),
      status: this.selectedStatus(),
      priority: this.selectedPriority()
    };

    this.taskService.getTasks(filters).subscribe({
      next: (response) => {
        this.tasks.set(response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.error.set('Unable to load tasks. Please try again.');
        this.loading.set(false);
      }
    });
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TaskStatus | '';
    this.selectedStatus.set(value);
    this.loadTasks();
  }

  onPriorityChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TaskPriority | '';
    this.selectedPriority.set(value);
    this.loadTasks();
  }

  searchTasks(): void {
    this.loadTasks();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set('');
    this.selectedPriority.set('');
    this.loadTasks();
  }

  updateTaskStatus(task: Task, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value as TaskStatus;

    if (newStatus === task.status) {
      return;
    }

    const request: UpdateTaskRequest = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: newStatus
    };

    this.statusUpdateError.set('');
    this.updatingTaskIds.update(ids => [...ids, task.id]);

    this.taskService.updateTask(task.id, request).subscribe({
      next: (updatedTask) => {
        this.tasks.update(currentTasks =>
          currentTasks.map(item =>
            item.id === task.id ? updatedTask : item
          )
        );

        this.updatingTaskIds.update(ids =>
          ids.filter(id => id !== task.id)
        );
      },
      error: (err) => {
        console.error('Error updating task status:', err);

        this.statusUpdateError.set(
          `Unable to update status for "${task.title}". Please try again.`
        );

        this.updatingTaskIds.update(ids =>
          ids.filter(id => id !== task.id)
        );

        this.loadTasks();
      }
    });
  }

  deleteTask(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.error.set('Unable to delete task. Please try again.');
      }
    });
  }
}
