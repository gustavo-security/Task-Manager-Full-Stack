package com.gustavo.taskmanager.dto;

public record ChangePasswordRequestDTO(
        String currentPassword,
        String newPassword
) {}

