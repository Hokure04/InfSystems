package org.hokurekindred.expeditionbackend.exception_handler;


import org.hibernate.NonUniqueResultException;
import org.hibernate.PropertyValueException;
import org.springframework.dao.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class DBExceptionHandler {

    // Spring Data exceptions
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Error with data integrity violation");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateKeyException(DuplicateKeyException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Error with duplicated key");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ResponseEntity<Map<String, String>> handleEmptyResultDataAccessException(EmptyResultDataAccessException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Error no results found");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IncorrectResultSizeDataAccessException.class)
    public ResponseEntity<Map<String, String>> handleIncorrectResultSizeDataAccessException(IncorrectResultSizeDataAccessException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Error incorrect number of results");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(QueryTimeoutException.class)
    public ResponseEntity<Map<String, String>> handleQueryTimeoutException(QueryTimeoutException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Error query timeout");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DataAccessResourceFailureException.class)
    public ResponseEntity<Map<String, String>> handleDataAccessResourceFailureException(DataAccessResourceFailureException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Error database not available");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(UncategorizedSQLException.class)
    public ResponseEntity<Map<String, String>> handleUncategorizedSQLException(UncategorizedSQLException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Error unknown exception");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.I_AM_A_TEAPOT);
    }


    // Hibernate exceptions
    @ExceptionHandler(PropertyValueException.class)
    public ResponseEntity<Map<String, String>> handlePropertyValueException(PropertyValueException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Error property value is null");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NonUniqueResultException.class)
    public ResponseEntity<Map<String, String>> handleNonUniqueResultException(NonUniqueResultException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Error non unique result");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }
}
