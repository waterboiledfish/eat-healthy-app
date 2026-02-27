package com.example;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/recognize")
@CrossOrigin(origins = "*") // 解决组长提到的CORS跨域问题
public class RecognitionController {

    private final RestTemplate restTemplate = new RestTemplate();

    // 百度AI接口的Access Token
    private final String DISH_TOKEN = "24.3f7931c6f0fb1897aac6f8c4d2ecf3b5.2592000.1773714229.282335-122092421";
    private final String INGREDIENT_TOKEN = "24.4a12c5367be42a247e90501eac6c6c1b.2592000.1774343866.282335-122124389";

    @PostMapping("/dish")
    public String dish(@RequestBody Map<String, String> body) {
        String url = "https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=" + DISH_TOKEN;
        String payload = "image=" + body.get("image");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        return restTemplate.postForObject(url, new HttpEntity<>(payload, headers), String.class);
    }

    @PostMapping("/ingredient")
    public String ingredient(@RequestBody Map<String, Object> body) {
        String url = "https://aip.baidubce.com/api/v1/solution/direct/imagerecognition/combination?access_token=" + INGREDIENT_TOKEN;
        body.put("scenes", new String[]{"ingredient"});

        return restTemplate.postForObject(url, body, String.class);
    }
}