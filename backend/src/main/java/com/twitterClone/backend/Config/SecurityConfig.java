package com.twitterClone.backend.Config;

import com.twitterClone.backend.Resource.LoginResource;
import com.twitterClone.backend.Service.LoginService;
import com.twitterClone.backend.Utility.IpRateLimiter;
import com.twitterClone.backend.Utility.JwtRequestFilter;
import com.twitterClone.backend.Utility.JwtUtility;
import com.twitterClone.backend.Utility.RateLimiterRequestFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private JwtUtility jwtUtility;

    private LoginResource loginResource;

    private LoginService loginService;
    private RateLimiterRequestFilter rateLimiterRequestFilter;
    private IpRateLimiter ipRateLimiter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter, JwtUtility jwtUtility ,
                          LoginResource loginResource, LoginService loginService,
                          RateLimiterRequestFilter rateLimiterRequestFilter , IpRateLimiter ipRateLimiter) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.jwtUtility = jwtUtility;
        this.loginResource = loginResource;
        this.loginService = loginService;
        this.rateLimiterRequestFilter = rateLimiterRequestFilter;
        this.ipRateLimiter = ipRateLimiter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable()
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/login", "/register", "/refresh", "/oauth2/**", "/error","/chat/**","/m/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(new OAuth2SuccessHandler(jwtUtility,loginResource,loginService))
                        .failureHandler(new OAuth2FailureHandler())
                )
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(ipRateLimiter,jwtRequestFilter.getClass())
                .addFilterAfter(rateLimiterRequestFilter,ipRateLimiter.getClass());

        return http.build();
    }
}