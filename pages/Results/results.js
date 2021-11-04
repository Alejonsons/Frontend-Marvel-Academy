$(document).ready(function(){
    var id = getParam();
    showLoader();
    getFavoriteHeroes();
    getComics(id);
    
});

function getFavoriteHeroes(){
    var user_id = localStorage.getItem('@marvel:id')
    
    $.ajax({
        dataType: "json",
        contentType:'application/json',
        method: 'GET',
        url: `http://localhost:8088/heroes/${user_id}`,
        success: function(response){
            getHeroInfo(getParam(), response)
        }
    });
}

function getHeroInfo(id, favoritos){
    $.ajax({
        dataType: "json",
        url: `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${keys.ts}&apikey=${keys.public}&hash=${keys.hash}`,
        success: function(response){
            console.log(response.data.results[0])
            $('.hero-info').append('<div class="col-sm-3" style="display: flex; flex-direction: column"><img style="width: 200px;" src="' + response.data.results[0].thumbnail.path + '.jpg" /><p style="font-size: 28px; color: white;">' + response.data.results[0].name + '</p></div>')
            if(response.data.results[0].description != ""){
                $('.hero-info').append('<div class="col-sm-8"><p style="color: white; padding: 10px; font-size: 22px">' + response.data.results[0].description + '</p></div>');
                $('.hero-info').append('<div class="col-sm-1 d-flex justify-content-end" style="height: fit-content"><i data-codigo=' + response.data.results[0].id + ' class="far fa-star star-no-favorite" style="font-size: 28px; cursor: pointer;"></i><i data-codigo=' + response.data.results[0].id + ' class="fas fa-star star-favorite" style="font-size: 28px; cursor: pointer; display: none"></i></div>')
            }else{
                $('.hero-info').append('<div class="col-sm-8"><p style="color: white; padding: 10px; font-size: 22px">Oops... Description not found!</p></div>');
                $('.hero-info').append('<div class="col-sm-1 d-flex justify-content-end" style="height: fit-content"><i data-codigo=' + response.data.results[0].id + ' class="far fa-star star-no-favorite" style="font-size: 28px; cursor: pointer;"></i><i data-codigo=' + response.data.results[0].id + ' class="fas fa-star star-favorite" style="font-size: 28px; cursor: pointer; display: none"></i></div>')
            }

            favoritos.forEach(function(fav){
                var isFavorite = false;
                if(fav.id_hero == id){
                    isFavorite = true;
                    $('.star-favorite').show();
                    $('.star-no-favorite').hide();
                }
                if(isFavorite){
                    $('.star-no-favorite').hide();
                }
            });

            $('.star-no-favorite').off().on('click', function(){
                var id_hero = getParam();
                var id_user = localStorage.getItem('@marvel:id');
                var name_hero = response.data.results[0].name;

                var params = {
                    id_hero: id_hero.toString(),
                    id_user,
                    name_hero   
                }

                $.ajax({
                    dataType: "json",
                    contentType:'application/json',
                    data: JSON.stringify(params),
                    method: 'POST',
                    url: `http://localhost:8088/heroes/save`,
                    success: function(response){
                        $('.star-no-favorite').hide();
                        $('.star-favorite').show();
                    }
                });
            });

            $('.star-favorite').off().on('click', function(){
                var cod;
                var user_id = localStorage.getItem('@marvel:id')
    
                $.ajax({
                    dataType: "json",
                    contentType:'application/json',
                    method: 'GET',
                    url: `http://localhost:8088/heroes/${user_id}`,
                    success: function(response){
                        response.forEach(function(fav){
                            if(fav.id_hero == id){
                                cod = fav.id
                            }
                            $.ajax({
                                dataType: "json",
                                contentType:'application/json',
                                method: 'DELETE',
                                url: `http://localhost:8088/heroes/${cod}`
                            });
                            $('.star-favorite').hide();
                            $('.star-no-favorite').show();
                        });
                    }
                });
            });
        }
    });
}

function getComics(id){
    $.ajax({
        dataType: "json",
        url: `https://gateway.marvel.com:443/v1/public/characters/${id}/comics?ts=${keys.ts}&apikey=${keys.public}&hash=${keys.hash}`,
        success: function(response){
            var count = 0;
            console.log(response.data.results);
            response.data.results.forEach(function(item){
                var aux = item.thumbnail.path.split('/');
                count++;
                
                if(aux[aux.length - 1] != 'image_not_available'){
                    $('#comics-slick').append('<img data-codigo="' + item.id + '" title="' + item.title + '" class="comic" src="' + item.thumbnail.path +  '.jpg" />')
                }
            });

            if(count >= response.data.results.length){
                hideLoader();
            }

            $('.comic').off().on('click', function(){
                redirectToComic($(this).data('codigo'));
            });

            $('#comics-slick').slick({ 
                slidesToShow: 1,
                variableWidth: true
            });
            $('.slick-active').hide();
        }

    });
    
}