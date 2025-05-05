package com.example.pafbackend.controllers;

import com.example.pafbackend.models.Project;
import com.example.pafbackend.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // Create a new project
    @PostMapping
    public Project create(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    // Get all projects
    @GetMapping
    public List<Project> getAll() {
        return projectService.getAllProjects();
    }

    // Get a project by ID
    @GetMapping("/{id}")
    public Project getById(@PathVariable String id) {
        return projectService.getProjectById(id).orElse(null);
    }

    // Update a project
    @PutMapping("/{id}")
    public Project update(@PathVariable String id, @RequestBody Project project) {
        return projectService.updateProject(id, project);
    }

    // Delete a project
    @DeleteMapping("/{id}")
    public ResponseMessage delete(@PathVariable String id) {
        boolean deleted = projectService.deleteProject(id);
        return deleted ? new ResponseMessage("Project deleted")
                       : new ResponseMessage("Project not found");
    }

    // ResponseMessage class integrated here
    public static class ResponseMessage {
        private String message;

        public ResponseMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
