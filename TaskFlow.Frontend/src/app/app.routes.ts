
import { Routes } from '@angular/router';

import { TaskDashboard } from './features/tasks/task-dashboard/task-dashboard';
import { TaskList } from './features/tasks/task-list/task-list';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: TaskDashboard },
  { path: 'tasks', component: TaskList },
  { path: '**', redirectTo: 'dashboard' }
];
