package com.example.demo.service;

import io.github.cdimascio.dotenv.Dotenv;
import java.net.URI;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AqiService {

    private final RestTemplate restTemplate = new RestTemplate();


    private final Dotenv dotenv = Dotenv.load();
    private final String API_KEY = dotenv.get("AQI_API_KEY");


    private final String API_URL = "https://api.waqi.info/feed/%s/?token=" + API_KEY;



    private final Map<String, CachedAQI> cache = new ConcurrentHashMap<>();
    private static final long CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes



    public Map<String, Object> getAQI(String city) {
        long now = System.currentTimeMillis();


        if (cache.containsKey(city)) {
            CachedAQI entry = cache.get(city);

            if (now - entry.timestamp < CACHE_EXPIRY) {
                return entry.data; // return cached result
            }
        }


        String api = String.format(API_URL, city);
        URI url = URI.create(api);

        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> json = response.getBody();

            if (json == null || !"ok".equals(json.get("status"))) {
                return Map.of("error", "Data unavailable");
            }

            Map<String, Object> data = (Map<String, Object>) json.get("data");


            Map<String, Object> result = Map.of(
                    "aqi", data.get("aqi"),
                    "pm25", extractValue(data.get("iaqi"), "pm25"),
                    "pm10", extractValue(data.get("iaqi"), "pm10"),
                    "time", Instant.now().toString(),
                    "requestedCity", city
            );


            cache.put(city, new CachedAQI(result, now));

            return result;

        } catch (Exception e) {
            return Map.of("error", "API Error: " + e.getMessage());
        }
    }



    private Object extractValue(Object iaqiObj, String key) {
        if (iaqiObj instanceof Map) {
            Map<String, Object> iaqi = (Map<String, Object>) iaqiObj;
            if (iaqi.containsKey(key)) {
                return iaqi.get(key);
            }
        }
        return "N/A"; // fallback
    }



    private static class CachedAQI {
        Map<String, Object> data;
        long timestamp;

        CachedAQI(Map<String, Object> data, long timestamp) {
            this.data = data;
            this.timestamp = timestamp;
        }
    }
}
