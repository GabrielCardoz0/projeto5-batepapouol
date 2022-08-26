let dados;

let user;

function newUser() {
    user =
    {
        name: prompt("Digite seu nome de usuário:")
    };
    verificarUser();
}
newUser();

function verificarUser() {
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user);
    requisicao.then(tratarSucesso);
    requisicao.catch(tratarErro);
}

function tratarSucesso(resposta) {
    setInterval(userOnline, 5000);
    pedirMensagens();
}

function userOnline() {
    const online = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
    online.catch(tratarErro);
}

function tratarErro(erro) {
    console.log('Ihhh, deu erro');
    console.log(erro.response.status);
    user =
    {
        name: prompt("Este nome já está sendo utilizado, por favor insira outro:")
    };
    verificarUser();
}
/*--------------Parte das mensagens do servidor--------------------------------*/

setInterval(pedirMensagens, 3000);

function pedirMensagens() {
    const request = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    request.then(adicionarATela);
    request.catch(() => { console.log('As mensagens não chegaram') });
}
function msgNaoChegou(resposta) {
    console.log('As mensagens não chegaram');
}




function adicionarATela(resposta) {
    const mensagens = resposta.data;
    const chat = document.querySelector('.chat');
    chat.innerHTML = '';
    let msg;

    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type == 'status') {
            msg = `<li class="join">
        <span class="hora">(${mensagens[i].time})</span>
        <span class="mensagem"><span class="usuario">${mensagens[i].from}</span>
        ${mensagens[i].text}</span></li>`;
            chat.innerHTML = chat.innerHTML + msg;
        } else if (mensagens[i].type == 'message') {
            msg = `<li class="message">
            <span class="hora">(${mensagens[i].time})</span>
            <span class="usuario">${mensagens[i].from}</span>
            para<span class="usuario">todos:</span>
            ${mensagens[i].text}
        </li>`
            chat.innerHTML = chat.innerHTML + msg;
            //msg.scrollIntoView();
        } else if (mensagens[i].type == 'private_message') {
            msg = `<li class="message">
            <span class="hora">(${mensagens[i].time})</span>
            <span class="usuario">${mensagens[i].from}</span>
            para<span class="usuario">${mensagens[i].to}:</span>
            ${mensagens[i].text}
        </li>`
            chat.innerHTML = chat.innerHTML + msg;
        }
    }

    const ultimoElemento = document.querySelector('li:last-child');
    ultimoElemento.scrollIntoView();

}

function cliqueiEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarMensagem();
    }
}


/*-------Parte do envio de mensagens para o servidor--------------------------------*/


let input = document.querySelector('input');

function enviarMensagem() {
    const mensagemAEnviar = {
        from: user.name,
        to: "Todos",
        text: input.value,
        type: "message"
    };
    console.log(mensagemAEnviar);



    const enviarMensagem = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagemAEnviar);
    enviarMensagem.then(MensagemEnviada);
    enviarMensagem.catch(MensagemNaoEnviada);
}

function MensagemEnviada(resposta) {
    input.value = '';
    console.log('Mensagem enviada');
}
function MensagemNaoEnviada(resposta) {
    console.log(resposta.response.status);
    alert('Mensagem não enviada');
}