package com.twitterClone.backend.Resource;

import com.twitterClone.backend.Entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<ChatMessage,Long> {

}
