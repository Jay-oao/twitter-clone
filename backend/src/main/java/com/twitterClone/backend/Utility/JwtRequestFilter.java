package com.twitterClone.backend.Utility;

import com.twitterClone.backend.Config.JwtPropertyConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.util.Base64;
import java.util.Collections;

@Configuration
public class JwtRequestFilter extends OncePerRequestFilter {

    private final SecretKey secret_key;

    public JwtRequestFilter(JwtPropertyConfig jwtPropertyConfig) {
        byte[] decodedKey = Base64.getDecoder().decode(jwtPropertyConfig.getSecret());
        this.secret_key = new SecretKeySpec(decodedKey, 0, decodedKey.length, "HmacSHA256");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(secret_key)
                        .parseClaimsJws(jwt)
                        .getBody();

                String username = claims.getSubject();

                // Create an Authentication object and set it in the SecurityContext
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            username, null, Collections.emptyList()); // Empty authorities list
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }

                filterChain.doFilter(request, response);

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized access");
                response.getWriter().flush();
                return;
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

}
