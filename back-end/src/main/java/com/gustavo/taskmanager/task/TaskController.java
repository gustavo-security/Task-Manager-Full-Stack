package com.gustavo.taskmanager.task;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody CreateTaskRequest request) {

        Task task = taskService.createTask(
                request.title(),
                request.description(),
                request.dueDate());

        return ResponseEntity.ok(task);
    }

    @GetMapping
    public ResponseEntity<List<Task>> listTasks(
            @RequestParam(required = false) TaskStatus status) {
        return ResponseEntity.ok(taskService.listMyTasks(status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasks(
            @RequestParam String title) {
        return ResponseEntity.ok(taskService.searchMyTasks(title));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable String id,
            @RequestBody UpdateTaskRequest request) {

        Task task = taskService.updateTask(
                id,
                request.title(),
                request.description(),
                request.status(),
                request.dueDate());

        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
