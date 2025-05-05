package com.example.pafbackend.services;

import com.example.pafbackend.models.Project;
import com.example.pafbackend.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(String id) {
        return projectRepository.findById(id);
    }

    public Project updateProject(String id, Project updatedProject) {
        return projectRepository.findById(id)
                .map(p -> {
                    p.setTitle(updatedProject.getTitle());
                    p.setDescription(updatedProject.getDescription());
                    p.setTechnologies(updatedProject.getTechnologies());
                    p.setEstimatedTime(updatedProject.getEstimatedTime());
                    p.setDifficulty(updatedProject.getDifficulty());
                    p.setMode(updatedProject.getMode());
                    p.setProjectLink(updatedProject.getProjectLink());
                    p.setImageUrl(updatedProject.getImageUrl());
                    p.setPrice(updatedProject.getPrice());
                    return projectRepository.save(p);
                }).orElse(null);
    }

    public boolean deleteProject(String id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
