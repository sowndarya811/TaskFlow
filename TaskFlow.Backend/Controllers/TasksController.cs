
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Backend.DTOs;
using TaskFlow.Backend.Models;
using TaskFlow.Backend.Services.Interfaces;

namespace TaskFlow.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTasks()
    {
        var tasks = await _taskService.GetAllTasksAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTaskById(int id)
    {
        var task = await _taskService.GetTaskByIdAsync(id);

        if (task == null)
            return NotFound(new { message = "Task not found." });

        return Ok(new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            Priority = task.Priority,
            Status = task.Status,
            CreatedAt = task.CreatedAt
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(CreateTaskDto dto)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            Priority = dto.Priority
        };

        var createdTask = await _taskService.CreateTaskAsync(task);

        return CreatedAtAction(nameof(GetTaskById),
            new { id = createdTask.Id },
            createdTask);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, UpdateTaskDto dto)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            Priority = dto.Priority,
            Status = dto.Status
        };

        var updatedTask = await _taskService.UpdateTaskAsync(id, task);

        if (updatedTask == null)
            return NotFound(new { message = "Task not found." });

        return Ok(updatedTask);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var result = await _taskService.DeleteTaskAsync(id);

        if (!result)
            return NotFound(new { message = "Task not found." });

        return Ok(new { message = "Task deleted successfully." });
    }
}
