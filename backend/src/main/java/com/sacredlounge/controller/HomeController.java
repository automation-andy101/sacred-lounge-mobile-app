package com.sacredlounge.controller;

import com.sacredlounge.dto.HomeDto;
import com.sacredlounge.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    /** Single call that returns everything the home screen needs */
    @GetMapping
    public ResponseEntity<HomeDto.HomeResponse> getHomeData() {
        return ResponseEntity.ok(homeService.getHomeData());
    }
}
