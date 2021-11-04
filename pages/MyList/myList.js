$(document).ready(function(){
    showLoader();
    var favoriteHeroesIds = [];
    var favoriteComics = [];
    
    var user_id = localStorage.getItem('@marvel:id')

    $.ajax({
        dataType: "json",
        contentType:'application/json',
        method: 'GET',
        url: `http://localhost:8088/heroes/${user_id}`,
        success: function(response){
            response.forEach(function(favId){
                favoriteHeroesIds.push(favId.id_hero);
                
            });
            if(favoriteHeroesIds.length > 0){
                showFavoriteHeroes(favoriteHeroesIds);
            }else{
                $('.myFavoriteHeroes').append('<p style="font-size: 20px; color: #dedede">Nenhum herói favoritado por enquanto...</p>')
            }
        }
    });

    $.ajax({
        dataType: "json",
        contentType:'application/json',
        method: 'GET',
        url: `http://localhost:8088/comics/${user_id}`,
        success: function(response){
            response.forEach(function(favId){
                favoriteComics.push(favId.id_comic);
                
            });
            if(favoriteComics.length > 0){
                showFavoriteComics(favoriteComics);
            }else{
                $('.myFavoriteComics').append('<p style="font-size: 20px; color: #dedede">Nenhuma HQ favoritada por enquanto...</p>')
                hideLoader();
            }
        }
    });
});

function showFavoriteHeroes(heroesIds){
    heroesIds.forEach(function(favoriteHeroId){
        
        $.ajax({
            dataType: "json",
            url: `https://gateway.marvel.com:443/v1/public/characters/${favoriteHeroId}?ts=${keys.ts}&apikey=${keys.public}&hash=${keys.hash}`,
            success: function(response){
                var aux = response.data.results[0].thumbnail.path.split('/');
                if(aux[aux.length - 1] != 'image_not_available'){
                    $('.myFavoriteHeroes').append('<div data-codigo=' + response.data.results[0].id + ' class="favoriteHero-wrapper"><img class="favoritehero" src="' + response.data.results[0].thumbnail.path + '.jpg"/><div class="name-wrapper"><p class="m-0" style="color: white">' + response.data.results[0].name + '</p></div></div>')
                }else{
                    $('.myFavoriteHeroes').append('<div data-codigo=' + response.data.results[0].id + ' class="favoriteHero-wrapper"><img class="favoritehero" src="../../assets/img/image_not_available.jpg"/><div class="name-wrapper"><p class="m-0" style="color: white">' + response.data.results[0].name + '</p></div></div>')
                }

                $('.favoriteHero-wrapper').on('click', function(){
                    redirectToHero($(this).data('codigo'));
                });
            }
        });
        
    });
}

function showFavoriteComics(comicsIds){
    comicsIds.forEach(function(favoriteComicId){
        
        $.ajax({
            dataType: "json",
            url: `https://gateway.marvel.com:443/v1/public/comics/${favoriteComicId}?ts=${keys.ts}&apikey=${keys.public}&hash=${keys.hash}`,
            success: function(response){
                var aux = response.data.results[0].thumbnail.path.split('/');
                $('.myFavoriteComics').append('<img data-codigo="' + response.data.results[0].id + '" title="' + response.data.results[0].title + '" class="comic" src="' + response.data.results[0].thumbnail.path +  '.jpg" />')
                
                $('.comic').on('click', function(){
                    redirectToComic($(this).data('codigo'));
                });
                hideLoader();
            }
        });
    });
}

