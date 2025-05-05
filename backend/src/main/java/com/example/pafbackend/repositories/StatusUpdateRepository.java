package com.example.pafbackend.repositories;

import com.example.pafbackend.models.StatusUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusUpdateRepository extends MongoRepository<StatusUpdate, String> {
    List<StatusUpdate> findByUserId(String userId);
}