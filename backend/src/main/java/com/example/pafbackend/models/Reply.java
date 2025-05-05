package com.example.pafbackend.models;

import java.time.LocalDateTime;

public class Reply {
    private String senderId;
    private String message;
    private LocalDateTime repliedAt = LocalDateTime.now();

    // Getters and Setters
    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getRepliedAt() { return repliedAt; }
    public void setRepliedAt(LocalDateTime repliedAt) { this.repliedAt = repliedAt; }
}
