import { Routes } from '@angular/router';
import { TaskDashboard } from './features/tasks/task-dashboard/task-dashboard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: TaskDashboard
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];