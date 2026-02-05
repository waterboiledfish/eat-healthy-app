package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // 告诉 Spring：我是一个网页接口
public class FoodController {

    @GetMapping("/hello") // 当用户访问 /hello 时执行我
    public String sayHello() {
        return "👋 组长你好！吃了么项目的后端接口已跑通！";
    }
}