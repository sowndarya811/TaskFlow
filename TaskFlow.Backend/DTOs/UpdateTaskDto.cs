using System.ComponentModel.DataAnnotations;

namespace TaskFlow.Backend.DTOs;

public class UpdateTaskDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }

    [Required]
    public string Priority { get; set; } = "Medium";

    [Required]
    public string Status { get; set; } = "Pending";
}