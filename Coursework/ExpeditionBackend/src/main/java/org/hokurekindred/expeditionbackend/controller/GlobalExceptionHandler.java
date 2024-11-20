package org.hokurekindred.expeditionbackend.controller;

import jakarta.mail.MessagingException;
import jakarta.mail.SendFailedException;
import org.eclipse.angus.mail.smtp.SMTPAddressFailedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Internal Server Error");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
