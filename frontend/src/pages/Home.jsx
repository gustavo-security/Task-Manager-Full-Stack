import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", date: "" });
    const [titleError, setTitleError] = useState(false);
    const [filter, setFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");


    const [feedback, setFeedback] = useState({
        type: "", // "success" | "error"
        message: ""
    });


    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [profile, setProfile] = useState({
        name: localStorage.getItem("userName") || "",
        email: "" // vai ser preenchido do backend
    });
    const userName = profile.name || localStorage.getItem("userName");

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    const [passwordFeedback, setPasswordFeedback] = useState({
        type: "", // "success" | "error"
        message: ""
    });

    useEffect(() => {
        if (passwordFeedback.type === "success") {
            const timer = setTimeout(() => {
                setPasswordFeedback({ type: "", message: "" });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [passwordFeedback]);


    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    const [tasksLoading, setTasksLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/"); // volta para a tela de login
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSaveTask();
        }
    };



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.log("Token não encontrado");
                    return;
                }

                const res = await fetch("http://localhost:8080/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Erro ao buscar dados do usuário");
                }

                const data = await res.json();
                setProfile({
                    name: localStorage.getItem("userName") || "",
                    email: data.email
                });


            } catch (err) {
                console.error("Erro no fetchUser:", err);
            }
        };

        if (isProfileOpen) fetchUser();
    }, [isProfileOpen]);


    const handleChangeName = async () => {
        if (!profile.name.trim()) {
            alert("O nome não pode ficar vazio");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/users/name", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: profile.name })
            });

            if (!res.ok) throw new Error("Erro ao alterar nome");

            localStorage.setItem("userName", profile.name);

            setFeedback({
                type: "success",
                message: "Nome alterado com sucesso"
            });

        } catch (err) {
            setFeedback({
                type: "error",
                message: err.message || "Erro ao alterar nome"
            });
        }
    };

    const handleChangePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordForm;

        // Limpa mensagens anteriores
        setPasswordFeedback({ type: "", message: "" });

        if (!currentPassword && !newPassword && !confirmPassword) return;

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordFeedback({
                type: "error",
                message: "Preencha todos os campos de senha"
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordFeedback({
                type: "error",
                message: "A nova senha e a confirmação não conferem"
            });
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/users/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (!res.ok) throw new Error("Erro ao trocar a senha");

            setPasswordFeedback({
                type: "success",
                message: "Senha alterada com sucesso"
            });

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (err) {
            setPasswordFeedback({
                type: "error",
                message: err.message || "Erro ao trocar a senha"
            });
        }
    };

    useEffect(() => {
        if (feedback.type === "success") {
            const timer = setTimeout(() => {
                setFeedback({ type: "", message: "" });
            }, 3000); // 3 segundos

            return () => clearTimeout(timer);
        }
    }, [feedback]);


    // 🔹 Buscar tasks do backend
    useEffect(() => {
        const fetchTasks = async () => {
            setTasksLoading(true);

            try {
                const res = await fetch("http://localhost:8080/tasks", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Erro ao buscar tasks");

                const data = await res.json();
                setTasks(
                    data.map(task => ({
                        ...task,
                        status: task.status.toUpperCase()
                    }))
                );
            } catch (err) {
                console.error(err.message);
            } finally {
                setTasksLoading(false);
            }
        };

        if (token) fetchTasks();
    }, [token]);


    // 🔹 Criar ou editar task
    const handleSaveTask = async () => {
        if (newTask.title.trim() === "") {
            setTitleError(true);
            return;
        }

        try {
            if (newTask.id) {
                // Editar task (PUT)
                const payload = {
                    title: newTask.title,
                    description: newTask.description,
                    status: newTask.status, // PENDENTE, CONCLUIDA, ATRASADA
                    dueDate: newTask.date || null
                };

                const res = await fetch(`http://localhost:8080/tasks/${newTask.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) throw new Error("Erro ao atualizar task");
                const updatedTask = await res.json();
                setTasks(tasks.map(task => task.id === updatedTask.id
                    ? { ...updatedTask, status: updatedTask.status.toUpperCase() }
                    : task
                ));

            } else {
                // Criar task (POST)
                const payload = {
                    title: newTask.title,
                    description: newTask.description,
                    dueDate: newTask.date || null
                };

                const res = await fetch("http://localhost:8080/tasks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) throw new Error("Erro ao criar task");
                const createdTask = await res.json();
                setTasks([...tasks, { ...createdTask, status: createdTask.status.toUpperCase() }]);
            }

            setIsModalOpen(false);
            setNewTask({ title: "", description: "", date: "" });
            setTitleError(false);

        } catch (err) {
            console.error(err.message);
        }
    };

    // 🔹 Concluir task (usa PUT, não PATCH)
    const handleConclude = async (task) => {
        try {
            const payload = {
                title: task.title,
                description: task.description,
                status: "CONCLUIDA",
                dueDate: task.date || null
            };

            const res = await fetch(`http://localhost:8080/tasks/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Erro ao concluir task");
            const updatedTask = await res.json();
            setTasks(tasks.map(t => t.id === updatedTask.id ? { ...updatedTask, status: updatedTask.status.toUpperCase() } : t));
        } catch (err) {
            console.error(err.message);
        }
    };

    // 🔹 Excluir task
    const handleDelete = async (taskId) => {
        try {
            const res = await fetch(`http://localhost:8080/tasks/${taskId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Erro ao excluir task");
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (err) {
            console.error(err.message);
        }
    };

    // 🔹 Abrir modal para editar task
    const handleEdit = (task) => {
        setNewTask({
            id: task.id,
            title: task.title,
            description: task.description || "",
            date: task.dueDate || "",
            status: task.status
        });
        setIsModalOpen(true);
    };

    // 🔹 Filtrar tasks
    const filteredTasks = tasks.filter(task => {
        // filtro por status
        if (filter !== "ALL" && task.status !== filter) return false;
        // filtro por pesquisa
        if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    return (
        <>
            <header className="navbar">
                <div className="navbar-content">
                    <h2>TaskManager</h2>

                    <div className="header-actions">
                        {userName && (
                            <span className="welcome-text">
                                Olá, <strong>{userName}</strong>
                            </span>
                        )}

                        <button className="icon-btn perfil" onClick={() => setIsProfileOpen(true)}>
                            <i className="fa-regular fa-user"></i>
                        </button>

                        <button className="icon-btn logout" onClick={handleLogout}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </button>
                    </div>
                </div>
            </header>

            <div className="home">
                <div className="painel">
                    <div className="title-row">
                        <h3>Minhas Tarefas</h3>
                        <div className="title-actions">
                            <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="ALL">Todas</option>
                                <option value="PENDENTE">Pendentes</option>
                                <option value="CONCLUIDA">Concluídas</option>
                                <option value="ATRASADA">Atrasadas</option>
                            </select>
                            <button className="new-task-btn" onClick={() => {
                                setNewTask({ title: "", description: "", date: "" });
                                setIsModalOpen(true);
                            }}>Nova tarefa</button>
                        </div>
                    </div>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Pesquisar tarefa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="task-list">

                        {tasksLoading && (
                            <div className="tasks-loading">
                                Carregando tarefas...
                            </div>
                        )}

                        {!tasksLoading && filteredTasks.length === 0 && (
                            <div className="tasks-empty">
                                Nenhuma tarefa!
                            </div>
                        )}

                        {!tasksLoading && filteredTasks.map(task => (
                            <div key={task.id} className="task-card">
                                <div className="task-header">
                                    <h4 className={`task-title ${task.status === "CONCLUIDA" ? "concluded" : ""}`}>
                                        {task.title}
                                    </h4>
                                    <span className={`task-badge ${task.status.toLowerCase()}`}>
                                        {task.status === "PENDENTE" ? "Pendente" :
                                            task.status === "CONCLUIDA" ? "Concluída" : "Atrasada"}
                                    </span>
                                </div>

                                {task.description && (
                                    <p className={`task-description ${task.status === "CONCLUIDA" ? "concluded" : ""}`}>
                                        {task.description}
                                    </p>
                                )}

                                <div className="task-footer">
                                    {task.dueDate && (
                                        <span className="task-date">
                                            {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                                        </span>
                                    )}

                                    <div className="task-actions">
                                        {task.status === "PENDENTE" && (
                                            <button className="btn-action conclude" onClick={() => handleConclude(task)}>Concluir</button>
                                        )}
                                        <button className="btn-action edit" onClick={() => handleEdit(task)}>Editar</button>
                                        <button className="btn-action delete" onClick={() => handleDelete(task.id)}>Excluir</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className={`profile-overlay ${isProfileOpen ? "show" : ""}`}
                    onClick={() => setIsProfileOpen(false)}
                >
                    <div
                        className={`profile-modal ${isProfileOpen ? "open" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Perfil</h3>

                        {/* Nome */}
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => {
                                setProfile({ ...profile, name: e.target.value });
                                setFeedback({ type: "", message: "" });
                            }}
                        />
                        {feedback.message && (
                            <span className={`input-feedback ${feedback.type}`}>
                                {feedback.message}
                            </span>
                        )}


                        {/* Email (readonly) */}
                        <label>Email:</label>
                        <input type="text" value={profile.email} readOnly />

                        {/* Salvar nome */}
                        <button
                            className="btn-save"
                            disabled={!profile.name.trim() || profile.name === localStorage.getItem("userName")}
                            onClick={handleChangeName}
                        >
                            Salvar nome
                        </button>

                        <hr />

                        {/* Senha */}
                        <h4>Trocar senha</h4>
                        <input
                            type="password"
                            placeholder="Senha atual"
                            value={passwordForm.currentPassword}
                            onChange={(e) => {
                                setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                                setPasswordFeedback({ type: "", message: "" });
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Nova senha"
                            value={passwordForm.newPassword}
                            onChange={(e) => {
                                setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                                setPasswordFeedback({ type: "", message: "" });
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Confirmar nova senha"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => {
                                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                                setPasswordFeedback({ type: "", message: "" });
                            }}
                        />
                        {passwordFeedback.message && (
                            <span className={`input-feedback ${passwordFeedback.type}`}>
                                {passwordFeedback.message}
                            </span>
                        )}

                        {/* Salvar senha */}
                        <div className="profile-actions">
                            <button
                                className="btn-save"
                                onClick={handleChangePassword}
                                disabled={
                                    !passwordForm.currentPassword &&
                                    !passwordForm.newPassword &&
                                    !passwordForm.confirmPassword
                                }
                            >
                                Salvar senha
                            </button>

                            <button className="btn-cancel" onClick={() => setIsProfileOpen(false)}>Fechar</button>
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>{newTask.id ? "Editar tarefa" : "Nova tarefa"}</h3>

                            <input
                                type="text"
                                placeholder="Título"
                                value={newTask.title}
                                onChange={(e) => {
                                    setNewTask({ ...newTask, title: e.target.value });
                                    if (titleError) setTitleError(false);
                                }}
                                onKeyDown={handleKeyDown}
                                className={titleError ? "input-error" : ""}
                            />

                            {titleError && <small className="error-text">O título é obrigatório</small>}

                            <input
                                type="text"
                                placeholder="Descrição"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                onKeyDown={handleKeyDown}
                            />

                            <input
                                type="date"
                                value={newTask.date}
                                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                            />

                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button className="btn-save" onClick={handleSaveTask}>Salvar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
