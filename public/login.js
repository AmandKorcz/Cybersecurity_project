document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  try {
    alert("Processando login...");

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Credenciais inválidas");
    }

    // Armazenando o token e redireciona
    localStorage.setItem("token", data.token);
    alert("Login bem-sucedido! Redirecionando...");
    window.location.href = "gerenciamento.html";

  } catch (err) {
    alert("Erro no login: " + (err.message || "Tente novamente mais tarde"));
  }
});

document.getElementById('formCadastro')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('cadastroNome').value;
  const email = document.getElementById('cadastroEmail').value;
  const senha = document.getElementById('cadastroSenha').value;

  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro no cadastro");

    alert("Cadastro realizado com sucesso!");
    document.getElementById('formCadastro').reset();

  } catch (err) {
    alert("Erro no cadastro: " + (err.message || "Dados inválidos"));
  }
});