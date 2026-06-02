// Fase 3: o Mural salva e lista recados de verdade (DynamoDB via API). 🎉

const API_URL = "https://96j3wu0q2m.execute-api.us-east-1.amazonaws.com/default/hello-mural";

const form = document.getElementById("form-recado");
const lista = document.getElementById("lista-recados");
const nome = document.getElementById("nome");
const mensagem = document.getElementById("mensagem");
const contador = document.getElementById("contador");

// ----- Contador de caracteres ao vivo -----
mensagem.addEventListener("input", () => {
  const total = mensagem.value.length;
  contador.textContent = total + "/200";
  contador.classList.toggle("quase-cheio", total >= 180);
});

// ----- Segurança: escapa HTML do texto do usuário -----
// Sem isso, alguém poderia escrever <script> num recado e rodar código.
// Aqui transformamos qualquer HTML em texto puro (boa prática essencial).
function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// ----- Listar recados (GET) -----
async function carregarRecados() {
  try {
    const r = await fetch(API_URL);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const recados = await r.json();

    if (recados.length === 0) {
      lista.innerHTML = '<p class="vazio">Ainda não há recados. Seja o primeiro! 🙂</p>';
      return;
    }

    lista.innerHTML = recados
      .map(
        (rec) =>
          '<div class="recado"><span class="autor">' +
          escapeHtml(rec.nome) +
          "</span><p>" +
          escapeHtml(rec.mensagem) +
          "</p></div>"
      )
      .join("");
  } catch (erro) {
    lista.innerHTML = '<p class="vazio">⚠️ Erro ao carregar os recados. Veja o console (F12).</p>';
    console.error("Erro no GET:", erro);
  }
}

// ----- Enviar recado (POST) -----
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const botao = form.querySelector("button");
  botao.disabled = true;
  botao.textContent = "Enviando...";

  try {
    const r = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome.value, mensagem: mensagem.value }),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);

    form.reset();                 // limpa o formulário
    contador.textContent = "0/200";
    await carregarRecados();      // recarrega a lista (mostra o novo recado)
  } catch (erro) {
    alert("Não consegui enviar o recado. Tente de novo. 😕");
    console.error("Erro no POST:", erro);
  } finally {
    botao.disabled = false;
    botao.textContent = "Enviar recado";
  }
});

// Ao abrir a página, já carrega os recados existentes.
carregarRecados();
