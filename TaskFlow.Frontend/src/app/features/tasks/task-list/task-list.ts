
import { Component, OnInit, computed, inject, signal } from '@angular/core';
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

type SortOption =
  | 'dueDateAsc'
  | 'dueDateDesc'
  | 'priorityDesc'
  | 'priorityAsc';

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

  // Pagination
  pageSize = 5;
  currentPage = signal<number>(1);

  // Sorting
  sortOption = signal<SortOption>('dueDateAsc');

  sortedTasks = computed(() => {
    const taskList = [...this.tasks()];
    const option = this.sortOption();

    const priorityOrder: Record<TaskPriority, number> = {
      High: 3,
      Medium: 2,
      Low: 1
    };

    return taskList.sort((a, b) => {
      switch (option) {
        case 'dueDateAsc':
          return new Date(a.dueDate).getTime() -
            new Date(b.dueDate).getTime();

        case 'dueDateDesc':
          return new Date(b.dueDate).getTime() -
            new Date(a.dueDate).getTime();

        case 'priorityDesc':
          return priorityOrder[b.priority] -
            priorityOrder[a.priority];

        case 'priorityAsc':
          return priorityOrder[a.priority] -
            priorityOrder[b.priority];

        default:
          return 0;
      }
    });
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedTasks().length / this.pageSize))
  );

  paginatedTasks = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;

    return this.sortedTasks().slice(
      startIndex,
      startIndex + this.pageSize
    );
  });

  startItem = computed(() =>
    this.sortedTasks().length === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize + 1
  );

  endItem = computed(() =>
    Math.min(
      this.currentPage() * this.pageSize,
      this.sortedTasks().length
    )
  );

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

        const maximumPage = Math.max(
          1,
          Math.ceil(response.length / this.pageSize)
        );

        if (this.currentPage() > maximumPage) {
          this.currentPage.set(maximumPage);
        }

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
    this.currentPage.set(1);
    this.loadTasks();
  }

  onPriorityChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TaskPriority | '';
    this.selectedPriority.set(value);
    this.currentPage.set(1);
    this.loadTasks();
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.sortOption.set(value);
    this.currentPage.set(1);
  }

  searchTasks(): void {
    this.currentPage.set(1);
    this.loadTasks();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set('');
    this.selectedPriority.set('');
    this.sortOption.set('dueDateAsc');
    this.currentPage.set(1);
    this.loadTasks();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
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
