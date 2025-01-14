package org.hokurekindred.expeditionbackend.authentication.service;

import jakarta.mail.MessagingException;
import org.hokurekindred.expeditionbackend.authentication.JwtTokenProvider;
import org.hokurekindred.expeditionbackend.authentication.Roles;
import org.hokurekindred.expeditionbackend.dto.LoginRequest;
import org.hokurekindred.expeditionbackend.mapper.UserMapper;
import org.hokurekindred.expeditionbackend.model.User;
import org.hokurekindred.expeditionbackend.repository.UserRepository;
import org.hokurekindred.expeditionbackend.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
    private UserRepository userRepository;
    @Autowired
    private RoleService roleService;

    public ResponseEntity<Map<String, Object>> login(LoginRequest loginRequest) {
        User user = userService.validateUser(loginRequest);
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("token", jwtTokenProvider.generateToken(user.getUsername()));
        successResponse.put("user", UserMapper.INSTANCE.toLoginResponse(user));
        return new ResponseEntity<>(successResponse, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> register(User userRegistrationInfo) throws MessagingException {
        userService.encodePasswordAndSaveUser(userRegistrationInfo);
        return sendActivation(userRegistrationInfo.getEmail());
    }

    public ResponseEntity<Map<String, String>> sendActivation(String email) throws MessagingException {
        userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with email: " + email + " not found"));
        String activationToken = jwtTokenProvider.generateActivateToken(email);
        Map<String, String> response = new HashMap<>();
        emailService.sendActivationEmail(email, ACTIVATION_LINK + activationToken);
        response.put("message", "Activation sent successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, Object>> changePassword(String newPassword, String username) {
        Map<String, Object> successResponse = new HashMap<>();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setPassword(newPassword);
        userService.encodePasswordAndSaveUser(user);
        successResponse.put("user", UserMapper.INSTANCE.toLoginResponse(user));
        return new ResponseEntity<>(successResponse, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> activateAccount(String token) {
        Map<String, String> response = new HashMap<>();
        jwtTokenProvider.validateActivationToken(token);
        User user = userRepository.findByEmail(jwtTokenProvider.getEmailFromActivationToken(token)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole().contains(roleService.ensureRoleExists(Roles.USER))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User is already activated");
        }
        user.addRoles(roleService.ensureRoleExists(Roles.USER));
        userService.save(user);
        response.put("message", "User activated successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> addAdministratorRole(String username) {
        Map<String, String> response = new HashMap<>();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with username: " + username + " not found"));
        if (user.getRole().contains(roleService.ensureRoleExists(Roles.ADMIN))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with username " + username + " is already admin");
        }

        user.addRoles(roleService.ensureRoleExists(Roles.ADMIN));
        userService.save(user);
        response.put("message", String.format("User %s is now ADMIN", username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> removeAdministratorRole(String username) {
        Map<String, String> response = new HashMap<>();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with username: " + username + " not found"));
        user.removeRoles(roleService.ensureRoleExists(Roles.ADMIN));
        userService.save(user);
        response.put("message", String.format("User %s is not now ADMIN", username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<Map<String, String>> deleteUser(String username) {
        Map<String, String> response = new HashMap<>();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with username: " + username + " not found"));
        if (user.getRole().contains(roleService.ensureRoleExists(Roles.ADMIN))) {
            response.put("error", "U can not delete administrator");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        userRepository.delete(user);
        response.put("message", String.format("User %s deleted", username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
