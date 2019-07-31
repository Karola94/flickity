var templateSlide = document.getElementById('template-slide').innerHTML;
var carousel = document.querySelector('.carousel');
var templateCarousel = carousel.innerHTML;

Mustache.parse(templateSlide);

var slides = '';

for(var i=0; i<slideData.length; i++){
  console.log(slideData);
  slides += Mustache.render(templateSlide, slideData[i]);
}

caro.insertAdjacentHTML('beforeend', slides);

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








//Google maps

var infos = document.getElementById('infos');

window.initMap = function() {
    // The location of Uluru
    var uluru = {lat: -25.344, lng: 131.036};    
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 7, center: slideData[0].coords});
    
    
    for(var j=0; j<slideData.length; j++){
      var marker = new google.maps.Marker({
        position: slideData[j].coords,
        map: map
      });

      marker.addListener('click', function(){       
        infos.innerHTML = 'You clicked marker';
      });
    }  	

    document.getElementById('center-map').addEventListener('click', function(event){
        event.preventDefault();        
        map.panTo(uluru);        
        map.setZoom(10);
    });

    document.getElementById('center-smooth').addEventListener('click', function(event){
        event.preventDefault();
        smoothPanAndZoom(map, 7, uluru);
    });
}

var smoothPanAndZoom = function(map, zoom, coords){
    // Trochę obliczeń, aby wyliczyć odpowiedni zoom do którego ma oddalić się mapa na początku animacji.
    var jumpZoom = zoom - Math.abs(map.getZoom() - zoom);
    jumpZoom = Math.min(jumpZoom, zoom -1);
    jumpZoom = Math.max(jumpZoom, 3);

    // Zaczynamy od oddalenia mapy do wyliczonego powiększenia. 
    smoothZoom(map, jumpZoom, function(){
        // Następnie przesuwamy mapę do żądanych współrzędnych.
        smoothPan(map, coords, function(){
            // Na końcu powiększamy mapę do żądanego powiększenia. 
            smoothZoom(map, zoom); 
        });
    });
};

var smoothZoom = function(map, zoom, callback) {
    var startingZoom = map.getZoom();
    var steps = Math.abs(startingZoom - zoom);
    
    // Jeśli steps == 0, czyli startingZoom == zoom
    if(!steps) {
        // Jeśli podano trzeci argument
        if(callback) {
            // Wywołaj funkcję podaną jako trzeci argument.
            callback();
        }
        // Zakończ działanie funkcji
        return;
    }

    // Trochę matematyki, dzięki której otrzymamy -1 lub 1, w zależności od tego czy startingZoom jest mniejszy od zoom
    var stepChange = - (startingZoom - zoom) / steps;

    var i = 0;
    // Wywołujemy setInterval, który będzie wykonywał funkcję co X milisekund (X podany jako drugi argument, w naszym przypadku 80)
    var timer = window.setInterval(function(){
        // Jeśli wykonano odpowiednią liczbę kroków
        if(++i >= steps) {
            // Wyczyść timer, czyli przestań wykonywać funkcję podaną w powyższm setInterval
            window.clearInterval(timer);
            // Jeśli podano trzeci argument
            if(callback) {
                // Wykonaj funkcję podaną jako trzeci argument
                callback();
            }
        }
        // Skorzystaj z metody setZoom obiektu map, aby zmienić powiększenie na zaokrąglony wynik poniższego obliczenia
        map.setZoom(Math.round(startingZoom + stepChange * i));
    }, 80);
};

// Poniższa funkcja działa bardzo podobnie do smoothZoom. Spróbuj samodzielnie ją przeanalizować. 
var smoothPan = function(map, coords, callback) {
    var mapCenter = map.getCenter();
    coords = new google.maps.LatLng(coords);

    var steps = 12;
    var panStep = {lat: (coords.lat() - mapCenter.lat()) / steps, lng: (coords.lng() - mapCenter.lng()) / steps};

    var i = 0;
    var timer = window.setInterval(function(){
        if(++i >= steps) {
            window.clearInterval(timer);
            if(callback) callback();
        }
        map.panTo({lat: mapCenter.lat() + panStep.lat * i, lng: mapCenter.lng() + panStep.lng * i});
    }, 1000/30);
}; 



