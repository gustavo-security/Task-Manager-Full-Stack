package com.gustavo.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangeNameRequestDTO(
        @NotBlank String name
) {}