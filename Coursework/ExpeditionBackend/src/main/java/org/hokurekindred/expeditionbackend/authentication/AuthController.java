package org.hokurekindred.expeditionbackend.authentication;

import jakarta.mail.MessagingException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hokurekindred.expeditionbackend.model.User;
import org.hokurekindred.expeditionbackend.repository.RoleRepository;
import org.hokurekindred.expeditionbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static org.hokurekindred.expeditionbackend.Constants.ACTIVATION_LINK;


@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class AuthController {
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
    @PersistenceContext
    private EntityManager entityManager;


    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminEndpoint() {
        return "This is an admin endpoint";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public String userEndpoint() {
        return "This is a user endpoint";
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public String ownerEndpoint() {
        return "This is an owner endpoint";
    }

    @GetMapping("/secure")
    public String secureEndpoint() {
        return "This is a secure endpoint";
    }

    @PostMapping("/login/username")
    public ResponseEntity<Map<String, Object>> loginByUsername(@RequestBody LoginRequest loginRequest) {
        User user = userService.validateUsername(loginRequest);
        System.out.println(loginRequest);
        if (user == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Bad login or password");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("token", jwtTokenProvider.generateToken(user.getUsername()));
        user.setPassword("");
        successResponse.put("user", user);
        return new ResponseEntity<>(successResponse, HttpStatus.OK);
    }

    @PostMapping("/login/email")
    public ResponseEntity<Map<String, Object>> loginByEmail(@RequestBody LoginRequest loginRequest) {
        User user = userService.validateEmail(loginRequest);
        if (user == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Bad email or password");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("token", jwtTokenProvider.generateToken(user.getUsername()));
        user.setPassword("");
        successResponse.put("user", user);
        return new ResponseEntity<>(successResponse, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User userRegistrationInfo) {
        Map<String, String> response = new HashMap<>();
        if (userRegistrationInfo.getUsername() == null || userRegistrationInfo.getEmail() == null || userRegistrationInfo.getUsername().isBlank() || userRegistrationInfo.getEmail().isBlank()) {
            response.put("error", "Email and Username are required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        if (userService.findUserWithRolesByEmail(userRegistrationInfo.getEmail()) != null) {
            response.put("error", "Email already taken");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        if (userService.findUserWithRolesByUsername(userRegistrationInfo.getUsername()) != null) {
            response.put("error", "Username already taken");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        userService.encodePasswordAndSaveUser(userRegistrationInfo);
        return sendActivation(userRegistrationInfo.getEmail());
    }

    @GetMapping("/send-activation")
    public ResponseEntity<Map<String, String>> sendActivation(@RequestParam("email") String email) {
        User user = userService.findUserWithRolesByEmail(email);
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

    @GetMapping("/activate")
    public ResponseEntity<Map<String, String>> activateAccount(@RequestParam("token") String token) {
        Map<String, String> response = new HashMap<>();
        System.out.println(token);
        if (!jwtTokenProvider.validateActivationToken(token)) {
            response.put("error", "Invalid activation token or expired token");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
        User user = userService.findUserWithRolesByEmail(jwtTokenProvider.getEmailFromActivationToken(token));
        if (user == null) {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        if (user.getRole().contains(roleRepository.findByName("USER"))) {
            response.put("error", "User is already activated");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        user.addRoles(roleRepository.findByName("USER"));
        entityManager.clear();
        userRepository.removeRolesByUserId(user.getId());
        entityManager.clear();
        userRepository.save(user);
        response.put("message", "User activated successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/add-administrator-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> addAdministratorRole(@RequestParam("user") String userName) {
        User user = userService.findUserWithRolesByUsername(userName);
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        if (user.getRole().contains(roleRepository.findByName("ADMIN"))) {
            response.put("error", "User is already admin");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        entityManager.clear();
        userRepository.removeRolesByUserId(user.getId());
        user.addRoles(roleRepository.findByName("ADMIN"));
        entityManager.clear();
        userRepository.save(user);
        response.put("message", String.format("User %s is now ADMIN", userName));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/remove-administrator-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> removeAdministratorRole(@RequestParam("user") String userName) {
        User user = userService.findUserWithRolesByUsername(userName);
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        user.removeRoles(roleRepository.findByName("ADMIN"));
        entityManager.clear();
        userRepository.removeRolesByUserId(user.getId());
        entityManager.clear();
        userRepository.save(user);
        response.put("message", String.format("User %s is not now ADMIN", userName));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/delete-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@RequestParam("user") String userName) {
        User user = userService.findUserWithRolesByUsername(userName);
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        if (user.getRole().contains(roleRepository.findByName("ADMIN"))) {
            response.put("error", "U can not delete administrator");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        entityManager.clear();
        userRepository.removeRolesByUserId(user.getId());
        entityManager.clear();
        userRepository.delete(user);
        response.put("message", String.format("User %s deleted", userName));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
