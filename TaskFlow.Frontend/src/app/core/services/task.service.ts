
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Task,
  TaskFilters,
  CreateTaskRequest,
  UpdateTaskRequest,
  DashboardSummary,
  DeleteTaskResponse
} from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  // Get all tasks with optional search and filters
  getTasks(filters?: TaskFilters): Observable<Task[]> {

    let params = new HttpParams();

    if (filters?.search?.trim()) {
      params = params.set('search', filters.search.trim());
    }

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    if (filters?.priority) {
      params = params.set('priority', filters.priority);
    }

    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  // Get task by ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // Create new task
  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Update existing task
  updateTask(
    id: number,
    task: UpdateTaskRequest
  ): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrl}/${id}`,
      task
    );
  }

  // Delete task
  deleteTask(id: number): Observable<DeleteTaskResponse> {
    return this.http.delete<DeleteTaskResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  // Get dashboard summary
  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(
      `${this.apiUrl}/dashboard-summary`
    );
  }
}
