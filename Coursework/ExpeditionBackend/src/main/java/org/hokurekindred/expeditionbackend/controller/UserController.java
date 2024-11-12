package org.hokurekindred.expeditionbackend.controller;


import org.hokurekindred.expeditionbackend.authentication.service.UserService;
import org.hokurekindred.expeditionbackend.mapper.UserMapper;
import org.hokurekindred.expeditionbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.hokurekindred.expeditionbackend.model.User;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{username}")
    public ResponseEntity<Map<String, Object>> getEquipmentById(@PathVariable String username){
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findByUsername(username);
        if (user != null) {
            response.put("user", UserMapper.INSTANCE.toUserResponse(user));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("error", String.format("User with username %s not found", username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }



}
