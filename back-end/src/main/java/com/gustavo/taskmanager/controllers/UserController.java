package com.gustavo.taskmanager.controllers;

import com.gustavo.taskmanager.dto.ChangePasswordRequestDTO;
import com.gustavo.taskmanager.dto.UserEmailResponse;
import com.gustavo.taskmanager.dto.UserEmailResponse;
import com.gustavo.taskmanager.dto.ChangeNameRequestDTO;
import com.gustavo.taskmanager.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordRequestDTO request) {
        userService.changePassword(
                request.currentPassword(),
                request.newPassword());

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/name")
    public ResponseEntity<Void> changeName(
            @RequestBody ChangeNameRequestDTO request) {
        userService.changeName(request.name());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public UserEmailResponse getEmail() {
        String email = userService.getAuthenticatedUserEmail();
        return new UserEmailResponse(email);
    }

}
