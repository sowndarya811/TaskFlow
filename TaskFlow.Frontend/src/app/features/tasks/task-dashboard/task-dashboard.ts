
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DashboardSummary, Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.css'
})
export class TaskDashboard implements OnInit {
  private readonly taskService = inject(TaskService);

  summary = signal<DashboardSummary | null>(null);
  tasks = signal<Task[]>([]);

  loading = signal<boolean>(true);
  error = signal<string>('');

  completionPercentage = computed(() => {
    const data = this.summary();

    if (!data || data.totalTasks === 0) {
      return 0;
    }

    return Math.round(
      (data.completedTasks / data.totalTasks) * 100
    );
  });

  highPriorityTasks = computed(
    () => this.tasks().filter(task => task.priority === 'High').length
  );

  mediumPriorityTasks = computed(
    () => this.tasks().filter(task => task.priority === 'Medium').length
  );

  lowPriorityTasks = computed(
    () => this.tasks().filter(task => task.priority === 'Low').length
  );

  recentTasks = computed(() =>
    [...this.tasks()]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
  );

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set('');

    let completedRequests = 0;

    const finishLoading = (): void => {
      completedRequests++;

      if (completedRequests === 2) {
        this.loading.set(false);
      }
    };

    this.taskService.getDashboardSummary().subscribe({
      next: (response) => {
        this.summary.set(response);
        finishLoading();
      },
      error: (error) => {
        console.error('Dashboard Summary API Error:', error);
        this.error.set(
          'Unable to load dashboard data. Please check whether the backend server is running.'
        );
        finishLoading();
      }
    });

    this.taskService.getTasks({}).subscribe({
      next: (response) => {
        this.tasks.set(response);
        finishLoading();
      },
      error: (error) => {
        console.error('Tasks API Error:', error);
        this.error.set(
          'Unable to load task details. Please try again.'
        );
        finishLoading();
      }
    });
  }

  retry(): void {
    this.loadDashboard();
  }
}
