package com.sacredlounge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDto {

    public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password,
        @NotBlank String firstName,
        @NotBlank String lastName
    ) {}

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}

    public record RefreshRequest(String refreshToken) {}

    public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserDto user
    ) {}

    public record UserDto(
        String id,
        String email,
        String firstName,
        String lastName,
        String role,
        String avatarUrl
    ) {}
}
