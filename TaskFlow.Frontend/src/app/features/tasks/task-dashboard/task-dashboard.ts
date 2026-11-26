import { Component, OnInit, inject, signal } from '@angular/core';
import { DashboardSummary } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.css'
})
export class TaskDashboard implements OnInit {
  private readonly taskService = inject(TaskService);

  summary = signal<DashboardSummary | null>(null);
  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set('');

    this.taskService.getDashboardSummary().subscribe({
      next: (response) => {
        this.summary.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Dashboard API Error:', error);
        this.error.set(
          'Unable to load dashboard data. Please check whether the backend server is running.'
        );
        this.loading.set(false);
      }
    });
  }

  retry(): void {
    this.loadDashboard();
  }
}