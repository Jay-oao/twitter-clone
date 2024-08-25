package com.twitterClone.backend.Resource;


import com.twitterClone.backend.Entity.Details;
import com.twitterClone.backend.POJO.Sessions;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public class LoginResource  {
    @PersistenceContext
    private EntityManager entityManager;

    public void insert(Details details){entityManager.merge(details);}

    public Details findByEmail(String email) {
        String jpql = "SELECT d FROM Details d WHERE d.email = :email";
        TypedQuery<Details> query = entityManager.createQuery(jpql, Details.class);
        query.setParameter("email", email);

        try {
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public Sessions findSessionDetails(String email){
        String jpql = "SELECT new com.twitterClone.backend.POJO.Sessions(d.id , d.email , d.username) FROM Details d WHERE d.email = :email";
        TypedQuery<Sessions> query = entityManager.createQuery(jpql, Sessions.class);
        query.setParameter("email", email);

        try {
            Sessions details =  query.getSingleResult();
            return details;
        } catch (NoResultException e) {
            return null;
        }

    }
}
