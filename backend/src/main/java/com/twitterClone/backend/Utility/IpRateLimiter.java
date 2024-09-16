package com.twitterClone.backend.Utility;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
public class IpRateLimiter extends OncePerRequestFilter {
    private static final int MAX_REQUESTS = 10;
    private static final Duration TIME_WINDOW = Duration.ofSeconds(1);
    private static final ConcurrentHashMap<String, Queue<Long>> requestMap = new ConcurrentHashMap<>();
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String ip = request.getRemoteAddr();
        Queue<Long> requests = requestMap.computeIfAbsent(ip,k-> new ConcurrentLinkedQueue<>());
        Long now = System.currentTimeMillis();
        requests.add(now);
        while(!requests.isEmpty() && now-requests.peek()>TIME_WINDOW.toMillis()){
            requests.poll();
        }
        if(requests.size()<=MAX_REQUESTS){
            filterChain.doFilter(request,response);
        } else{
            response.setStatus(HttpServletResponse.SC_REQUEST_TIMEOUT);
            response.getWriter().write("Rate limiter exceeded Try again later");
        }
    }
}
