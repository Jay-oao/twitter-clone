package com.twitterClone.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    @ManyToOne
    @JoinColumn(name="sender_id",referencedColumnName = "id")
    private Details details_sender;

    @ManyToOne
    @JoinColumn(name="receiver_id",referencedColumnName = "id")
    private Details details_receiver;

    private Timestamp time;
}