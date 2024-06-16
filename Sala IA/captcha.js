// Selecionando os elementos do DOM necessários
const captchaTextBox = document.querySelector(".captch_box input"); // Campo de exibição do captcha
const refreshButton = document.querySelector(".refresh_button"); // Botão de atualização do captcha
const captchaInputBox = document.querySelector(".captch_input input"); // Campo de entrada do usuário para o captcha
const message = document.querySelector(".message"); // Elemento para exibir mensagens ao usuário
const submitButton = document.querySelector(".button"); // Botão de envio do captcha

// Variável para armazenar o texto do captcha gerado
let captchaText = null;

// Função para gerar o captcha
const generateCaptcha = () => {
  // Gerando uma string aleatória
  const randomString = Math.random().toString(36).substring(2, 7);
  // Convertendo a string aleatória em um array
  const randomStringArray = randomString.split("");
  // Modificando a string para alternar entre maiúsculas e minúsculas
  const changeString = randomStringArray.map((char) => (Math.random() > 0.5 ? char.toUpperCase() : char));
  // Juntando os caracteres do array em uma string e adicionando espaços
  captchaText = changeString.join("   ");
  // Exibindo o captcha no campo de texto
  captchaTextBox.value = captchaText;
  console.log(captchaText); // Exibindo o captcha no console para fins de depuração
};

// Função para lidar com o clique no botão de atualização do captcha
const refreshBtnClick = () => {
  generateCaptcha(); // Gerando um novo captcha
  captchaInputBox.value = ""; // Limpando o campo de entrada do usuário
  captchaKeyUpValidate(); // Validando o novo captcha
};

// Função para validar o captcha quando o usuário digita
const captchaKeyUpValidate = () => {
  // Alternando a classe desabilitada do botão de envio com base no conteúdo do campo de entrada do captcha
  submitButton.classList.toggle("disabled", !captchaInputBox.value);
  if (!captchaInputBox.value) message.classList.remove("active"); // Removendo a classe ativa da mensagem se o campo de entrada estiver vazio
};

// Função para validar o captcha quando o usuário clica no botão de envio
const submitBtnClick = () => {
  // Removendo os espaços do texto do captcha gerado
  captchaText = captchaText
    .split("")
    .filter((char) => char !== " ")
    .join("");
  message.classList.add("active"); // Adicionando a classe ativa à mensagem
  // Verificando se o captcha inserido pelo usuário está correto ou não
  if (captchaInputBox.value === captchaText) {
    message.innerText = "Código captcha correto"; // Exibindo mensagem de sucesso
    message.style.color = "#6b6b6b"; // Definindo cor do texto da mensagem
    setTimeout(function() {
      window.open("chatbot.html", '_self'); // Redirecionando para outra página após 4 segundos
    }, 4000);
  } else {
    message.innerText = "Código captcha incorreto"; // Exibindo mensagem de erro
    message.style.color = "#FF2525"; // Definindo cor do texto da mensagem
  }
};

// Adicionando ouvintes de evento para o botão de atualização, campo de entrada do captcha e botão de envio
refreshButton.addEventListener("click", refreshBtnClick);
captchaInputBox.addEventListener("keyup", captchaKeyUpValidate);
submitButton.addEventListener("click", submitBtnClick);

// Gerando um captcha quando a página é carregada
generateCaptcha();