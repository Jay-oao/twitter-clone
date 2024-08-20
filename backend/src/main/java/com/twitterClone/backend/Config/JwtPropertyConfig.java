package com.twitterClone.backend.Config;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

import org.springframework.stereotype.Component;




@Component
@ConfigurationProperties(prefix = "jwt")
@Data
@NoArgsConstructor
public class JwtPropertyConfig {
    private String secret ;
    private long expiration;
    private long refreshExpiration;

}
