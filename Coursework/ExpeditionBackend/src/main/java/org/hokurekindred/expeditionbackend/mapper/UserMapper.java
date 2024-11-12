package org.hokurekindred.expeditionbackend.mapper;


import org.hokurekindred.expeditionbackend.dto.LoginResponse;
import org.hokurekindred.expeditionbackend.dto.UserResponse;
import org.hokurekindred.expeditionbackend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    LoginResponse toLoginResponse(User user);
    UserResponse toUserResponse(User user);
}