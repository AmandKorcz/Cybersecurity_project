document.getElementById('logoutBtn')?.addEventListener('click', () => {
  // Limpa o token do localStorage
  localStorage.removeItem('token');
  
  // Redireciona para a página de login
  window.location.href = 'login.html';
});