package com.gustavo.taskmanager.task;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record CreateTaskRequest(
        @NotBlank String title,
        String description,
        LocalDate dueDate
) {
}
