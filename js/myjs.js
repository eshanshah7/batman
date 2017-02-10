document.addEventListener("DOMContentLoaded", loadImages);
var imageIndex = 1;
var numOfImages = 28;
var allData;

function dataLoad() {
    //console.log(url);
    // Create new promise with the Promise() constructor;
    // This has as its argument a function
    // with two parameters, resolve and reject
    return new Promise(function (resolve, reject) {
        // Standard XHR to load an image
        var request = new XMLHttpRequest();
        request.open('GET', 'data.json');
        request.responseType = 'text';
        // When the request loads, check whether it was successful
        request.onload = function () {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                resolve(request.response);
            }
            else {
                // If it fails, reject the promise with a error message
                reject(Error('Data didn\'t load successfully; error code:' + request.statusText));
            }
        };
        request.onerror = function () {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(Error('There was a network error.'));
        };
        // Send the request
        request.send();
    });
}

function imgLoad(url) {
    //console.log(url);
    // Create new promise with the Promise() constructor;
    // This has as its argument a function
    // with two parameters, resolve and reject
    return new Promise(function (resolve, reject) {
        // Standard XHR to load an image
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'blob';
        // When the request loads, check whether it was successful
        request.onload = function () {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                resolve(request.response);
            }
            else {
                // If it fails, reject the promise with a error message
                reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
            }
        };
        request.onerror = function () {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(Error('There was a network error.'));
        };
        // Send the request
        request.send();
    });
}

function loadImages() {
    dataLoad().then(function (response) {
        allData = JSON.parse(response);
        setTimeout(function(){
            for(let i = 0;i<allData.logodata.length;i++){
            
            //Add dots
            var dots = document.createElement('span');
            dots.setAttribute('class', 'dot tooltip');
            //set first element active
            if(i == 0){dots.setAttribute('class', 'dot tooltip active');}
            dots.dataset.tooltip = allData.logodata[i].year;
            dots.setAttribute('onclick', 'currentImage(' + (i + 1) + ')');;
            document.getElementById('dots').appendChild(dots);
            }
            document.getElementById('arrows').setAttribute('class','arrowsshow');
        },2000);
        
        
    });
    imgLoad('svgs/gothamSkyline.svg').then(function (response) {
        gotham.src = window.URL.createObjectURL(response);
        TweenLite.fromTo(gotham, 1, {
            bottom: -20
            , opacity: 0
        }, {
            bottom: 0
            , opacity: 1
            , ease: Circ.easeOut
        });
    });
    
    tlGlitch.to('.glitch', 0.2, {
        skewX: 10
        , ease: Power4.easeInOut
    }).to('.glitch', 0.04, {
        skewX: 0
        , ease: Power4.easeInOut
    }).to('.glitch', 0.04, {
        opacity: 0
    }).to('.glitch', 0.04, {
        opacity: 1
    }).to('.glitch', 0.04, {
        x: -20
    }).to('.glitch', 0.04, {
        x: 0
    }).add("split", 0).to('.top', 0.5, {
        x: -2
        , ease: Power4.easeInOut
    }, 'split').to('.bottom', 0.5, {
        x: 2
        , ease: Power4.easeInOut
    }, 'split').to('.top', 0.2, {
        x: 0
        , ease: Power4.easeInOut
    }).to('.bottom', 0.2, {
        x: 0
        , ease: Power4.easeInOut
    }).to('.glitch', 0.02, {
        scaleY: 1.1
        , ease: Power4.easeInOut
    }).to('.glitch', 0.04, {
        scaleY: 1
        , ease: Power4.easeInOut
    });
    imgLoad('svgs/spotlight.svg').then(function (response) {
        spotlight.src = window.URL.createObjectURL(response);
        TweenLite.fromTo(spotlight, 0.2, {
            rotation: 30
            , height: 0
        }, {
            rotation: 30
            , height: 500
            ,delay:2
        });
        TweenMax.fromTo(spotlight, 4, {
            opacity: 0.5
            , ease: RoughEase.ease
        }, {
            opacity: 1
            , ease: RoughEase.ease.config({
                template: Power0.easeNone
                , strength: 1
                , points: 20
                , taper: "none"
                , randomize: true
                , clamp: true
            })
            , repeat: -1
            ,delay:2
        });
        setTimeout(function(){
            animate(0);    
        },2000);
        
    }).then(function(){
        document.addEventListener("mousewheel",function(event){
            if(event.deltaY > 0){
                plusImage(1);
            }
            if(event.deltaY < 0){
                plusImage(-1);
            }
        });
        document.addEventListener("mousemove",function(event){
            //console.log(event);
            mouse.x = event.pageX;
            mouse.y = event.pageY;

            cancelAnimationFrame(request);
            request = requestAnimationFrame(update);

        });

    });
}

function update(){
    let dx = mouse.x - cx;
    let dy = mouse.y - cy;

    tiltx = -(dy / cy);
    tilty = (dx / cx);
    //console.log(tiltx+' '+tilty);
    radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2));
    degree = (radius * 10);
    TweenLite.to(infoContainer[0], 0.5, {
      transform: 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)',
      ease: Power2.easeOut
    });
}

window.onresize = function(){
    cx = window.innerWidth / 2;
    cy = window.innerHeight / 2;
}
var gotham = document.getElementById('gotham-skyline');
var batman = document.getElementById('batman');
var batman2 = document.getElementById('batman2');
var spotlight = document.getElementById('spotlight');
var logotitle = document.getElementById('logoTitle');
var description = document.getElementById('desc');
var year = document.getElementById('year');
var infoContainer = document.getElementsByClassName('info-container');
var request = null;
var mouse = {
               x: 0,
               y: 0
            };
var cx = window.innerWidth / 2;
var cy = window.innerHeight / 2;

 var tlGlitch = new TimelineMax({
        repeat: -1
        , repeatDelay: 5,
     
});
//console.log(bat);
//batman.src = "svgs/bat1.svg";
function animate(n) {
    //var imageURL = "svgs/bat"+(n+1)+".svg";
    var imageURL = "svgs/" + allData.logodata[n].imgsrc;
    year.innerHTML = allData.logodata[n].year;
    logotitle.innerHTML = allData.logodata[n].title.toUpperCase();
    description.innerHTML = allData.logodata[n].desc.toUpperCase();
    imgLoad(imageURL).then(function (response) {
        //console.log(response);
        batman.src = window.URL.createObjectURL(response);
        batman2.src = window.URL.createObjectURL(response);
    });
    var tl = new TimelineLite();
    tl.add(TweenLite.fromTo(batman, 0.1, {
        rotation: 0
        , width: 190
        , height: 0
        , opacity: 0
        , bottom: 50
        , left: 0
    }, {
        rotation: 0
        , width: 190
        , height: "50%"
        , opacity: 1
        , bottom: 50
        , left: 0
    }),0).add(TweenLite.fromTo(batman2, 0.1, {
        rotation: 0
        , width: 190
        , height: 0
        , opacity: 0
        , bottom: 50
        , left: 0
    }, {
        rotation: 0
        , width: 190
        , height: "50%"
        , opacity: 1
        , bottom: 50
        , left: 0
    }),0).add(TweenLite.fromTo(infoContainer[0], 0.1, {
        opacity: 0
        , right: 0
    }, {
        opacity: 1
        , right: 120
    }));
    tlGlitch.resume();
   
    
}

function plusImage(n) {
    showImage(imageIndex += n);
}

function currentImage(n) {
    showImage(imageIndex = n);
}

function showImage(n) {
    var dots = document.getElementsByClassName('dot');
    var i;
    if (n > numOfImages) {
        imageIndex = 1;
    }
    if (n < 1) {
        imageIndex = numOfImages;
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[imageIndex - 1].className += " active";
    //console.log(imageIndex);
    var tl2 = new TimelineLite();
    tl2.add(TweenLite.to(batman, 0.1, {
        rotation: 0
        , width: 190
        , height: 0
        , opacity: 0
        , bottom: 50
        , left: 0
    })).add(TweenLite.to(batman2, 0.1, {
        rotation: 0
        , width: 190
        , height: 0
        , opacity: 0
        , bottom: 50
        , left: 0
    }),0).add(TweenLite.to(infoContainer[0], 0.1, {
        opacity: 0
        , right: 0
    }), 0);
    tlGlitch.pause();
    setTimeout(function () {
        animate(imageIndex - 1);
    }, 100);
}