package com.example.pafbackend.controllers;

import com.example.pafbackend.models.StatusUpdate;
import com.example.pafbackend.repositories.StatusUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/StatusUpdates")
public class StatusUpdateController {

    private final StatusUpdateRepository StatusUpdateRepository;

    @Autowired
    public StatusUpdateController(StatusUpdateRepository StatusUpdateRepository) {
        this.StatusUpdateRepository = StatusUpdateRepository;
    }

    @GetMapping
    public ResponseEntity<List<StatusUpdate>> getUpdatesByUserId() {
        List<StatusUpdate> updates = StatusUpdateRepository.findAll();
        return new ResponseEntity<>(updates, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<StatusUpdate>> getUpdatesByUserId(@PathVariable String userId) {
        List<StatusUpdate> updates = StatusUpdateRepository.findByUserId(userId);
        return new ResponseEntity<>(updates, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<StatusUpdate> createUpdate(@RequestBody StatusUpdate update) {
        StatusUpdate savedUpdate = StatusUpdateRepository.save(update);
        return new ResponseEntity<>(savedUpdate, HttpStatus.CREATED);
    }

    @DeleteMapping("/{updateId}")
    public ResponseEntity<Void> deleteUpdate(@PathVariable String updateId) {
        StatusUpdateRepository.deleteById(updateId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{updateId}")
    public ResponseEntity<StatusUpdate> updateUpdate(@PathVariable String updateId, @RequestBody StatusUpdate updateDetails) {
        return StatusUpdateRepository.findById(updateId)
                .map(existingUpdate -> {
                    existingUpdate.setTitle(updateDetails.getTitle());
                    existingUpdate.setImage(updateDetails.getImage());
                    existingUpdate.setDescription(updateDetails.getDescription());
                    StatusUpdate updatedUpdate = StatusUpdateRepository.save(existingUpdate);
                    return ResponseEntity.ok(updatedUpdate);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}