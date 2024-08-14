package com.twitterClone.backend.POJO;

import com.twitterClone.backend.Entity.Details;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InputTweet {
    private String msg;
    private Details sender;
    private Details receiver;

}
