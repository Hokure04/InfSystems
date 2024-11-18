package org.hokurekindred.expeditionbackend.authentication.service;

import jakarta.mail.MessagingException;
import org.hokurekindred.expeditionbackend.authentication.JwtTokenProvider;
import org.hokurekindred.expeditionbackend.dto.LoginRequest;
import org.hokurekindred.expeditionbackend.mapper.UserMapper;
import org.hokurekindred.expeditionbackend.model.Role;
import org.hokurekindred.expeditionbackend.model.User;
import org.hokurekindred.expeditionbackend.repository.RoleRepository;
import org.hokurekindred.expeditionbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

import static org.hokurekindred.expeditionbackend.Constants.ACTIVATION_LINK;

@Service
public class AuthService {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<Map<String, Object>> login(LoginRequest loginRequest) {
        User user = userService.validateUser(loginRequest);
        if (user == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Bad login or password");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("token", jwtTokenProvider.generateToken(user.getUsername()));
        successResponse.put("user", UserMapper.INSTANCE.toLoginResponse(user));
        return new ResponseEntity<>(successResponse, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> register(User userRegistrationInfo) {
        Map<String, String> response = new HashMap<>();
        if (userRepository.findByEmail(userRegistrationInfo.getEmail()) != null) {
            response.put("error", "Email already taken");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        if (userRepository.findByUsername(userRegistrationInfo.getUsername()) != null) {
            response.put("error", "Username already taken");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        userService.encodePasswordAndSaveUser(userRegistrationInfo);
        return sendActivation(userRegistrationInfo.getEmail());
    }

    public ResponseEntity<Map<String, String>> sendActivation(String email) {
        User user = userRepository.findByEmail(email);
        String activationToken = jwtTokenProvider.generateActivateToken(email);
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        try {
            emailService.sendActivationEmail(email, ACTIVATION_LINK + activationToken);
        } catch (MessagingException e) {
            response.put("error", String.format("Error sending activation email: %s", e));
            return new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE);
        }
        response.put("message", "Activation sent successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> activateAccount(String token) {
        Map<String, String> response = new HashMap<>();
        if (!jwtTokenProvider.validateActivationToken(token)) {
            response.put("error", "Invalid activation token or expired token");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
        User user = userRepository.findByEmail(jwtTokenProvider.getEmailFromActivationToken(token));
        if (user == null) {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        if (user.getRole().contains(roleRepository.findByName("USER"))) {
            response.put("error", "User is already activated");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        if (roleRepository.findByName("USER") == null) {
            roleRepository.save(new Role("USER"));
        }
        user.addRoles(roleRepository.findByName("USER"));
        userRepository.save(user);
        response.put("message", "User activated successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> addAdministratorRole(String username) {
        User user = userRepository.findByUsername(username);
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        if (user.getRole().contains(roleRepository.findByName("ADMIN"))) {
            response.put("error", "User is already admin");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        user.addRoles(roleRepository.findByName("ADMIN"));
        userRepository.save(user);
        response.put("message", String.format("User %s is now ADMIN", username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> removeAdministratorRole(String username) {
        User user = userRepository.findByUsername(username);
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        user.removeRoles(roleRepository.findByName("ADMIN"));
        userRepository.save(user);
        response.put("message", String.format("User %s is not now ADMIN", username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> deleteUser(String username) {
        User user = userRepository.findByUsername(username);
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        if (user.getRole().contains(roleRepository.findByName("ADMIN"))) {
            response.put("error", "U can not delete administrator");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        userRepository.delete(user);
        response.put("message", String.format("User %s deleted", username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
