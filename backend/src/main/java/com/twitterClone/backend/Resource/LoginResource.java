package com.twitterClone.backend.Resource;


import com.twitterClone.backend.Entity.Details;
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

    public Details findByEmail(String email,String username) {
        String jpql = "SELECT d FROM Details d WHERE d.email = :email OR d.username=:username";
        TypedQuery<Details> query = entityManager.createQuery(jpql, Details.class);
        query.setParameter("email", email);
        query.setParameter("username",username);

        try {
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
