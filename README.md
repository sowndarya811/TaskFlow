

# TaskFlow - Task Management System



TaskFlow is a full-stack Task Management application built using Angular, ASP.NET Core Web API, and SQL Server.



It helps users create, manage, track, and organize tasks through a simple and responsive interface.



## Features



### 1. Dashboard

- View total tasks.

- View Pending, In Progress, Completed, and Overdue task counts.

- Track task completion percentage.

- View priority summary.

- View recently created tasks.



### 2. Task Management

- Create new tasks.

- View all tasks.

- View individual task details.

- Edit existing tasks.

- Delete tasks.

- Update task status directly from the task list.



### 3. Search, Filters, and Sorting

- Search tasks by title.

- Filter tasks by status.

- Filter tasks by priority.

- Sort tasks by due date.

- Sort tasks by priority.

- Pagination support.



### 4. User Interface

- Loading indicator.

- Empty state messages.

- Error messages with retry option.

- Due Today and Overdue indicators.

- Priority badges.

- Responsive layout.



### 5. Backend

- RESTful CRUD APIs.

- Repository and Service architecture.

- Entity Framework Core.

- SQL Server database integration.

- Input validation.

- Centralized exception handling.

- Dashboard summary API.



## Technologies Used



### Frontend

- Angular

- TypeScript

- HTML

- CSS

- Angular Router

- HttpClient



### Backend

- ASP.NET Core Web API

- C#

- Entity Framework Core

- Repository Pattern

- Service Layer



### Database

- Microsoft SQL Server



### Tools

- Visual Studio Code

- Visual Studio

- Git

- GitHub

- Postman



## Project Structure



```text

TaskFlow/

|

|-- TaskFlow.Backend/

|   |-- Controllers/

|   |-- Data/

|   |-- DTOs/

|   |-- Models/

|   |-- Repositories/

|   |-- Services/

|   |-- Program.cs

|   |-- appsettings.json

|

|-- TaskFlow.Frontend/

|   |-- src/

|       |-- app/

|       |   |-- core/

|       |   |   |-- models/

|       |   |   |-- services/

|       |   |-- features/

|       |       |-- tasks/

|       |           |-- task-dashboard/

|       |           |-- task-list/

|       |           |-- task-form/

|       |           |-- task-details/

|       |-- environments/

|

|-- README.md

```



## Prerequisites



Install the following before running the application:



- .NET SDK 10

- Node.js and npm

- Angular CLI

- SQL Server Express

- Git



## Database Configuration



The backend uses SQL Server.



Update the connection string in:



`TaskFlow.Backend/appsettings.json`



Example:



```json

{

&#x20; "ConnectionStrings": {

&#x20;   "DefaultConnection": "Server=localhost\\\\SQLEXPRESS;Database=TaskFlowDb;Trusted\_Connection=True;TrustServerCertificate=True;"

&#x20; }

}

```



Make sure SQL Server Express is running and the database is configured.



## How to Run the Backend



Open a terminal and execute:



```powershell

cd TaskFlow.Backend

dotnet restore

dotnet run

```



Backend API:



http://localhost:5092



## How to Run the Frontend



Open another terminal and execute:



```powershell

cd TaskFlow.Frontend

npm install

ng serve

```



Frontend application:



http://localhost:4200



## API Endpoints



Base URL:



`http://localhost:5092/api/tasks`



| Method | Endpoint | Description |

|---|---|---|

| GET | `/api/tasks` | Get all tasks |

| GET | `/api/tasks/{id}` | Get task by ID |

| POST | `/api/tasks` | Create a task |

| PUT | `/api/tasks/{id}` | Update a task |

| DELETE | `/api/tasks/{id}` | Delete a task |

| GET | `/api/tasks/dashboard-summary` | Get dashboard summary |



Search and filtering are supported through the task list API.



## Application Pages



- `/dashboard` - Dashboard

- `/tasks` - Task Management

- `/tasks/new` - Create Task

- `/tasks/edit/:id` - Edit Task

- `/tasks/:id` - Task Details



## Build the Frontend



```powershell

cd TaskFlow.Frontend

ng build

```



## Build the Backend



```powershell

cd TaskFlow.Backend

dotnet build

```



## GitHub Repository



https://github.com/sowndarya811/TaskFlow



---



**TaskFlow - Organize your work. Manage your tasks. Track your progress.**





