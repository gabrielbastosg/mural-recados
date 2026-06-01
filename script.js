// Fase 1: o site é só estático. A lógica abaixo é um esqueleto que vamos
// ativar na Fase 2, quando a API (Lambda + API Gateway) existir.

// Quando a API estiver pronta, colocaremos a URL dela aqui:
const API_URL = ""; // ex.: "https://xxxx.execute-api.us-east-1.amazonaws.com"

const form = document.getElementById("form-recado");

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  // Na Fase 2 isto vai enviar (POST) o recado para a API.
  alert("A API ainda não foi criada. Isto será ativado na Fase 2. 🙂");
});

// Na Fase 2, uma função carregarRecados() fará fetch(API_URL + "/recados")
// e preencherá a lista na tela.
