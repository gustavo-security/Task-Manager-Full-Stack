package com.gustavo.taskmanager.task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, String> {

    List<Task> findByUserId(String userId);

    List<Task> findByUserIdAndStatus(String userId, TaskStatus status);
    
    List<Task> findByUserIdAndTitleContainingIgnoreCase(String userId, String title);

}
