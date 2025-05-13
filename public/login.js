document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    if (!res.ok) throw data;

    localStorage.setItem("token", data.token);
    window.location.href = "gerenciamento.html";
  } catch (err) {
    Swal.fire("Erro", err.message || "Falha no login", "error");
  }
});
