package com.sacredlounge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SacredLoungeApplication {
    public static void main(String[] args) {
        SpringApplication.run(SacredLoungeApplication.class, args);
    }
}
