package com.gustavo.taskmanager.service;

import com.gustavo.taskmanager.repositories.UserRepository;
import com.gustavo.taskmanager.domain.user.User;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void changePassword(String currentPassword, String newPassword) {

        User user = getAuthenticatedUser();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Senha atual incorreta");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return (User) auth.getPrincipal();
    }

    public void changeName(String newName) {

        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }

        User user = getAuthenticatedUser();
        user.setName(newName);

        userRepository.save(user);
    }

    public String getAuthenticatedUserEmail() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        User user = (User) auth.getPrincipal();
        return user.getEmail();
    }

}
