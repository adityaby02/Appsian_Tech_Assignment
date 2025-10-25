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
        private readonly IProjectService _workspaceManager;

        public ProjectsController(IProjectService workspaceManager)
        {
            _workspaceManager = workspaceManager;
        }

        private Guid ExtractActiveUserId()
        {
            var userIdentityClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdentityClaim == null || !Guid.TryParse(userIdentityClaim.Value, out var currentUserId))
            {
                throw new UnauthorizedAccessException("Invalid user token");
            }
            return currentUserId;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var activeUserId = ExtractActiveUserId();
            var userWorkspace = await _workspaceManager.GetUserProjectsAsync(activeUserId);
            return Ok(userWorkspace);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(Guid id)
        {
            var activeUserId = ExtractActiveUserId();
            var projectDetails = await _workspaceManager.GetProjectByIdAsync(id, activeUserId);
            
            if (projectDetails == null)
                return NotFound();

            return Ok(projectDetails);
        }

        [HttpPost]
        public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectRequest projectRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var activeUserId = ExtractActiveUserId();
            var newProjectItem = await _workspaceManager.CreateProjectAsync(projectRequest, activeUserId);
            
            return CreatedAtAction(nameof(GetProject), new { id = newProjectItem.Id }, newProjectItem);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var activeUserId = ExtractActiveUserId();
            var removalResult = await _workspaceManager.DeleteProjectAsync(id, activeUserId);
            
            if (!removalResult)
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
                var activeUserId = ExtractActiveUserId();
                var newTaskItem = await _workspaceManager.CreateTaskAsync(projectId, taskRequest, activeUserId);
                return Created($"/api/tasks/{newTaskItem.Id}", newTaskItem);
            }
            catch (UnauthorizedAccessException)
            {
                return NotFound();
            }
        }
    }
}
