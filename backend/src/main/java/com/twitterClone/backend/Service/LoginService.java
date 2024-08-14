package com.twitterClone.backend.Service;

import com.twitterClone.backend.Resource.LoginResource;
import com.twitterClone.backend.Entity.Details;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;




@Service
public class LoginService {
//    private static List<Details> list = new ArrayList<>();
//    static {
//        list.add(new Details("user1", "user1pwd", "user1mail"));
//        list.add(new Details("user2", "user2pwd", "user2mail"));
//    }

    @Autowired
    private LoginResource loginResource;

    public Details userFind(String email,String password,String username){
        Details user = loginResource.findByEmail(email,username);
        if(!user.getPassword().equals(password)) return  null;
        return user;
    }

    public boolean registerUser(Details details){
        Details existing =  loginResource.findByEmail(details.getEmail(),details.getUsername());
        if(existing!=null){
            System.out.println("Existing user");
            return false;
        } else {
            loginResource.insert(details);
            return true;
        }
    }


}
