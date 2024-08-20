package com.twitterClone.backend.POJO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class TweetResponseInfo {
    private String tweetDesc;
    private Timestamp tweetDate;
}
