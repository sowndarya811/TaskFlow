
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TaskService } from '../../../core/services/task.service';

import {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskRequest,
  UpdateTaskRequest
} from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit {

  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEditMode = signal(false);
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  success = signal('');

  taskId: number | null = null;

  title = '';
  description = '';
  dueDate = '';
  priority: TaskPriority = 'Medium';
  status: TaskStatus = 'Pending';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.taskId = Number(id);
      this.isEditMode.set(true);
      this.loadTask(this.taskId);
    }
  }

  loadTask(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.taskService.getTaskById(id).subscribe({
      next: (task: Task) => {
        this.title = task.title;
        this.description = task.description ?? '';
        this.dueDate = task.dueDate
          ? task.dueDate.substring(0, 10)
          : '';
        this.priority = task.priority;
        this.status = task.status;

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading task:', err);
        this.error.set('Unable to load task. Please try again.');
        this.loading.set(false);
      }
    });
  }

  saveTask(): void {
    this.error.set('');
    this.success.set('');

    if (!this.title.trim()) {
      this.error.set('Task title is required.');
      return;
    }

    if (!this.dueDate) {
      this.error.set('Due date is required.');
      return;
    }

    if (this.dueDate < new Date().toISOString().substring(0, 10)) {
      this.error.set('Due date cannot be in the past.');
      return;
    }

    this.saving.set(true);

    if (this.isEditMode() && this.taskId !== null) {
      const updateRequest: UpdateTaskRequest = {
        title: this.title.trim(),
        description: this.description.trim(),
        dueDate: this.dueDate,
        priority: this.priority,
        status: this.status
      };

      this.taskService.updateTask(this.taskId, updateRequest).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error('Error updating task:', err);
          this.error.set('Unable to update task. Please try again.');
          this.saving.set(false);
        }
      });

    } else {
      const createRequest: CreateTaskRequest = {
        title: this.title.trim(),
        description: this.description.trim(),
        dueDate: this.dueDate,
        priority: this.priority
      };

      this.taskService.createTask(createRequest).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error('Error creating task:', err);
          this.error.set('Unable to create task. Please try again.');
          this.saving.set(false);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
