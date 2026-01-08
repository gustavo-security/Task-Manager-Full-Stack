package com.gustavo.taskmanager.task;

import java.time.LocalDate;

public record UpdateTaskRequest(
        String title,
        String description,
        TaskStatus status,
        LocalDate dueDate
) {
}
