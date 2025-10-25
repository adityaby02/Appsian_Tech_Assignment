using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ProjectManagerApi.DTOs;
using ProjectManagerApi.Services;

namespace ProjectManagerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _scheduleManager;

        public ProjectsController(IProjectService scheduleManager)
        {
            _scheduleManager = scheduleManager;
        }

        private Guid GetScheduleOwnerId()
        {
            var ownerClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (ownerClaim == null || !Guid.TryParse(ownerClaim.Value, out var ownerId))
            {
                throw new UnauthorizedAccessException("Invalid user token");
            }
            return ownerId;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var scheduleOwnerId = GetScheduleOwnerId();
            var userSchedules = await _scheduleManager.GetUserProjectsAsync(scheduleOwnerId);
            return Ok(userSchedules);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(Guid id)
        {
            var scheduleOwnerId = GetScheduleOwnerId();
            var scheduleData = await _scheduleManager.GetProjectByIdAsync(id, scheduleOwnerId);
            
            if (scheduleData == null)
                return NotFound();

            return Ok(scheduleData);
        }

        [HttpPost]
        public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectRequest scheduleRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var scheduleOwnerId = GetScheduleOwnerId();
            var newSchedule = await _scheduleManager.CreateProjectAsync(scheduleRequest, scheduleOwnerId);
            
            return CreatedAtAction(nameof(GetProject), new { id = newSchedule.Id }, newSchedule);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var scheduleOwnerId = GetScheduleOwnerId();
            var scheduleRemoved = await _scheduleManager.DeleteProjectAsync(id, scheduleOwnerId);
            
            if (!scheduleRemoved)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{projectId}/tasks")]
        public async Task<ActionResult<TaskDto>> CreateTask(Guid projectId, CreateTaskRequest taskRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var scheduleOwnerId = GetScheduleOwnerId();
                var scheduledTask = await _scheduleManager.CreateTaskAsync(projectId, taskRequest, scheduleOwnerId);
                return Created($"/api/tasks/{scheduledTask.Id}", scheduledTask);
            }
            catch (UnauthorizedAccessException)
            {
                return NotFound();
            }
        }
    }
}
