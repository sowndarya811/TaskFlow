
using TaskFlow.Backend.Models;
using TaskFlow.Backend.DTOs;

namespace TaskFlow.Backend.Services.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskItem>> GetAllTasksAsync(
        string? search,
        string? status,
        string? priority);

    Task<TaskItem?> GetTaskByIdAsync(int id);
    Task<TaskItem> CreateTaskAsync(TaskItem task);
    Task<TaskItem?> UpdateTaskAsync(int id, TaskItem task);
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    Task<bool> DeleteTaskAsync(int id);
}
