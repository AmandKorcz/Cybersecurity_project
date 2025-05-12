// Banco de dados em memória
let usuarios = [
  { id: 1, nome: "Flávia Souza", email: "fl.souza@catolicasc.edu.br" },
  { id: 2, nome: "Admin", email: "admin@admin.com" }
];

let nextId = 3;

// Função para renderizar a tabela
function renderizarTabela() {
  const tabela = document.getElementById('userTable');
  tabela.innerHTML = '';

  usuarios.forEach(usuario => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nome}</td>
      <td>${usuario.email}</td>
      <td class="actions">
        <button class="btn-edit" onclick="abrirPopupEdicao(${usuario.id})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn-delete" onclick="abrirPopupExclusao(${usuario.id})">
          <i class="fas fa-trash-alt"></i> Excluir
        </button>
      </td>
    `;
    tabela.appendChild(row);
  });
}

// Adicionar usuário
function adicionarUsuario() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!nome || !email) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos obrigatórios',
      text: 'Preencha todos os campos!'
    });
    return;
  }

  const novoUsuario = {
    id: nextId++,
    nome,
    email
  };

  usuarios.push(novoUsuario);
  renderizarTabela();
  
  // Limpa os campos
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';

  // Feedback
  Swal.fire({
    icon: 'success',
    title: 'Sucesso!',
    text: 'Usuário adicionado com sucesso',
    timer: 1500
  });
}

// Popup de Edição
function abrirPopupEdicao(id) {
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return;

  Swal.fire({
    title: 'Editar Usuário',
    html:
      `<input id="swal-nome" class="swal2-input" value="${usuario.nome}" placeholder="Nome">
       <input id="swal-email" class="swal2-input" value="${usuario.email}" placeholder="E-mail">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      return {
        nome: document.getElementById('swal-nome').value,
        email: document.getElementById('swal-email').value
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      usuario.nome = result.value.nome;
      usuario.email = result.value.email;
      renderizarTabela();
      Swal.fire('Salvo!', 'As alterações foram salvas.', 'success');
    }
  });
}

// Popup de Exclusão
function abrirPopupExclusao(id) {
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return;

  Swal.fire({
    title: 'Tem certeza?',
    text: `Você está excluindo o usuário ${usuario.nome}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      usuarios = usuarios.filter(u => u.id !== id);
      renderizarTabela();
      Swal.fire(
        'Excluído!',
        'O usuário foi removido.',
        'success'
      );
    }
  });
}

// Inicializa a tabela quando a página carrega
document.addEventListener('DOMContentLoaded', renderizarTabela);