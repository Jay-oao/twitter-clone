package com.twitterClone.backend.Resource;

import com.twitterClone.backend.Entity.Details;
import com.twitterClone.backend.Entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow,Long> {
    @Query("SELECT f FROM Follow f WHERE f.details.id = :srcId ")
    List<Follow> findByDetails(@Param("srcId") Long srcId);

    @Query("SELECT f FROM Follow f WHERE f.details.id = :srcId AND f.details_follow.id = :destId")
    List<Follow> findByDetailsAndFollow(@Param("srcId") Long srcId, @Param("destId") Long destId);


    @Query("SELECT COUNT(F) FROM Follow F WHERE F.details.id = :id")
    int countByDetailsId(@Param("id") Long id);

    @Query("SELECT COUNT(F) FROM Follow F WHERE F.details_follow.id = :id")
    int countByDetailsFollowId(@Param("id") Long id);

    @Query("SELECT f.details_follow FROM Follow f WHERE f.details.id = :srcId AND LOWER(f.details_follow.username) LIKE LOWER(CONCAT('%', :username, '%'))")
    List<Details> findFollowingsByUsernameLike(@Param("srcId") Long srcId, @Param("username") String username);

}
