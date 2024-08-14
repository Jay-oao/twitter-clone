package com.twitterClone.backend.Resource;

import com.twitterClone.backend.Entity.ChatMessage;
import com.twitterClone.backend.Entity.Details;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface ChatRepository extends JpaRepository<ChatMessage,Long> {


    @Query("SELECT DISTINCT c.details_receiver  FROM ChatMessage c WHERE c.details_sender.id = :sender")
    List<Details> findUniqueReceiversBySender(@Param("sender") long sender);
    
    @Query("SELECT cm.content, cm.time,cm.details_sender.id FROM ChatMessage cm " +
            "WHERE (cm.details_sender.id = :sender AND cm.details_receiver.id = :receiver )"+
            "OR (cm.details_receiver.id= :sender AND cm.details_sender.id = :receiver )")
    List<Object[]> findContentAndTimestampAndSenderBySenderAndReceiver(
            @Param("sender") long sender,
            @Param("receiver") long receiver
    );

}
