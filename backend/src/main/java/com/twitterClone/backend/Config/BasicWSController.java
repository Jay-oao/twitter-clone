package com.twitterClone.backend.Config;

import com.twitterClone.backend.Entity.ChatMessage;
import com.twitterClone.backend.Entity.Details;
import com.twitterClone.backend.POJO.InputTweet;
import com.twitterClone.backend.Resource.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.sql.Timestamp;
import java.util.concurrent.CompletableFuture;

@Controller
public class BasicWSController {
    private final SimpMessagingTemplate messagingTemplate;
    private ChatRepository chatRepository;
    public BasicWSController(SimpMessagingTemplate simpMessagingTemplate, ChatRepository chatRepository){
        this.messagingTemplate = simpMessagingTemplate;
        this.chatRepository = chatRepository;
    }

    @MessageMapping("/sendMessage/{userId}")
    public void handleTweet(@Payload InputTweet inputTweet, @DestinationVariable String userId) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(inputTweet.getMsg());
        chatMessage.setDetails_sender(inputTweet.getSender());
        chatMessage.setDetails_receiver(inputTweet.getReceiver());
        chatMessage.setTime(new Timestamp(System.currentTimeMillis()));

        CompletableFuture.runAsync(() -> chatRepository.save(chatMessage))
                .thenRun(() -> messagingTemplate.convertAndSend("/topic/"+inputTweet.getReceiver().getId(),
                        inputTweet.getMsg()));
    }

}
