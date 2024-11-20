package org.hokurekindred.expeditionbackend.authentication.service;

import jakarta.validation.ConstraintViolationException;
import org.hokurekindred.expeditionbackend.dto.LoginRequest;
import org.hokurekindred.expeditionbackend.exceptions.UserAlreadyExistException;
import org.hokurekindred.expeditionbackend.model.User;
import org.hokurekindred.expeditionbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void save(User user) {
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new UserAlreadyExistException("User with the same credentials already exists", ex);
        } catch (TransactionSystemException ex) {
            Throwable rootCause = ex.getRootCause();
            if (rootCause instanceof ConstraintViolationException) {
                throw new UserAlreadyExistException("Validation constraints violated: " + rootCause.getMessage(), ex);
            }
            throw ex;
        }
    }

    public void encodePasswordAndSaveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        save(user);
    }

    public User validateUser(LoginRequest loginInfo) {
        Optional<User> optionalUser = loginInfo.getLogin().contains("@")
                ? userRepository.findByEmail(loginInfo.getLogin())
                : userRepository.findByUsername(loginInfo.getLogin());
        User user = optionalUser.orElseThrow(() -> new BadCredentialsException("Invalid login or password"));
        if (!passwordEncoder.matches(loginInfo.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid login or password");
        }
        return user;
    }

}