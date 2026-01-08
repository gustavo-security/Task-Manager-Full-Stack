package com.gustavo.taskmanager.task;

import com.gustavo.taskmanager.domain.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(String title, String description, LocalDate dueDate) {

        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Título é obrigatório");
        }

        User user = getAuthenticatedUser();

        Task task = new Task(title, description, dueDate, user);

        updateStatusIfOverdue(task);

        return taskRepository.save(task);
    }

    public List<Task> listMyTasks(TaskStatus status) {
        User user = getAuthenticatedUser();

        if (status != null) {
            return taskRepository.findByUserIdAndStatus(user.getId(), status);
        }

        return taskRepository.findByUserId(user.getId());
    }

    public List<Task> searchMyTasks(String title) {

        User user = getAuthenticatedUser();

        if (title == null || title.isBlank()) {
            return taskRepository.findByUserId(user.getId());
        }

        return taskRepository.findByUserIdAndTitleContainingIgnoreCase(
                user.getId(),
                title);
    }

    public Task updateTask(String taskId, String title, String description, TaskStatus status, LocalDate dueDate) {

        User user = getAuthenticatedUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task não encontrada"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Você não tem permissão para editar esta task");
        }

        if (title != null && !title.trim().isEmpty()) {
            task.setTitle(title);
        }

        if (description != null) {
            task.setDescription(description);
        }

        if (dueDate != null) {
            task.setDueDate(dueDate);
        }

        if (status != null) {
            task.setStatus(status);
        }

        updateStatusIfOverdue(task);

        return taskRepository.save(task);
    }

    public void deleteTask(String taskId) {

        User user = getAuthenticatedUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task não encontrada"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Você não tem permissão para excluir esta task");
        }

        taskRepository.delete(task);
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    private void updateStatusIfOverdue(Task task) {
        if (task.getDueDate() != null &&
                task.getDueDate().isBefore(LocalDate.now()) &&
                task.getStatus() == TaskStatus.PENDENTE) {

            task.setStatus(TaskStatus.ATRASADA);
        }
    }
}
