package com.example.pafbackend.services;

import com.example.pafbackend.models.Reply;
import com.example.pafbackend.models.Ticket;
import com.example.pafbackend.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTicketsByUser(String userId) {
        return ticketRepository.findByUserId(userId);
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id).orElse(null);
    }

    public Ticket addReply(String ticketId, Reply reply) {
        Ticket ticket = getTicketById(ticketId);
        if (ticket == null) return null;
        ticket.getReplies().add(reply);
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}
