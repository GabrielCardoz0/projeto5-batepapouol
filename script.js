
let dados;

let user = '';

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
    console.log('Dado enviado com sucesso');
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
    console.log('os dados chegaram');
    console.log(resposta.data);
}

function naochegou(resposta){
    console.log('os dados não chegaram');
}

