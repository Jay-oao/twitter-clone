package com.twitterClone.backend.POJO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Bean;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class tweet_details {
    private String id;
    private String desc;
    private Timestamp date;

    public tweet_details(){}

}
