package com.twitterClone.backend.Resource;

import com.twitterClone.backend.Entity.Tweets;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface TweetRepository extends JpaRepository<Tweets, Long> {
    Page<Tweets> findByDetailsUsernameNot(String currentUsername, Pageable pageable);

    List<Tweets> findByTweetDateAfter(Timestamp timestamp);

}
