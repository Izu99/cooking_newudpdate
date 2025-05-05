package com.example.pafbackend.repositories;

import com.example.pafbackend.models.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project, String> {
}
