using Microsoft.EntityFrameworkCore;
using TaskFlow.Backend.Models;

namespace TaskFlow.Backend.Data;

public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; }
}