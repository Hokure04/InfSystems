package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_role WHERE user_id = :userId", nativeQuery = true)
    void removeRolesByUserId(@Param("userId") Long userId);

}
