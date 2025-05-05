package com.example.pafbackend.services;

import com.example.pafbackend.models.Payment;
import com.example.pafbackend.models.PaymentStatus;
import com.example.pafbackend.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment createPayment(Payment payment) {
    payment.setStatus(PaymentStatus.PENDING); // default
    return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(String id) {
        return paymentRepository.findById(id);
    }

    public Payment updatePayment(String id, Payment updatedPayment) {
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null || payment.getStatus() != PaymentStatus.PENDING) return null;

        payment.setAmount(updatedPayment.getAmount());
        return paymentRepository.save(payment);
    }

    public boolean deletePayment(String id) {
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null || payment.getStatus() != PaymentStatus.PENDING) return false;

        paymentRepository.deleteById(id);
        return true;
    }
}
