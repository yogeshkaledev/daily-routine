package com.dailyroutine.dto;

import jakarta.validation.constraints.NotBlank;

public class FeedbackRequest {
    @NotBlank
    private String feedback;

    public FeedbackRequest() {}

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}