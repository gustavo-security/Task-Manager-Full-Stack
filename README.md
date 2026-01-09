# TaskManager – Full Stack Application

Aplicação **Full Stack** para gerenciamento de tarefas, desenvolvida com **Java + Spring Boot** no backend e **React** no frontend.  
O sistema permite **autenticação de usuários** e **controle completo de tarefas (CRUD)**, com **proteção de rotas** e comunicação via **API REST**.

---

## 📌 Funcionalidades

### 🔐 Autenticação
- Login de usuário
- Proteção de rotas no frontend
- Comunicação segura com o backend

### 📝 Gerenciamento de Tarefas
- Criar tarefas
- Listar tarefas
- Atualizar tarefas
- Remover tarefas

### 🌐 Arquitetura
- Backend desacoplado do frontend
- Comunicação via **API REST**
- Organização em camadas (**Controller**, **Service**, **Repository**)

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java**
- **Spring Boot**
- Spring Web
- Spring Data JPA
- Maven
- Banco de dados configurável
- Arquitetura REST

### Frontend
- **React**
- JavaScript (ES6+)
- React Router
- Axios
- CSS puro
- Componentização

---

## 📂 Estrutura do Projeto

```bash
TaskManager-FullStack
│
├── back-end
│   ├── src/main/java
│   │   ├── controller
│   │   ├── service
│   │   ├── repository
│   │   └── model
│   ├── pom.xml
│   └── application.properties
│
└── front-end
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── routes
    │   ├── services
    │   └── App.jsx
    └── package.json

```
## ▶️ Como Executar o Projeto

### Pré-requisitos

	- Java 17+
	-	Node.js 18+
	-	Maven
	-	Git

⸻

🔧 Backend (Spring Boot)
``` bash
cd back-end
./mvnw spring-boot:run
```
O backend será iniciado em:
``` bash
http://localhost:8080
```
💻 Frontend (React)
``` bash
cd front-end
npm install
npm run dev
```
O frontend será iniciado em:
``` bash
http://localhost:5173
```
## 🔗 Comunicação Frontend ↔ Backend

- O frontend se comunica com o backend através de requisições HTTP (REST).
- As chamadas estão centralizadas em:

```bash
src/services/api.js
```

## 🔐 Proteção de Rotas

O acesso a páginas protegidas é controlado por:
``` bash
src/routes/ProtectedRoute.jsx
```
Usuários não autenticados não conseguem acessar rotas restritas.

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido com o objetivo de:
	-	Consolidar conhecimentos em Java + Spring Boot
	-	Praticar React e componentização
	-	Entender a comunicação Full Stack
	-	Aplicar conceitos reais usados no mercado

---


## 👨‍💻 Autor

Gustavo<br>
Estudante de Ciência da Computação<br>
Projeto desenvolvido para aprendizado e portfólio.







