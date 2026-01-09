import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./Login.css";

import {
    Container,
    SignUpContainer,
    SignInContainer,
    Form,
    Title,
    Input,
    Button,
    OverlayContainer,
    Overlay,
    LeftOverlayPanel,
    RightOverlayPanel,
    GhostButton
} from "../components/Components.jsx";

import { register, login } from "../services/authService";

function App() {
    const [signIn, toggle] = useState(true);
    const navigate = useNavigate();

   
    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });

    const [loginMessage, setLoginMessage] = useState(null);

    const [registerMessage, setRegisterMessage] = useState(null);

    const [loginLoading, setLoginLoading] = useState(false);


    function handleRegisterChange(e) {
        setRegisterForm({
            ...registerForm,
            [e.target.type === "text" ? "name" : e.target.type]: e.target.value
        });
    }

    function handleLoginChange(e) {
        setLoginForm({
            ...loginForm,
            [e.target.type]: e.target.value
        });
    }

    async function handleLogin(e) {
        e.preventDefault();
        setLoginMessage(null);
        setLoginLoading(true);

        try {
            const response = await login(loginForm);

            localStorage.setItem("token", response.token);
            localStorage.setItem("userName", response.name);

            navigate("/home");
        } catch (err) {
            setLoginMessage({
                type: "error",
                text: err.message || "Email ou senha inválidos"
            });
        } finally {
            setLoginLoading(false);
        }
    }


    async function handleRegister(e) {
        e.preventDefault();
        setRegisterMessage(null);

        try {
            await register(registerForm);

            setRegisterMessage({
                type: "success",
                text: "Cadastro realizado com sucesso! Você já pode entrar."
            });

            setTimeout(() => {
                toggle(true);
                setRegisterMessage(null); // limpa antes de trocar
            }, 1000);

        } catch (err) {
            setRegisterMessage({
                type: "error",
                text: err.message || "Erro ao realizar cadastro"
            });
        }
    }

    useEffect(() => {
        document.body.classList.add("login-page");
        return () => {
            document.body.classList.remove("login-page");
        };
    }, []);

    return (
        <Container>
            <SignUpContainer $signinIn={signIn}>
                <Form onSubmit={handleRegister}>
                    <Title>Criar conta</Title>
                    {registerMessage && (
                        <div className={`auth-message ${registerMessage.type}`}>
                            {registerMessage.text}
                        </div>
                    )}

                    <Input
                        type="text"
                        placeholder="Nome"
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                    />

                    <Input
                        type="email"
                        placeholder="Email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                    />

                    <Input
                        type="password"
                        placeholder="Senha"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                    />

                    <Button type="submit">Cadastrar</Button>
                </Form>
            </SignUpContainer>

            <SignInContainer $signinIn={signIn}>
                <Form onSubmit={handleLogin}>
                    <Title>Entrar</Title>

                    {loginMessage && (
                        <div className={`auth-message ${loginMessage.type}`}>
                            {loginMessage.text}
                        </div>
                    )}

                    <Input
                        type="email"
                        placeholder="Email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        disabled={loginLoading}
                    />

                    <Input
                        type="password"
                        placeholder="Senha"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        disabled={loginLoading}
                    />


                    <Button type="submit" disabled={loginLoading}>
                        {loginLoading ? "Entrando..." : "Entrar"}
                    </Button>

                </Form>
            </SignInContainer>


            <OverlayContainer $signinIn={signIn}>
                <Overlay $signinIn={signIn}>
                    <LeftOverlayPanel $signinIn={signIn}>
                        <Title>TaskManager</Title>
                        <p>Organize suas tarefas e acompanhe seu progresso.</p>

                        <GhostButton onClick={() => toggle(true)}>
                            Entrar
                        </GhostButton>
                    </LeftOverlayPanel>


                    <RightOverlayPanel $signinIn={signIn}>
                        <Title>TaskManager</Title>
                        <p>Crie sua conta e comece a se organizar hoje.</p>

                        <GhostButton onClick={() => toggle(false)}>
                            Criar conta
                        </GhostButton>
                    </RightOverlayPanel>

                </Overlay>
            </OverlayContainer>
        </Container>
    );
}

export default App;
