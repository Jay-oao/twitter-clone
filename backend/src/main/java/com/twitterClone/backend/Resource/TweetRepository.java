package com.twitterClone.backend.Resource;

import com.twitterClone.backend.Entity.Tweets;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface TweetRepository extends JpaRepository<Tweets, Long> {
    Page<Tweets> findByDetailsUsernameNot(String currentUsername, Pageable pageable);

    List<Tweets> findByTweetDateAfter(Timestamp timestamp);

    @Query("SELECT t FROM Tweets t WHERE details.id = :id")
    List<Tweets> findByDetailsId(Long id);
    Page<Tweets> findByDetailsUsername(Long id, Pageable pageable);

}
