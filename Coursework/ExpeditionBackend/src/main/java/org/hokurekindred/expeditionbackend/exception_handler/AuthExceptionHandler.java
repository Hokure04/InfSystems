package org.hokurekindred.expeditionbackend.exception_handler;

import io.jsonwebtoken.JwtException;
import jakarta.mail.MessagingException;
import jakarta.mail.SendFailedException;
import org.eclipse.angus.mail.smtp.SMTPAddressFailedException;
import org.hokurekindred.expeditionbackend.exceptions.UserAlreadyExistException;
import org.hokurekindred.expeditionbackend.exceptions.UserAlreadyHasRoleException;
import org.hokurekindred.expeditionbackend.exceptions.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class AuthExceptionHandler {

    @ExceptionHandler(SMTPAddressFailedException.class)
    public ResponseEntity<Map<String, String>> handleSMTPAddressFailedException(SMTPAddressFailedException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "This email address does not exist");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SendFailedException.class)
    public ResponseEntity<Map<String, String>> handleSendFailedException(SendFailedException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "This email address does not exist");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<Map<String, String>> handleMessagingException(MessagingException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "This email address does not exist");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(MailSendException.class)
    public ResponseEntity<Map<String, String>> handleMailSendException(MailSendException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        Throwable cause = ex.getCause();

        if (cause instanceof SendFailedException) {
            Throwable nestedCause = cause.getCause();
            if (nestedCause instanceof SMTPAddressFailedException) {
                errorResponse.put("error", "Invalid email address");
                errorResponse.put("message", nestedCause.getMessage());
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        }

        errorResponse.put("error", "Email sending failed");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFoundException(UserNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "User not found");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentialsException(BadCredentialsException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Invalid login or password");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserAlreadyExistException.class)
    public ResponseEntity<Map<String, String>> handleUserAlreadyExistException(UserAlreadyExistException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "User with this credentials already exist");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String, String>> handleJwtException(JwtException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Invalid or expired token");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserAlreadyHasRoleException.class)
    public ResponseEntity<Map<String, String>> handleUserAlreadyHasRoleException(UserAlreadyHasRoleException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "User is already admin");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }
}
