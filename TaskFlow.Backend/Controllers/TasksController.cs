
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

    // GET: api/tasks
    // GET: api/tasks?search=Angular
    // GET: api/tasks?status=Pending
    // GET: api/tasks?priority=High
    // GET: api/tasks?search=Angular&status=Pending&priority=High

    [HttpGet]
    public async Task<IActionResult> GetAllTasks(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? priority)
    {
        var tasks = await _taskService.GetAllTasksAsync(
            search,
            status,
            priority);

        var response = tasks.Select(task => MapToResponseDto(task));

        return Ok(response);
    }

    // GET: api/tasks/1

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTaskById(int id)
    {
        var task = await _taskService.GetTaskByIdAsync(id);

        if (task == null)
        {
            return NotFound(new
            {
                message = "Task not found."
            });
        }

        return Ok(MapToResponseDto(task));
    }

    // POST: api/tasks

    [HttpPost]
    public async Task<IActionResult> CreateTask(
        [FromBody] CreateTaskDto dto)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            Priority = dto.Priority
        };

        var createdTask = await _taskService.CreateTaskAsync(task);

        return CreatedAtAction(
            nameof(GetTaskById),
            new { id = createdTask.Id },
            MapToResponseDto(createdTask));
    }

    // PUT: api/tasks/1

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(
        int id,
        [FromBody] UpdateTaskDto dto)
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
        {
            return NotFound(new
            {
                message = "Task not found."
            });
        }

        return Ok(MapToResponseDto(updatedTask));
    }

    // DELETE: api/tasks/1

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var result = await _taskService.DeleteTaskAsync(id);

        if (!result)
        {
            return NotFound(new
            {
                message = "Task not found."
            });
        }

        return Ok(new
        {
            message = "Task deleted successfully."
        });
    }

    // Entity to Response DTO Mapping

    private static TaskResponseDto MapToResponseDto(TaskItem task)
    {
        return new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            Priority = task.Priority,
            Status = task.Status,
            CreatedAt = task.CreatedAt
        };
    }
}
