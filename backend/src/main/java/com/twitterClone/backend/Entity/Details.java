package com.twitterClone.backend.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = {"username", "email"})
})
public class Details {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    public Details(Long id){
        this.id = id;
    }
    private String username;
    private String password;
    private String email;
    private String bio;
    @Lob
    private byte[] displayPicture;
    private Timestamp date_create;
    private Timestamp date_update;

    public Details(Long id, String username, byte[] displayPicture) {
        this.id = id;
        this.username = username;
        this.displayPicture = displayPicture;
    }
}
