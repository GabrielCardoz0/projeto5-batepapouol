let dados;

let user;

function newUser(){
    user = 
    {
        name: prompt("Digite seu nome de usuário:")
    };
    verificarUser();
}
newUser();

function verificarUser(){
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user);
    requisicao.then(tratarSucesso);
    requisicao.catch(tratarErro);
}

function tratarSucesso(resposta){
    console.log('Nome de usuário enviado com sucesso');
    let ul = document.querySelector('.chat');
    ul.innerHTML = ul.innerHTML +
    `<li class="join">
        <span class="hora">(09:09:09)</span>
        <span class="usuario">${user.name}</span>
        <span class="mensagem">entrou na sala...</span>
    </li>`
    const IntervalId = setInterval(userOnline, 5000);
}

function userOnline(){
    const online = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
    online.catch(tratarErro);
}

function tratarErro(erro){
    console.log('Ihhh, deu erro');
    console.log(erro.response.status);
    user = 
    {
        name: prompt("Este nome já está sendo utilizado, por favor insira outro:")
    };
    verificarUser();
}


const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
promessa.then(chegou);
promessa.catch(naochegou);

function chegou(resposta){
    //console.log('os dados de nomes de usuário chegaram');
    //console.log(resposta.data);
}
function naochegou(resposta){
    console.log('os dados de nomes de usuário não chegaram');
}


/*--------------Parte das mensagens do servidor--------------------------------*/


const request = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
request.then(msgChegou);
request.catch(msgNaoChegou);

function msgChegou(resposta){
    //console.log('as mensagens chegaram:');
    adicionarATela(resposta);
    }
function msgNaoChegou(resposta){
    console.log('As mensagens não chegaram');
}


let mensagens;

function adicionarATela(resposta){
    mensagens = resposta.data;
    console.log(mensagens);

    const chat = document.querySelector('.chat');
    let msg;

    for(let i = 0; i < mensagens.length; i++){

        if(mensagens[i].type == 'status'){
        msg =`<li class="join">
        <span class="hora">(${mensagens[i].time})</span>
        <span class="mensagem"><span class="usuario">${mensagens[i].from}</span>
        ${mensagens[i].text}</span></li>`;

        chat.innerHTML = chat.innerHTML + msg;
        
        } else if (mensagens[i].type == 'message'){
            msg = `<li class="message">
            <span class="hora">(${mensagens[i].time})</span>
            <span class="usuario">${mensagens[i].from}</span>
            para<span class="usuario">todos:</span>
            ${mensagens[i].text}
        </li>`
            chat.innerHTML = chat.innerHTML + msg;
            //msg.scrollIntoView();
        } else if (mensagens[i].type == 'private_message'){
            msg = `<li class="message">
            <span class="hora">(${mensagens[i].time})</span>
            <span class="usuario">${mensagens[i].from}</span>
            para<span class="usuario">${mensagens[i].to}:</span>
            ${mensagens[i].text}
        </li>`
            chat.innerHTML = chat.innerHTML + msg;
        }
    }
}


/*-------Parte do envio de mensagens para o servidor--------------------------------*/


let input = document.querySelector('input');

function enviarMensagem(){
    MensagemAEnviar = `{
        from: "${user}",
        to: "Todos",
        text: "${input.value}",
        type: "message" 
    }`;
    console.log(MensagemAEnviar);

    

    const enviarMensagem = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', MensagemAEnviar);
    enviarMensagem.then(MensagemEnviada);
    enviarMensagem.catch(MensagemNaoEnviada);
}

function MensagemEnviada(resposta){
    input.value = '';
    console.log('Mensagem enviada');
}
function MensagemNaoEnviada(resposta){
    console.log(resposta.response.status);
    alert('Mensagem não enviada');
}