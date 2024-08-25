package com.twitterClone.backend.Service;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class GoogleTokenService {
    public String getUserInfo(OAuth2AuthenticationToken authentication) {
        // Extract user information from the OAuth2AuthenticationToken
        String name = authentication.getPrincipal().getAttribute("name");
        String email = authentication.getPrincipal().getAttribute("email");

        return "Name: " + name + ", Email: " + email;
    }
}
