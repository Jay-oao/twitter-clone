package com.twitterClone.backend.POJO;

import com.twitterClone.backend.Entity.Tweets;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Profile {
    private String username;
    private String bio;
    private byte[] dp;
    private int follower_count;
    private int following_count;
    private List<TweetResponseInfo> tweetsList;
}
