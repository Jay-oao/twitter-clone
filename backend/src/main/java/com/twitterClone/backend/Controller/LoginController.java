package com.twitterClone.backend.Controller;

import com.twitterClone.backend.Entity.Details;
import com.twitterClone.backend.Service.LoginService;
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
    private record LoginRequest(String email, String password, String username) {}

    public LoginController(LoginService loginservice) {
        this.loginservice = loginservice;
    }
    @PostMapping(path="/register")
    public ResponseEntity<String> register(@RequestBody Details details){
        boolean result =loginservice.registerUser(details);
        if (result) {
            return ResponseEntity.ok("Success");
        } else {
            return ResponseEntity.badRequest().body("Registration failed");
        }
    }

    @PostMapping(path = "/login")
    public ResponseEntity<?> Login(@RequestBody LoginRequest loginRequest){
        Details user = loginservice.userFind(loginRequest.email,loginRequest.password,loginRequest.username);
        if(user==null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        return ResponseEntity.ok(user);
    }

}
