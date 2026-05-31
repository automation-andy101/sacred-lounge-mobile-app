package com.sacredlounge.service;

import com.sacredlounge.dto.AuthDto;
import com.sacredlounge.entity.User;
import com.sacredlounge.repository.UserRepository;
import com.sacredlounge.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .role(User.Role.MEMBER)
                .build();
        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return buildAuthResponse(user);
    }

    public AuthDto.AuthResponse refresh(String refreshToken) {
        if (!jwtUtils.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        String userId = jwtUtils.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return buildAuthResponse(user);
    }

    public void logout(String refreshToken) {
        // Token is stateless; client discards tokens.
        // Extend here with a token blocklist if needed.
    }

    private AuthDto.AuthResponse buildAuthResponse(User user) {
        String access  = jwtUtils.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refresh = jwtUtils.generateRefreshToken(user.getId());
        return new AuthDto.AuthResponse(access, refresh, toUserDto(user));
    }

    private AuthDto.UserDto toUserDto(User u) {
        return new AuthDto.UserDto(
                u.getId().toString(), u.getEmail(),
                u.getFirstName(), u.getLastName(),
                u.getRole().name(), u.getAvatarUrl());
    }
}
