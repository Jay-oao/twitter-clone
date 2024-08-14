package com.twitterClone.backend.Controller;

import com.twitterClone.backend.Entity.Details;
import com.twitterClone.backend.Resource.TweetRepository;
import com.twitterClone.backend.Entity.Tweets;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000",allowCredentials = "true")
public class TweetController {
    private TweetRepository tweetRepository;

    private Timestamp lastPoll;

    public TweetController(TweetRepository tweetRepository){
        this.tweetRepository = tweetRepository;
        this.lastPoll = new Timestamp(System.currentTimeMillis());
    }

    @GetMapping("/")
    //TODO: USERNAME -> ID (FETCH)
    public ResponseEntity<?> fetchTweets(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "4") int size,
                                         @RequestParam String username) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("tweetDate").descending());

            Page<Tweets> tweetPage = tweetRepository.findByDetailsUsernameNot( username ,pageable);

            if (tweetPage.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No tweets found for username: " + username);
            } else {
                return ResponseEntity.ok(tweetPage.getContent());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching tweets: " + e.getMessage());
        }
    }

    @PostMapping(path="/newTweet")
    public void addNewTweet(@RequestBody Tweets newTweet){
        newTweet.setTweetDate(new Timestamp(System.currentTimeMillis()));
        tweetRepository.save(newTweet);
    }

    @DeleteMapping(path="/deleteTweet")
    public ResponseEntity<?> deleteTweet(@RequestParam Long id){
        if(tweetRepository.findById(id).isPresent()){
            tweetRepository.deleteById(id);
            return ResponseEntity.ok().body("Successfully deleted");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping(path="/latest")
    public List<Tweets> getLatestTweets(){
        Timestamp current = new Timestamp(System.currentTimeMillis());
        List<Tweets> latest = tweetRepository.findByTweetDateAfter(lastPoll);
        lastPoll = current;
        return latest;
    }
}
