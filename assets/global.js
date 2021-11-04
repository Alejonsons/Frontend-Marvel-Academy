var keys = {
    public: '68649d627a8a791c67e4de8bd65365de',
    private: '845240bb143263eb7230b103aa6e6413d8e259ba',
    hash: 'aef7a976703c5d282658dc7478507fa0',
    ts: '1633565706'
}

$(document).ready(function(){
    var url = window.location.href.split('/')
    if(url[url.length - 2] != 'Home'){
        $('<div class="load"><img src="../../assets/img/load.gif" /></div>').appendTo('body');
    }
    var user = localStorage.getItem('@marvel:username');
    if(user){
        $('#btn-convidado').hide();
        $('.btn-sair-wrapper').show();
        $('#btn-sair').show();
        $('#welcome-user').text('Olá, ' + user + '');
    }else{
        $('.logged-elements').hide();
        $('.btn-sair-wrapper').hide();
        $('#btn-sair').hide();
        $('.logged-elements').removeClass('d-flex');
        $('#btn-convidado').show();
    }
});

function showLoader(){
    $('.load').show();
}

function hideLoader(){
    $('.load').hide();
}

function redirectToHero(id){
    window.location.href = `file:///C:/Users/55119/Desktop/Faculdade/Semestre%206/ADI/Frontend/pages/Results/index.html?/id=${id}`;
}

function redirectToComic(id){
    window.location.href = `file:///C:/Users/55119/Desktop/Faculdade/Semestre%206/ADI/Frontend/pages/Comic/index.html?/id=${id}`;
}

function getParam(){
    var value = window.location.href.split('=')[1];
    console.log(value)
    return value;
}

$('#btn-pesquisa').on('click', function(ev){
    ev.preventDefault();
    var searchValue = $('#searchBar').val();
    if(searchValue != ''){
        window.location.href = `file:///C:/Users/55119/Desktop/Faculdade/Semestre%206/ADI/Frontend/pages/SearchResult/index.html?/value=${searchValue}`;
    }
});

$('#btn-convidado').on('click', function(ev){
    ev.preventDefault()
    window.location.href = `file:///C:/Users/55119/Desktop/Faculdade/Semestre%206/ADI/Frontend/pages/FormAccount/index.html`
});

$('#btn-sair').on('click', function(){
    localStorage.clear();
    window.location.href = 'file:///C:/Users/55119/Desktop/Faculdade/Semestre%206/ADI/Frontend/pages/Home/index.html?'
});

$('#btn-list').on('click', function(ev){
    ev.preventDefault();
    window.location.href = 'file:///C:/Users/55119/Desktop/Faculdade/Semestre%206/ADI/Frontend/pages/MyList/index.html'
})