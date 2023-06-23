const botaomodal = document.getElementById("btn");
const cards = document.querySelector(".cards");
const cadmodal = document.querySelector(".cadmodal");
const formulario = document.getElementById("formulario");
const nome = document.getElementById("nome");
const descricao = document.getElementById("descricao");
const foto = document.getElementById("foto");
const botaocadastrar = document.querySelector(".btncadastrar");
const botaoeditar = document.querySelector(".btneditar");
const botaofechar = document.querySelector(".btnclose");
const idelemento = document.getElementById("idalterar");
const mensagem = document.querySelector(".mensagem")

const botaomodalc = document.getElementById("btnc");
const cadmodalc = document.querySelector(".cadmodalc");
const botaofecharc = document.querySelector(".btnclosec");

var emaillogado;
femailLogado();

carregarCatalogo()

botaomodalc.onclick = () =>{
    cadmodalc.style.display = "flex";
}

function fecharc(){
    cadmodalc.style.display = "none";
}

botaomodal.onclick = () =>{
    nome.value = "";
    descricao.value = "";
    foto.value = "";
    cadmodal.style.display = "flex";
    botaoeditar.style.display = "none";
    botaocadastrar.style.display = "block"
}

function fechar(){
    cadmodal.style.display = "none";
}

botaocadastrar.onclick = (evento) => {
    evento.preventDefault();
    fenvio()
    .then(result =>{
        if(result){
            let dados = JSON.parse(localStorage.getItem("catalogo")) || [];
            dados.push(
                {
                    nome : nome.value,
                    descricao : descricao.value,
                    foto : nomeArq,
                    email : emaillogado
                }
            )
            localStorage.setItem("catalogo", JSON.stringify(dados));
        }
        else {
            alert ("Houve erro no envio do arquivo")
        }
    });
}

function carregarCatalogo() {
    let dados = JSON.parse(localStorage.getItem("catalogo"));
    let divcard = document.createElement("div") 
    if (dados == ""){
        divcard.innerHTML = "<p> Nenhum item encontrado </p>";
        mensagem.appendChild(divcard)
        return null
    }

    dados.forEach((elemento, indice) => {
        if(elemento.email == emaillogado){
        let divcard = document.createElement("div")
        divcard.setAttribute("class", "card")
        divcard.innerHTML = 
        `<div class="cardimg"><img src="img/${elemento.foto}"></div>
        <div class="cardinfo">
            <p>Nome</p>
            <div class="cardnome">${elemento.nome}</div>
            <p>Avaliação</p>
            <div class="av">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
            </div>
            <div class="edt">
                <div class="editar"><i class="bi bi-pencil-fill" onclick="editar(${indice})"></i></div>
                <div class="excluir"><i class="bi bi-trash3-fill" onclick="excluir(${indice})"></i></div>
            </div>
        </div>`
        cards.appendChild(divcard);}
    });
}

function editar(indice){
    nome.value = "";
    descricao.value = "";
    foto.value = "";
    cadmodal.style.display = "flex";
    botaocadastrar.style.display = "none"
    botaoeditar.style.display = "block"
    let dados = JSON.parse(localStorage.getItem("catalogo"));
    
    nome.value = dados[indice].nome;
    descricao.value = dados[indice].descricao;
    fotoa = dados[indice].foto;
    idelemento.value = indice;
}

var fotoa;
botaoeditar.onclick = (evento) => {
    if((fotoa != foto.value)&&(foto.value !="")){
        evento.preventDefault();
        fenvio()
        .then(result =>{
           if(result){
               salvarEdicao(nomeArq);
            }
            else{
                alert("Houve erro no envio do arquivo")
           }
        })
    }
    else{
        salvarEdicao(fotoa)
    }
}

function salvarEdicao(pfoto){
    let dados = JSON.parse(localStorage.getItem("catalogo"));
    dados[idelemento.value].nome = nome.value;
    dados[idelemento.value].descricao = descricao.value;
    dados[idelemento.value].foto = pfoto;
    dados[idelemento.value].email = emaillogado;
    localStorage.setItem("catalogo", JSON.stringify(dados));
}

function excluir(indice){
    if (confirm("Tem certeza de que deseja excluir?")) {
        let dados = JSON.parse(localStorage.getItem("catalogo"));
    dados.splice(indice,1);
    localStorage.setItem("catalogo", JSON.stringify(dados));
    window.location.reload();
    }
}

var nomeArq;
async function fenvio() {
    const url = 'http://localhost:3005/upload';
    const arquivo = document.getElementById("foto").files[0];
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    console.log(JSON.stringify(formData));
    try{
        var resp = await fetch(url, {
            method: 'POST',
            body: formData
        })
        if (resp.ok){
            let respText = await resp.text();
            nomeArq = respText;
            return true;
        }
        else{
            return false
        }
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

function femailLogado() {
    let dados = sessionStorage.getItem("logado");
    if (dados == null) {
        window.location.assign("login.html");
    }
    else {
        emaillogado = dados;
    }
}
