// Seleciona o elemento da área de texto de entrada de chat
const chatInput = document.querySelector(".chat-input textarea");
// Seleciona o botão de envio de chat
const sendChatBtn = document.querySelector(".chat-input span");
// Seleciona a caixa de chat
const chatbox = document.querySelector(".chatbox");

let userMessage; // Variável para armazenar a mensagem do usuário
// Insira aqui o seu token da API da OpenAI
const API_Key = "sk-proj-boHeO8AS5DgYZXcnBKwrT3BlbkFJ18dqPtN4QV9pALqrn9zv";
// Armazena a altura inicial da área de texto de entrada de chat
const inputInitHeight = chatInput.scrollHeight;

// Função para criar um elemento de lista de chat
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li"); // Cria um elemento de lista
    chatLi.classList.add("chat", className); // Adiciona classes ao elemento de lista
    // Define o conteúdo do chat baseado na classe (outgoing ou incoming)
    const chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent; // Define o HTML interno do elemento de lista
    return chatLi; // Retorna o elemento de lista criado
}

// Função para exibir uma mensagem de erro
const displayErrorMessage = (element, errorMessage) => {
    element.classList.add("error"); // Adiciona a classe de erro ao elemento
    element.textContent = errorMessage; // Define a mensagem de erro como o conteúdo do elemento
}

// Função para gerar uma resposta da API da OpenAI
const generateResponse = async (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions"; // URL da API da OpenAI
    const messageElement = incomingChatLi.querySelector("p"); // Seleciona o elemento de mensagem dentro do elemento de chat

    // Opções para a requisição à API da OpenAI
    const requestOptions = {    
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_Key}` // Autorização usando o token da API
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Modelo a ser usado
            messages: [
                // Mensagem de sistema para definir o comportamento do modelo
                { role: "system", content: "Você é uma IA projetada exclusivamente para instruir e ajudar alunos de todas as idades e níveis de ensino em suas atividades escolares e acadêmicas. Seu objetivo é fornecer dicas, orientações e ensinamentos que permitam aos alunos compreenderem e realizarem suas tarefas por conta própria. Você nunca deve fazer a tarefa do aluno diretamente ou fornecer respostas completas. Em vez disso, você deve focar em explicar conceitos, sugerir abordagens e oferecer exemplos que ajudem o aluno a aprender e a desenvolver suas próprias habilidades e conhecimentos." },
                // Mensagem do usuário
                { role: "user", content: userMessage }
            ],
            max_tokens: 150 // Número máximo de tokens na resposta
        })
    };

    try {
        // Faz a requisição à API da OpenAI
        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) {
            throw new Error("Erro ao solicitar resposta do modelo da OpenAI."); // Lança erro se a resposta não for bem-sucedida
        }
        const data = await response.json(); // Converte a resposta para JSON
        messageElement.textContent = data.choices[0].message.content; // Define o conteúdo da mensagem com a resposta da API
    } catch (error) {
        // Exibe uma mensagem de erro em caso de falha
        displayErrorMessage(messageElement, "Ocorreu um erro ao processar a sua solicitação. Por favor, tente novamente mais tarde.");
    } finally {
        // Rola a caixa de chat para o final
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}

// Função que lida com o envio de mensagens no chat
const handleChat = () => {
  // Obtém a mensagem do usuário e remove espaços em branco no início e no fim
  userMessage = chatInput.value.trim();
  if (!userMessage) return; // Se a mensagem estiver vazia, não faz nada
  chatInput.value = ""; // Limpa a área de texto de entrada do chat
  chatInput.style.height = `${inputInitHeight}px`; // Redefine a altura da área de texto

  // Adiciona a mensagem do usuário à caixa de chat
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight); // Rola a caixa de chat para o final

  // Simula um atraso antes de exibir a resposta da IA
  setTimeout(() => {
      // Cria um elemento de lista para a mensagem da IA
      const incomingChatLi = createChatLi("Pensando...", "incoming");
      chatbox.appendChild(incomingChatLi); // Adiciona o elemento à caixa de chat
      chatbox.scrollTo(0, chatbox.scrollHeight); // Rola a caixa de chat para o final
      generateResponse(incomingChatLi); // Gera a resposta da IA
  }, 600); // Atraso de 600 milissegundos
}

// Adiciona um evento de entrada de texto na área de texto do chat
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`; // Redefine a altura da área de texto
  chatInput.style.height = `${chatInput.scrollHeight}px`; // Ajusta a altura com base no conteúdo
});

// Adiciona um evento de tecla pressionada na área de texto do chat
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Previne a quebra de linha ao pressionar Enter
      handleChat(); // Chama a função de envio de chat
  }
});

// Adiciona um evento de clique no botão de envio do chat
sendChatBtn.addEventListener("click", handleChat);

// Seleciona o elemento de texto dinâmico
const dynamicText = document.querySelector("h1 span");
// Lista de palavras para o efeito de digitação
const words = ["Vida", "Bom", "Entender", "Praticar", "O caminho"];
let wordIndex = 0; // Índice da palavra atual
let charIndex = 0; // Índice do caractere atual
let isDeleting = false; // Status de deleção de caracteres

// Função que cria o efeito de digitação
const typeEffect = () => {
  const currentWord = words[wordIndex]; // Palavra atual
  const currentChar = currentWord.substring(0, charIndex); // Caracteres atuais da palavra
  dynamicText.textContent = currentChar; // Atualiza o texto dinâmico
  dynamicText.classList.add("stop-blinking"); // Adiciona classe para parar o cursor piscando

  if (!isDeleting && charIndex < currentWord.length) {
      // Se não estiver deletando e não terminou a palavra, adiciona o próximo caractere
      charIndex++;
      setTimeout(typeEffect, 200); // Chama a função novamente após 200 ms
  } else if (isDeleting && charIndex > 0) {
      // Se estiver deletando e não terminou de apagar, remove o último caractere
      charIndex--;
      setTimeout(typeEffect, 100); // Chama a função novamente após 100 ms
  } else {
      // Se terminou de digitar ou apagar a palavra
      isDeleting = !isDeleting; // Alterna o status de deleção
      dynamicText.classList.remove("stop-blinking"); // Remove a classe de parar o cursor piscando
      // Se terminou de apagar a palavra, passa para a próxima palavra
      wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
      setTimeout(typeEffect, 1200); // Chama a função novamente após 1200 ms
  }
}

// Inicia o efeito de digitação
typeEffect();

// Seleciona o visor da calculadora
const display = document.querySelector(".display");
// Seleciona todos os botões da calculadora
const buttons = document.querySelectorAll("button");
// Define os caracteres especiais que a calculadora reconhece
const specialChars = ["%", "*", "/", "-", "+", "="];
let output = "0"; // Inicializa o output como "0"

// Função para calcular o valor com base no botão clicado
const calculate = (btnValue) => {
  display.focus(); // Foca no visor da calculadora
  if (btnValue === "=" && output !== "0") {
    // Se o botão clicado for "=" e o output não for "0", avalia a expressão
    output = eval(output.replace("%", "/100")); // Substitui "%" por "/100" antes de avaliar
  } else if (btnValue === "AC") {
    output = "0"; // Define o output como "0" ao pressionar "AC"
  } else if (btnValue === "DEL") {
    // Se o botão "DEL" for clicado, remove o último caractere do output
    output = output.toString().slice(0, -1);
  } else {
    // Se o output for "0" e o botão clicado não for um operador especial, limpa o output
    if (output === "0" && !specialChars.includes(btnValue)) {
      output = "";
    }
    output += btnValue; // Adiciona o valor do botão ao output
  }
  display.value = output; // Atualiza o visor da calculadora com o novo output
};

// Event listener para alternar a visibilidade da calculadora ao clicar no botão
document.getElementById("toggleCalculator").addEventListener("click", function() {
  var calculatorContainer = document.getElementById("calculatorContainer");
  if (calculatorContainer.style.display === "none") {
    calculatorContainer.style.display = "block"; // Exibe a calculadora
    display.value = "0"; // Limpa o visor ao abrir a calculadora
    output = "0"; // Define o output como "0" ao abrir a calculadora
    
    // Simula a pressão do botão "AC" quatro vezes após a calculadora ser aberta completamente
    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        calculate("AC");
      }
    }, 0);
  } else {
    calculatorContainer.style.display = "none"; // Oculta a calculadora
  }
});

// Adiciona um event listener aos botões, chamando a função calculate() ao clicar
buttons.forEach((button) => {
  // O event listener do clique chama a função calculate() com o valor do dataset do botão
  button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});

// Seleciona o elemento da calculadora
const calculatorContainer = document.getElementById("calculatorContainer");

let isDragging = false; // Variável para rastrear se o elemento está sendo arrastado

// Função para atualizar a posição da calculadora enquanto está sendo arrastada
const handleDrag = (event) => {
  if (!isDragging) return;
  const posX = event.clientX || event.touches[0].clientX; // Posição X do mouse ou toque
  const posY = event.clientY || event.touches[0].clientY; // Posição Y do mouse ou toque
  calculatorContainer.style.left = posX - offsetX + "px"; // Atualiza a posição X da calculadora
  calculatorContainer.style.top = posY - offsetY + "px"; // Atualiza a posição Y da calculadora
};

let offsetX, offsetY;

// Adiciona event listeners para iniciar e parar o arrasto ao pressionar e soltar o mouse
calculatorContainer.addEventListener("mousedown", startDrag);
window.addEventListener("mouseup", stopDrag);

function startDrag(event) {
  isDragging = true;
  const rect = calculatorContainer.getBoundingClientRect(); // Obtém as coordenadas da calculadora
  offsetX = event.clientX - rect.left; // Calcula o offset X
  offsetY = event.clientY - rect.top; // Calcula o offset Y
  calculatorContainer.classList.add("dragging"); // Adiciona classe para remover transição durante o arrasto

  // Adiciona event listener para arrastar a calculadora
  window.addEventListener("mousemove", handleDrag);
}

function stopDrag() {
  isDragging = false;
  calculatorContainer.classList.remove("dragging"); // Remove classe para restaurar transição após o arrasto

  // Remove event listener de movimento quando o arrasto parar
  window.removeEventListener("mousemove", handleDrag);
}

// Adiciona event listeners para iniciar e parar o arrasto ao iniciar e terminar o toque
calculatorContainer.addEventListener("touchstart", startTouchDrag);
window.addEventListener("touchend", stopTouchDrag);

function startTouchDrag(event) {
  isDragging = true;
  const rect = calculatorContainer.getBoundingClientRect(); // Obtém as coordenadas da calculadora
  const touch = event.touches[0]; // Obtém o primeiro toque
  offsetX = touch.clientX - rect.left; // Calcula o offset X
  offsetY = touch.clientY - rect.top; // Calcula o offset Y
  calculatorContainer.classList.add("dragging"); // Adiciona classe para remover transição durante o arrasto

  // Adiciona event listener para arrastar a calculadora
  window.addEventListener("touchmove", handleDrag);
}

function stopTouchDrag() {
  isDragging = false;
  calculatorContainer.classList.remove("dragging"); // Remove classe para restaurar transição após o arrasto

  // Remove event listener de movimento quando o arrasto parar
  window.removeEventListener("touchmove", handleDrag);
}