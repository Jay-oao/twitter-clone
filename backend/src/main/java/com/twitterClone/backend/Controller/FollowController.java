package com.twitterClone.backend.Controller;

import com.twitterClone.backend.Entity.Details;
import com.twitterClone.backend.Entity.Follow;
import com.twitterClone.backend.Entity.Tweets;
import com.twitterClone.backend.POJO.FollowRequest;
import com.twitterClone.backend.POJO.Profile;
import com.twitterClone.backend.POJO.TweetResponseInfo;
import com.twitterClone.backend.Resource.DetailsRepository;
import com.twitterClone.backend.Resource.FollowRepository;
import com.twitterClone.backend.Resource.TweetRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FollowController {
    private FollowRepository followRepository;
    private DetailsRepository detailsRepository;

    private TweetRepository tweetRepository;
    public FollowController(FollowRepository followRepository , DetailsRepository detailsRepository ,
                            TweetRepository tweetRepository){
        this.followRepository = followRepository;
        this.detailsRepository = detailsRepository;
        this.tweetRepository = tweetRepository;
    }
    @GetMapping(path = "/totalfollow")
    public ResponseEntity<?> totalFollowers(Long src){
        List<Follow> list = followRepository.findByDetails(src);
        if(list.isEmpty()){
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok().body(list);
        }
    }

    @Transactional
    @PostMapping(path = "/follow")
    public ResponseEntity<String> follow(@RequestBody FollowRequest followRequest) {
        Optional<Details> srcUserOpt = detailsRepository.findById(followRequest.getSrc());
        Optional<Details> destUserOpt = detailsRepository.findById(followRequest.getDestination());

        if (!srcUserOpt.isPresent()) {
            return new ResponseEntity<>("Source user not found", HttpStatus.NOT_FOUND);
        }

        if (!destUserOpt.isPresent()) {
            return new ResponseEntity<>("Destination user not found", HttpStatus.NOT_FOUND);
        }

        Details srcUser = srcUserOpt.get();
        Details destUser = destUserOpt.get();

        List<Follow> existingFollow = followRepository.findByDetailsAndFollow(followRequest.getSrc(), followRequest.getDestination());
        if (!existingFollow.isEmpty()) {
            return new ResponseEntity<>("Already following", HttpStatus.CONFLICT);
        }

        Follow follow = new Follow();
        follow.setDetails(srcUser);
        follow.setDetails_follow(destUser);

        followRepository.save(follow);

        return new ResponseEntity<>("Followed successfully", HttpStatus.OK);
    }

    @GetMapping(path="/profileDetails")
    public ResponseEntity<?> getProfileDetails(@RequestParam long source){
        Profile profile = new Profile();
        Optional<Details> user = detailsRepository.findById(source);
        if(user.isPresent()){
            int follow = followRepository.countByDetailsId(source);
            int followers = followRepository.countByDetailsFollowId(source);
            List<TweetResponseInfo> tweetsList = tweetRepository.findByDetailsId(source);
            profile.setUsername(user.get().getUsername());
            profile.setDp(user.get().getDisplayPicture());
            profile.setBio(user.get().getBio());
            profile.setFollowing_count(follow);
            profile.setFollower_count(followers);
            profile.setTweetsList(tweetsList);
            return new ResponseEntity<>(profile,HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path="/profileDetails/following")
    public void getFollowingDetails(@RequestParam long source){
        //TODO: Following/Follower details

    }
}
