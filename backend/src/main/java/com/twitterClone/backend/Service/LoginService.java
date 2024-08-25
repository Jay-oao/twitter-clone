package com.twitterClone.backend.Service;

import com.twitterClone.backend.Resource.LoginResource;
import com.twitterClone.backend.Entity.Details;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;




@Service
public class LoginService {

    @Autowired
    private LoginResource loginResource;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    public Details userFind(String email,String password){
        Details user = loginResource.findByEmail(email);
        boolean auth = false;
        if(user!=null){
         auth = passwordEncoder.matches(password, user.getPassword());
        }
        if(auth){
            return user;
        } else {
            return null;
        }
    }


    public boolean registerUser(Details details){
        Details existing =  loginResource.findByEmail(details.getEmail());
        if(existing!=null){
            return false;
        } else {
            String hashedPassword = passwordEncoder.encode(details.getPassword());
            details.setPassword(hashedPassword);
            loginResource.insert(details);
            return true;
        }
    }


}
