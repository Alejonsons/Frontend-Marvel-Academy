$(document).ready(function(){
    var id = getParam();
    showLoader();

    getFavoriteComics()
    getComicHeroes(id);
});

function getFavoriteComics(){
    var user_id = localStorage.getItem('@marvel:id')
    
    $.ajax({
        dataType: "json",
        contentType:'application/json',
        method: 'GET',
        url: `http://localhost:8088/comics/${user_id}`,
        success: function(response){
            getComicInfo(getParam(), response)
        }
    });
}

function getComicInfo(id, favoritos){
    $.ajax({
        dataType: "json",
        url: `https://gateway.marvel.com:443/v1/public/comics/${id}?ts=${keys.ts}&apikey=${keys.public}&hash=${keys.hash}`,
        success: function(response){
            if(response.data.results[0].description != null){
                $('.comic-info').append('<div class="col-sm-11" style="display: flex;"><img style="width: 200px;" src="' + response.data.results[0].thumbnail.path + '.jpg" /><div class="m-2"><p style="font-size: 28px; color: white; text-align: center">' + response.data.results[0].title + '</p><p style="color: white; font-size: 18px; text-align: justify">' + response.data.results[0].description + '</p></div></div>')
                $('.comic-info').append('<div class="col-sm-1 d-flex justify-content-end" style="height: fit-content"><i data-codigo=' + response.data.results[0].id + ' class="far fa-star star-no-favorite" style="font-size: 28px; cursor: pointer;"></i><i data-codigo=' + response.data.results[0].id + ' class="fas fa-star star-favorite" style="font-size: 28px; cursor: pointer; display: none"></i></div>')
            }else{
                $('.comic-info').append('<div class="col-sm-11" style="display: flex;"><img style="width: 200px;" src="' + response.data.results[0].thumbnail.path + '.jpg" /><div class="m-2"><p style="font-size: 28px; color: white; text-align: center">' + response.data.results[0].title + '</p><p style="color: white; font-size: 18px; text-align: justify">Ops... Description not found!</p></div></div>')
                $('.comic-info').append('<div class="col-sm-1 d-flex justify-content-end" style="height: fit-content"><i data-codigo=' + response.data.results[0].id + ' class="far fa-star star-no-favorite" style="font-size: 28px; cursor: pointer;"></i><i data-codigo=' + response.data.results[0].id + ' class="fas fa-star star-favorite" style="font-size: 28px; cursor: pointer; display: none"></i></div>')
            }

            favoritos.forEach(function(fav){
                var isFavorite = false;
                if(fav.id_comic == id){
                    isFavorite = true;
                    $('.star-favorite').show();
                    $('.star-no-favorite').hide();
                }
                if(isFavorite){
                    $('.star-no-favorite').hide();
                }
            });

            $('.star-no-favorite').off().on('click', function(){
                var id_comic = getParam();
                var id_user = localStorage.getItem('@marvel:id');
                var title_comic = response.data.results[0].title;
    
                var params = {
                    id_user,
                    id_comic,
                    title_comic  
                }
    
                $.ajax({
                    dataType: "json",
                    contentType:'application/json',
                    data: JSON.stringify(params),
                    method: 'POST',
                    url: `http://localhost:8088/comics/save`,
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
                    url: `http://localhost:8088/comics/${user_id}`,
                    success: function(response){
                        response.forEach(function(fav){
                            if(fav.id_comic == id){
                                cod = fav.id
                            }
                            $.ajax({
                                dataType: "json",
                                contentType:'application/json',
                                method: 'DELETE',
                                url: `http://localhost:8088/comics/${cod}`
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

function getComicHeroes(id){
    $.ajax({
        dataType: "json",
        url: `https://gateway.marvel.com:443/v1/public/comics/${id}/characters?ts=${keys.ts}&apikey=${keys.public}&hash=${keys.hash}`,
        success: function(response){
            var count = 0;
            console.log(response.data.results)
            if(response.data.results.length < 2){
                $('.comic-heroes').append('<div data-codigo=' + response.data.results[0].id + ' class="comicHero-wrapper"><img class="comicHero" src="' + response.data.results[0].thumbnail.path + '.jpg"/><div class="name-wrapper"><p class="m-0" style="color: white">' + response.data.results[0].name + '</p></div></div>') 
            }else{
                response.data.results.forEach(function(comicHero){
                    count++;
                    var aux = comicHero.thumbnail.path.split('/');
                    if(aux[aux.length - 1] != 'image_not_available'){
                        $('.comic-heroes').append('<div data-codigo=' + comicHero.id + ' class="comicHero-wrapper"><img class="comicHero" src="' + comicHero.thumbnail.path + '.jpg"/><div class="name-wrapper"><p class="m-0" style="color: white">' + comicHero.name + '</p></div></div>') 
                    }else{
                        $('.comic-heroes').append('<div data-codigo=' + comicHero.id + ' class="comicHero-wrapper"><img class="comicHero" src="../../assets/img/image_not_available.jpg"/><div class="name-wrapper"><p class="m-0" style="color: white">' + comicHero.name + '</p></div></div>')
                    }
                });
            }
            if(count >= response.data.results.length){
                hideLoader();
            }

            $('.comicHero-wrapper').on('click', function(){
                redirectToHero($(this).data('codigo'));
            });

            if(response.data.results.length > 7){
                $('.comic-heroes').slick({ 
                    infinite: true,
                    variableWidth: true
                });
                 $('.slick-active').hide();
            }
            hideLoader();
        }
    });
}
