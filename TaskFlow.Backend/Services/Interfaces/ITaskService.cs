
using TaskFlow.Backend.Models;

namespace TaskFlow.Backend.Services.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskItem>> GetAllTasksAsync();

    Task<TaskItem?> GetTaskByIdAsync(int id);

    Task<TaskItem> CreateTaskAsync(TaskItem task);

    Task<TaskItem?> UpdateTaskAsync(int id, TaskItem task);

    Task<bool> DeleteTaskAsync(int id);
}
