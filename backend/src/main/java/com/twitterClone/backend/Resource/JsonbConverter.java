package com.twitterClone.backend.Resource;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twitterClone.backend.POJO.tweet_details;
import lombok.extern.slf4j.Slf4j;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Converter(autoApply = true)
public class JsonbConverter implements AttributeConverter<List<tweet_details>, String> {

    private final static ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<tweet_details> attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            log.error("Failed to convert list to JSON: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public List<tweet_details> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(dbData, objectMapper.getTypeFactory().constructCollectionType(List.class, tweet_details.class));
        } catch (IOException e) {
            log.error("Failed to convert JSON to list: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
}
