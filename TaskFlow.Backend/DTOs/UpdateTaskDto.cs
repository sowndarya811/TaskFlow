
using System.ComponentModel.DataAnnotations;

namespace TaskFlow.Backend.DTOs;

public class UpdateTaskDto
{
    [Required(ErrorMessage = "Task title is required.")]
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
    [RegularExpression(@"^[\s\S]*\S[\s\S]*$", ErrorMessage = "Title cannot be empty or whitespace.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string Description { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }

    [Required(ErrorMessage = "Priority is required.")]
    [RegularExpression("^(Low|Medium|High)$",
        ErrorMessage = "Priority must be Low, Medium, or High.")]
    public string Priority { get; set; } = "Medium";

    [Required(ErrorMessage = "Status is required.")]
    [RegularExpression("^(Pending|In Progress|Completed)$",
        ErrorMessage = "Status must be Pending, In Progress, or Completed.")]
    public string Status { get; set; } = "Pending";
}
