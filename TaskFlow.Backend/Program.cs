
using Microsoft.EntityFrameworkCore;
using TaskFlow.Backend.Data;
using TaskFlow.Backend.Repositories;
using TaskFlow.Backend.Repositories.Interfaces;
using TaskFlow.Backend.Services;
using TaskFlow.Backend.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Controller registration
builder.Services.AddControllers();

// Dependency Injection
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

// SQL Server Database Connection
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
