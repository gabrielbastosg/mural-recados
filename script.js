// Fase 3: o Mural salva e lista recados de verdade (DynamoDB via API). 🎉

const API_URL = "https://96j3wu0q2m.execute-api.us-east-1.amazonaws.com/default/hello-mural";

const form = document.getElementById("form-recado");
const lista = document.getElementById("lista-recados");
const titulo = document.getElementById("titulo-recados");
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

// ----- Formata a data ISO (UTC) para algo legível em pt-BR -----
// Ex.: "2026-06-02T17:07:33Z"  ->  "02/06/2026 14:07" (no horário local)
function formatarData(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ----- Listar recados (GET) -----
async function carregarRecados() {
  try {
    const r = await fetch(API_URL);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const recados = await r.json();

    // Atualiza o número de recados no título
    titulo.textContent = "Recados (" + recados.length + ")";

    if (recados.length === 0) {
      lista.innerHTML = '<p class="vazio">Ainda não há recados. Seja o primeiro! 🙂</p>';
      return;
    }

    lista.innerHTML = recados
      .map(
        (rec) =>
          '<div class="recado">' +
          '<div class="recado-topo">' +
          '<span class="autor">' + escapeHtml(rec.nome) + "</span>" +
          '<span class="meta">' +
          '<span class="data">' + formatarData(rec.criado_em) + "</span>" +
          '<button class="apagar" data-id="' + rec.id + '" title="Apagar recado">🗑️</button>' +
          "</span>" +
          "</div>" +
          "<p>" + escapeHtml(rec.mensagem) + "</p>" +
          "</div>"
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

// ----- Apagar recado (DELETE) -----
async function apagarRecado(id) {
  if (!confirm("Apagar este recado?")) return; // pede confirmação
  try {
    const r = await fetch(API_URL + "?id=" + encodeURIComponent(id), {
      method: "DELETE",
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    await carregarRecados(); // recarrega a lista sem o recado apagado
  } catch (erro) {
    alert("Não consegui apagar o recado. Tente de novo. 😕");
    console.error("Erro no DELETE:", erro);
  }
}

// Delegação de evento: um único listener na lista cuida de TODOS os botões 🗑️.
// (Como os recados são recriados a cada carregamento, é mais eficiente que
//  colocar um listener em cada botão.)
lista.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".apagar");
  if (botao) apagarRecado(botao.dataset.id);
});

// Ao abrir a página, já carrega os recados existentes.
carregarRecados();
