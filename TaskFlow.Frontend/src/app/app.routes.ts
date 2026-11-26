
import { Routes } from '@angular/router';

import { TaskDashboard } from './features/tasks/task-dashboard/task-dashboard';
import { TaskList } from './features/tasks/task-list/task-list';
import { TaskForm } from './features/tasks/task-form/task-form';
import { TaskDetails } from './features/tasks/task-details/task-details';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: TaskDashboard },
  { path: 'tasks', component: TaskList },
  { path: 'tasks/new', component: TaskForm },
  { path: 'tasks/edit/:id', component: TaskForm },
  { path: 'tasks/:id', component: TaskDetails },
  { path: '**', redirectTo: 'dashboard' }
];
