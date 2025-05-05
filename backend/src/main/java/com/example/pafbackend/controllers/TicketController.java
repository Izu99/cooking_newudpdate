package com.example.pafbackend.controllers;

import com.example.pafbackend.models.Reply;
import com.example.pafbackend.models.Ticket;
import com.example.pafbackend.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @GetMapping("/user/{userId}")
    public List<Ticket> getUserTickets(@PathVariable String userId) {
        return ticketService.getAllTicketsByUser(userId);
    }

    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable String id) {
        return ticketService.getTicketById(id);
    }

    @PutMapping("/{ticketId}/reply")
    public Ticket addReply(@PathVariable String ticketId, @RequestBody Reply reply) {
        return ticketService.addReply(ticketId, reply);
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
    }
}
