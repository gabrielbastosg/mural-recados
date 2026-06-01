// Fase 2: o site agora chama uma API DE VERDADE na AWS. 🎉
// (O POST para salvar recados chega na Fase 3, com o DynamoDB.)

const API_URL = "https://96j3wu0q2m.execute-api.us-east-1.amazonaws.com/default/hello-mural";

const form = document.getElementById("form-recado");
const lista = document.getElementById("lista-recados");
const mensagem = document.getElementById("mensagem");
const contador = document.getElementById("contador");

// Contador de caracteres ao vivo: roda toda vez que o usuário digita algo.
// "input" é o evento que dispara a cada tecla/colagem na caixa de texto.
mensagem.addEventListener("input", () => {
  const total = mensagem.value.length;
  contador.textContent = total + "/200";
  // Se passar de 180, fica amarelo (avisa que está quase no limite).
  contador.classList.toggle("quase-cheio", total >= 180);
});

// Ao abrir a página, chamamos a API e mostramos a resposta.
// Isso prova que o caminho site -> API Gateway -> Lambda -> resposta funciona.
async function testarApi() {
  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) throw new Error("HTTP " + resposta.status);
    const dados = await resposta.json();
    lista.innerHTML =
      '<div class="recado"><span class="autor">API AWS</span><p>' +
      dados.mensagem +
      "</p></div>";
  } catch (erro) {
    lista.innerHTML =
      '<p class="vazio">⚠️ Não consegui falar com a API. Abra o console (F12) para ver o erro.</p>';
    console.error("Erro ao chamar a API:", erro);
  }
}

// Por enquanto o formulário só avisa: salvar recados vem na Fase 3.
form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  alert("Em breve! Salvar recados vem na Fase 3, com o banco de dados (DynamoDB). 🙂");
});

testarApi();
