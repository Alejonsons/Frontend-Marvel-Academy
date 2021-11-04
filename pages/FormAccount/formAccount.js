$(document).ready(function(){
    $('#btn-form').on('click', function(){
        var id = Math.floor(Math.random() * 100000000);
        var nome = $('#formName').val();
        
        if(nome != ''){
            localStorage.setItem('@marvel:id', id);
            localStorage.setItem('@marvel:username', nome);
            
            window.location.href = `file:///C:/Users/55119/Desktop/Faculdade/Semestre%206/ADI/Frontend/pages/Home/index.html?`
        }else{
            alert('Insira o nome!');
            return;
        }
        
    });
});