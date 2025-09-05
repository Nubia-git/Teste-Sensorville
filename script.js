// URL do script do Google Apps Script que recebe os dados
const scriptURL = "https://script.google.com/macros/s/AKfycbztlXLTxXJA4W1Opz0202QaIHXjlmqUP-CXYJlyuOFPvquOq9mZngSu_C5SPQrnUngg/exec";

// Adiciona um ouvinte de evento para o envio do formulário
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o comportamento padrão de recarregar a página

  // Coleta os dados dos campos do formulário
  const data = {
    nome: document.getElementById("nome").value,
    idade: document.getElementById("idade").value,
    imagem: document.getElementById("imagem").value
  };

  // Elemento para mostrar status do envio
  const statusEl = document.getElementById("status");
  statusEl.innerText = "Enviando...";
  statusEl.style.color = "#666";

  try {
    // Envia os dados para o Google Sheets via fetch
    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    // Tenta interpretar a resposta como JSON
    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Resposta não-JSON (possível URL errada ou CORS). Conteúdo: " + text.slice(0,200));
    }

    // Verifica se houve erro na resposta
    if (!response.ok || result.ok === false) {
      throw new Error(result?.error || `HTTP ${response.status}`);
    }

    // Sucesso: atualiza status e limpa o formulário
    statusEl.innerText = result.message || "✅ Dados enviados com sucesso!";
    statusEl.style.color = "green";
    document.getElementById("form").reset();
  } catch (err) {
    // Erro: mostra mensagem e loga no console
    console.error("Erro no envio:", err);
    statusEl.innerText = "❌ Erro ao enviar. Veja console (F12) / Network para detalhes.";
    statusEl.style.color = "red";
  }
});