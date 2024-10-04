package com.twitterClone.backend.Utility;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.PrintWriter;

import static org.mockito.Mockito.*;

class IpRateLimiterTest {
    private IpRateLimiter ipRateLimiter;
    private HttpServletRequest request;
    private HttpServletResponse response;
    private FilterChain filterChain;

    @BeforeEach
    void setUp() throws IOException {
        ipRateLimiter = new IpRateLimiter();
        request = mock(HttpServletRequest.class);
        response = mock(HttpServletResponse.class);
        filterChain = mock(FilterChain.class);
        PrintWriter writer = mock(PrintWriter.class);
        when(response.getWriter()).thenReturn(writer);
    }

    @Test
    void underLimit() throws ServletException,IOException {
        //Arrange - stub
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        //Act
        for (int i = 0; i < 10; i++) {
            ipRateLimiter.doFilterInternal(request, response, filterChain);
        }

        // Assert
        verify(filterChain, times(10)).doFilter(request, response);
        verify(response, never()).setStatus(HttpServletResponse.SC_REQUEST_TIMEOUT);
    }

    @Test
    void overLimit() throws  ServletException, IOException{
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        for (int i = 0; i < 11; i++) {
            ipRateLimiter.doFilterInternal(request, response, filterChain);
        }

        verify(response).setStatus(HttpServletResponse.SC_REQUEST_TIMEOUT);
    }

}