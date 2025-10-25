using Microsoft.AspNetCore.Mvc;
using TaskManagerApi.Models;
using TaskManagerApi.Services;

namespace TaskManagerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _todoManager;

        public TasksController(ITaskService todoManager)
        {
            _todoManager = todoManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            var todoCollection = await _todoManager.GetAllTasksAsync();
            return Ok(todoCollection);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(Guid id)
        {
            var todoItem = await _todoManager.GetTaskByIdAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }
            return Ok(todoItem);
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem todoRequest)
        {
            if (string.IsNullOrWhiteSpace(todoRequest.Description))
            {
                return BadRequest("Todo description is required.");
            }

            var newTodoItem = await _todoManager.CreateTaskAsync(todoRequest);
            return CreatedAtAction(nameof(GetTask), new { id = newTodoItem.Id }, newTodoItem);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskItem>> UpdateTask(Guid id, TaskItem todoUpdate)
        {
            if (string.IsNullOrWhiteSpace(todoUpdate.Description))
            {
                return BadRequest("Todo description is required.");
            }

            var modifiedTodo = await _todoManager.UpdateTaskAsync(id, todoUpdate);
            if (modifiedTodo == null)
            {
                return NotFound();
            }

            return Ok(modifiedTodo);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var removalResult = await _todoManager.DeleteTaskAsync(id);
            if (!removalResult)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
