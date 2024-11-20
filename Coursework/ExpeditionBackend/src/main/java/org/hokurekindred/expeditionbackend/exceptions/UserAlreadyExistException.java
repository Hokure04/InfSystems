package org.hokurekindred.expeditionbackend.exceptions;

public class UserAlreadyExistException extends RuntimeException {
    public UserAlreadyExistException(String message) {
        super(message);
    }
    public UserAlreadyExistException(String message, Throwable cause) {
        super(message, cause);
    }
}
