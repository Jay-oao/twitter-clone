package com.twitterClone.backend.Controller;

import com.twitterClone.backend.Entity.Details;
import com.twitterClone.backend.POJO.Sessions;
import com.twitterClone.backend.Resource.LoginResource;
import com.twitterClone.backend.Service.LoginService;
import com.twitterClone.backend.Utility.JwtUtility;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.twitterClone.backend.Config.BasicWSController;

@RestController
@CrossOrigin(origins = "http://localhost:3000",allowCredentials = "true")
public class LoginController {
    private LoginService loginservice ;
    @Autowired
    private BasicWSController basicWSController;
    private record LoginRequest(String email, String password) {}

    @Autowired
    private JwtUtility jwtUtility;
    @Autowired
    private LoginResource loginResource;
    public LoginController(LoginService loginservice) {
        this.loginservice = loginservice;
    }
    @PostMapping(path = "/register")
    public ResponseEntity<?> register(@RequestBody Details details, HttpServletResponse response) {
        boolean result = loginservice.registerUser(details);

        if (result) {
            if( generateTokens(details.getUsername(), response)){
                return ResponseEntity.ok("Successful Registeration");
            }
        } else {
            return ResponseEntity.badRequest().body("Registration failed");
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "/login")
    public ResponseEntity<?> Login(@RequestBody LoginRequest loginRequest, HttpServletResponse response){
        Details user = loginservice.userFind(loginRequest.email,loginRequest.password);
        if(user==null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        if(generateTokens(user.getUsername(),response)){
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping(path = "/session/set")
    public ResponseEntity<?> setSessionElements(@RequestParam String token){
        try{
            String email = jwtUtility.extractUsername(token);
            Sessions sessionDetails = loginResource.findSessionDetails(email);
            return ResponseEntity.ok(sessionDetails);
        } catch (Exception e){
            return ResponseEntity.noContent().build();
        }
    }

    private boolean generateTokens(String username, HttpServletResponse response) {
        String accessToken = jwtUtility.generateAccessToken(username);
        String refreshToken = jwtUtility.generateRefreshToken(username);

        Cookie accessCookie = new Cookie("access_token", accessToken);
        //accessCookie.setHttpOnly(true);
        //accessCookie.setSecure(true);
        accessCookie.setPath("/");
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
        //refreshCookie.setHttpOnly(true);
        //refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);

        return true;
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue("refresh_token") String refreshToken, HttpServletResponse response) {
        if (jwtUtility.validateToken(refreshToken)) {
            String username = jwtUtility.extractUsername(refreshToken);
            String newAccessToken = jwtUtility.generateAccessToken(username);
            Cookie accessCookie = new Cookie("access_token", newAccessToken);
            accessCookie.setHttpOnly(true);
            //accessCookie.setSecure(true);
            accessCookie.setPath("/");
            response.addCookie(accessCookie);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }

}
