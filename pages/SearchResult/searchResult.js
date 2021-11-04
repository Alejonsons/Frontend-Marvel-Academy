$(document).ready(function(){
    showLoader();
    var value = getParam();
    $('.title').text('Resultados obtidos de "' + value + '"');
    getHeroes(value);
});

function getHeroes(value){
    $.ajax({
        dataType: "json",
        url: `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${value}&ts=${keys.ts}&apikey=${keys.public}&hash=${keys.hash}`,
        success: function(response){

            console.log(response.data.results)
            var count = 0;
            response.data.results.forEach(function(item){
                count++;
                var aux = item.thumbnail.path.split('/');
                if(aux[aux.length - 1] != 'image_not_available'){
                    $('.results').append('<div data-codigo="' + item.id + '" class="result-item"><img src="' + item.thumbnail.path + '.jpg"/><div class="name-wrapper"><p class="m-0">' + item.name + '</p></div></div>')
                }else{
                    $('.results').append('<div data-codigo="' + item.id + '" class="result-item"><img src="../../assets/img/image_not_available.jpg"/><div class="name-wrapper"><p class="m-0">' + item.name + '</p></div></div>')
                }
            })
            $('.result-item').off().on('click', function(){
                redirectToHero($(this).data('codigo'));
            });
            if(count >= response.data.results.length ){
                hideLoader();
            }
        }
    });
}