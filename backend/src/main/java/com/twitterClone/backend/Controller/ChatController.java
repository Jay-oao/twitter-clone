package com.twitterClone.backend.Controller;

import com.twitterClone.backend.Entity.Details;
import com.twitterClone.backend.Resource.ChatRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


//TODO:ONLY SUPPORTS UNIDIRECTIONAL COMMUNICATION

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;
    @GetMapping(path="/receiver")

    public ResponseEntity<?> getReceiverId(@RequestParam long senderId){
        List<Details> list = chatRepository.findUniqueReceiversBySender(senderId);
        record ResultFilteredList(Long id, String username, byte[] displayPicture) {}
        if(list.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        List<ResultFilteredList> flist = new ArrayList<>();
        for( Details details : list){
            flist.add(new ResultFilteredList(details.getId(), details.getUsername(),details.getDisplayPicture()));
        }
        return ResponseEntity.ok().body(flist);
    }

    @GetMapping(path="/renderMessage")
    public List<Object[]> getPreviousMessage(@RequestParam long sender,@RequestParam long receiver){
        return chatRepository.findContentAndTimestampAndSenderBySenderAndReceiver(sender, receiver);
    }

}
