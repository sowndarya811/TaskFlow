
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css'
})
export class TaskDetails implements OnInit {

  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);

  task = signal<Task | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || id <= 0) {
      this.error.set('Invalid task ID.');
      return;
    }

    this.loadTask(id);
  }

  loadTask(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.taskService.getTaskById(id).subscribe({
      next: (response) => {
        this.task.set(response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading task details:', err);
        this.error.set(
          err.status === 404
            ? 'Task not found.'
            : 'Unable to load task details. Please try again.'
        );
        this.loading.set(false);
      }
    });
  }
}
