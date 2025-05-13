const API_URL = "http://localhost:3000";
let token = localStorage.getItem("token");

// Carrega usuários da API
async function renderizarTabela() {
  try {
    const res = await fetch(API_URL + "/", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const usuarios = await res.json();

    const tabela = document.getElementById('userTable');
    tabela.innerHTML = '';

    usuarios.forEach(usuario => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${usuario.id}</td>
        <td>${usuario.nome}</td>
        <td>${usuario.email}</td>
        <td class="actions">
          <button class="btn-edit" onclick="abrirPopupEdicao(${usuario.id}, '${usuario.nome}', '${usuario.email}')">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn-delete" onclick="abrirPopupExclusao(${usuario.id})">
            <i class="fas fa-trash-alt"></i> Excluir
          </button>
        </td>
      `;
      tabela.appendChild(row);
    });
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
  }
}

async function adicionarUsuario() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value; // Novo campo

  if (!nome || !email || !senha) {
    return Swal.fire("Erro", "Preencha todos os campos", "warning");
  }

  try {
    const res = await fetch(API_URL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Adicione autenticação
      },
      body: JSON.stringify({ nome, email, senha }) // Remove a senha fixa
    });

    if (!res.ok) throw await res.json();
    
    Swal.fire("Sucesso!", "Usuário cadastrado", "success");
    document.getElementById('formAdicionarUsuario').reset(); // Limpa o formulário
    renderizarTabela();
  } catch (err) {
    Swal.fire("Erro", err.message || "Erro ao criar usuário", "error");
  }
}

function abrirPopupEdicao(id, nomeAtual, emailAtual) {
  Swal.fire({
    title: 'Editar Usuário',
    html:
      `<input id="swal-nome" class="swal2-input" value="${nomeAtual}" placeholder="Nome">
       <input id="swal-email" class="swal2-input" value="${emailAtual}" placeholder="E-mail">
       <input id="swal-senha" class="swal2-input" type="password" placeholder="Nova senha (deixe em branco para manter a atual)">`,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      return {
        nome: document.getElementById('swal-nome').value,
        email: document.getElementById('swal-email').value,
        senha: document.getElementById('swal-senha').value || undefined // Envia só se preenchida
      }
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(result.value)
        });
        Swal.fire("Atualizado!", "Dados do usuário atualizados", "success");
        renderizarTabela();
      } catch (err) {
        Swal.fire("Erro", err.message || "Falha ao atualizar", "error");
      }
    }
  });
}

function abrirPopupExclusao(id) {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Essa ação não poderá ser desfeita!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        Swal.fire("Excluído!", "Usuário deletado", "success");
        renderizarTabela();
      } catch (err) {
        Swal.fire("Erro", err.message || "Falha ao excluir", "error");
      }
    }
  });
}

document.getElementById('formAdicionarUsuario')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  await adicionarUsuario();
});

document.addEventListener('DOMContentLoaded', renderizarTabela);
