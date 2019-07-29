var carousel = document.querySelector('.carousel');
var flkty = new Flickity(carousel, {
  imagesLoaded: true,
  percentPosition: false,
  hash: true
});

var imgs = carousel.querySelectorAll('.carousel-cell');
// get transform property
var docStyle = document.documentElement.style;
var transformProp =
  typeof docStyle.transform === 'string' ? 'transform' : 'WebkitTransform';

  flkty.on( 'scroll', function() {
    flkty.slides.forEach( function( slide, i ) {
      var img = imgs[i];
      var x = ( slide.target + flkty.x ) ;
      img.style[ transformProp ] = 'translateX(' + 1/40*x  + 'px)';
    });
  });


var progressBar = document.querySelector('.progress-bar')

flkty.on( 'scroll', function( progress ) {
  progress = Math.max( 0, Math.min( 1, progress ) );
  progressBar.style.width = progress * 100 + '%';
});

var restart = document.querySelector('.restart');
restart.addEventListener('click', function(){
  flkty.select(0);
});

