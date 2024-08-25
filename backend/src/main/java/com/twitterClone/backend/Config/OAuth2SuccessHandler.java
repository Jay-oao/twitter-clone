package com.twitterClone.backend.Config;

import com.twitterClone.backend.Entity.Details;
import com.twitterClone.backend.Resource.DetailsRepository;
import com.twitterClone.backend.Resource.LoginResource;
import com.twitterClone.backend.Service.GoogleTokenService;
import com.twitterClone.backend.Service.LoginService;
import com.twitterClone.backend.Utility.JwtUtility;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.sql.Timestamp;


public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtUtility jwtUtility;
    @Autowired
    private DetailsRepository detailsRepository;
    @Autowired
    private LoginService loginService;
    @Autowired
    private LoginResource loginResource;
    private Details details = new Details();
    public OAuth2SuccessHandler(JwtUtility jwtUtility,LoginResource loginResource, LoginService loginService){
        this.jwtUtility = jwtUtility;
        this.loginResource = loginResource;
        this.loginService = loginService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        if (authentication instanceof OAuth2AuthenticationToken oauth2Authentication) {
            String email = String.valueOf(oauth2Authentication.getPrincipal().getAttributes().get("email"));
            System.out.println("OAuth2 authentication successful for user: " + authentication.getName());
            String access_token = jwtUtility.generateAccessToken(String.valueOf(email));
            String refresh_token = jwtUtility.generateRefreshToken(email);


            Cookie cookie = new Cookie("access_token", access_token);
            cookie.setPath("/");
            cookie.setSecure(false);
            response.addCookie(cookie);

            Cookie cookie_refresh = new Cookie("refresh_token", refresh_token);
            cookie_refresh.setPath("/");
            cookie_refresh.setSecure(false);
            response.addCookie(cookie_refresh);


            if(loginResource.findByEmail(email)==null){
                details.setUsername(email);
                details.setEmail(email);
                details.setBio("Default Generated Bio");
                Timestamp date_create = new Timestamp(System.currentTimeMillis());
                details.setPassword("secretPasswordForGoogleProviders");
                details.setDate_create(date_create);
                details.setDate_update(date_create);
                loginService.registerUser(details);
            }

            getRedirectStrategy().sendRedirect(request, response, "http://localhost:3000/home");
        }
    }
}
