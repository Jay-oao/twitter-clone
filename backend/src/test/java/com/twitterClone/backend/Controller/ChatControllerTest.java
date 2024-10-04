package com.twitterClone.backend.Controller;

import com.twitterClone.backend.Entity.Details;
import com.twitterClone.backend.Resource.ChatRepository;
import com.twitterClone.backend.Resource.FollowRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


class ChatControllerTest {
    private MockMvc mockMvc;

    @InjectMocks
    private ChatController chatController;

    @Mock
    private ChatRepository chatRepository;

    @Mock
    private FollowRepository followRepository;

    @BeforeEach
    void setup(){
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(chatController).build();
    }
    @Test
    //Unit test ( isolated tests )
    void getReceiverId_WithExistingReceivers() {
        //Arrange
        long sender = 1L;
        List<Details> mockDetails = Arrays.asList(
                new Details(2L, "user2",  new byte[]{1, 2, 3}),
                new Details(3L, "user3",  new byte[]{4, 5, 6})
        );

        ///Stub
        when(chatRepository.findUniqueReceiversBySender(sender)).thenReturn(mockDetails);

        //Act
        ResponseEntity<?> response = chatController.getReceiverId(sender);

        //Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof  List);

        assertEquals(2,((List) response.getBody()).size());

        verify(chatRepository).findUniqueReceiversBySender(sender);
    }

    @Test
    void getReceiverId_WithoutExistingReceivers(){
        //Arrange
        long sender = 1L;

        ///Stub
        when(chatRepository.findUniqueReceiversBySender(sender)).thenReturn(Collections.EMPTY_LIST);

        //Act
        ResponseEntity<?> response = chatController.getReceiverId(sender);

        //Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(chatRepository).findUniqueReceiversBySender(sender);
    }

    @Test
    //Integration testing ( Includes http layer )
    void getReceiverId_HttpMock() throws Exception {
        //Arrange
        long sender = 1L;
        List<Details> mockDetails = Arrays.asList(
                new Details(2L, "user2",  new byte[]{1, 2, 3}),
                new Details(3L, "user3",  new byte[]{4, 5, 6})
        );

        ///Stub
        when(chatRepository.findUniqueReceiversBySender(sender)).thenReturn(mockDetails);

        //Act and assert
        mockMvc.perform(get("/receiver")
                        .param("senderId", String.valueOf(sender))
                        .accept(MediaType.APPLICATION_JSON))
                //.andDo(MockMvcResultHandlers.print())
                .andExpect(result -> {
                    byte[] responseBody =  result.getResponse().getContentAsByteArray();
                    assertEquals(11, responseBody.toString().length()); // Assert the size of the response body
                });
        verify(chatRepository).findUniqueReceiversBySender(sender);

    }

}