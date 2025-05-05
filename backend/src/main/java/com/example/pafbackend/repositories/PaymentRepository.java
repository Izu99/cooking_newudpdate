package com.example.pafbackend.repositories;

import com.example.pafbackend.models.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRepository extends MongoRepository<Payment, String> {
}
