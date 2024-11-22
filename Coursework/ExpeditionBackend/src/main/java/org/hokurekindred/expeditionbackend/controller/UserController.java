package org.hokurekindred.expeditionbackend.controller;


import org.hokurekindred.expeditionbackend.authentication.service.UserService;
import org.hokurekindred.expeditionbackend.exceptions.UserNotFoundException;
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
    @GetMapping("/profile/{username}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable String username){
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
        response.put("user", UserMapper.INSTANCE.toUserResponse(user));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{userId}/skills")
    public ResponseEntity<Map<String, Object>> updateSkills(@PathVariable Long userId, @RequestBody Map<String, String> request){
        Map<String, Object> response = new HashMap<>();
        String skills = request.get("skills");
        try {
            User changedUser = userService.updateSkills(userId, skills);
            response.put("message", "Skill updated successfully");
            response.put("user", changedUser);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e){
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }catch (UserNotFoundException e){
          response.put("error", e.getMessage());
          return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e){
            response.put("error", "Fail while updating");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{userId}/info")
    public ResponseEntity<Map<String, Object>> updateUserInfo(@PathVariable Long userId, @RequestBody Map<String, String> request){
        Map<String, Object> response = new HashMap<>();
        String aboutUser = request.get("aboutUser");
        try {
            User changedUser = userService.updateUserInfo(userId, aboutUser);
            response.put("message", "Information about user updated successfully");
            response.put("user", changedUser);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (IllegalArgumentException e){
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }catch (UserNotFoundException e){
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (Exception e){
            response.put("error", "Fail while updating");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
