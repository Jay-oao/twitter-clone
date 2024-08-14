package com.twitterClone.backend.Resource;

import com.twitterClone.backend.Entity.Details;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface DetailsRepository extends JpaRepository<Details,Long> {

}
