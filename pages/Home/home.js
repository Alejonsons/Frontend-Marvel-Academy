$(document).ready(function(){
    
    $('#heroes-slick').slick({ 
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        autoplay: true,
        autoplaySpeed: 2000
    });
     $('.slick-active').hide();
     $('.slick-link').off().on('click', function(){
        var id = $(this).data('id');
        redirectToHero(id);
    });
});



