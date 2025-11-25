package com.example.demo.controller;

import com.example.demo.service.AqiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AqiController {

    private final AqiService aqiService;

    public AqiController(AqiService aqiService) {
        this.aqiService = aqiService;
    }

    @GetMapping("/aqi")
    public Map<String, Object> getAQI(@RequestParam String city) {
        return aqiService.getAQI(city.trim());
    }
}
