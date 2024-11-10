package org.hokurekindred.expeditionbackend.authentication;

import jakarta.mail.MessagingException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.validation.Valid;
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

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginByUsername(@Valid @RequestBody LoginRequest loginRequest) {
        User user = userService.validateUser(loginRequest);
        if (user == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Bad login or password");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("token", jwtTokenProvider.generateToken(user.getUsername()));
        successResponse.put("user", user);
        return new ResponseEntity<>(successResponse, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody User userRegistrationInfo) {
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

    @GetMapping("/send-activation")
    public ResponseEntity<Map<String, String>> sendActivation(@RequestParam("email") String email) {
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

    @GetMapping("/activate")
    public ResponseEntity<Map<String, String>> activateAccount(@RequestParam("token") String token) {
        Map<String, String> response = new HashMap<>();
        System.out.println(token);
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
        user.addRoles(roleRepository.findByName("USER"));
        entityManager.clear();
        userRepository.save(user);
        response.put("message", "User activated successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/add-administrator-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> addAdministratorRole(@RequestParam("user") String username) {
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
        entityManager.clear();
        user.addRoles(roleRepository.findByName("ADMIN"));
        userRepository.save(user);
        response.put("message", String.format("User %s is now ADMIN", username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/remove-administrator-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> removeAdministratorRole(@RequestParam("user") String username) {
        User user = userRepository.findByUsername(username);
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        user.removeRoles(roleRepository.findByName("ADMIN"));
        entityManager.clear();
        userRepository.save(user);
        response.put("message", String.format("User %s is not now ADMIN", username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/delete-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@RequestParam("user") String username) {
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
        entityManager.clear();
        userRepository.delete(user);
        response.put("message", String.format("User %s deleted", username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
