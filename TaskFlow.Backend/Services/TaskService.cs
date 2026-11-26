
using TaskFlow.Backend.Models;
using TaskFlow.Backend.Repositories.Interfaces;
using TaskFlow.Backend.Services.Interfaces;

namespace TaskFlow.Backend.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
    {
        return await _taskRepository.GetAllAsync();
    }

    public async Task<TaskItem?> GetTaskByIdAsync(int id)
    {
        if (id <= 0)
            return null;

        return await _taskRepository.GetByIdAsync(id);
    }

    public async Task<TaskItem> CreateTaskAsync(TaskItem task)
    {
        task.CreatedAt = DateTime.UtcNow;
        task.Status = "Pending";

        return await _taskRepository.CreateAsync(task);
    }

    public async Task<TaskItem?> UpdateTaskAsync(int id, TaskItem task)
    {
        if (id <= 0)
            return null;

        task.Id = id;

        return await _taskRepository.UpdateAsync(task);
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        if (id <= 0)
            return false;

        return await _taskRepository.DeleteAsync(id);
    }
}
