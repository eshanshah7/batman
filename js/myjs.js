document.addEventListener("DOMContentLoaded", loadImages);
var imageIndex = 1;
var numOfImages = 6;

function imgLoad(url) {
    console.log(url);
    // Create new promise with the Promise() constructor;
    // This has as its argument a function
    // with two parameters, resolve and reject
    return new Promise(function(resolve, reject) {
      // Standard XHR to load an image
      var request = new XMLHttpRequest();
      request.open('GET', url);
      request.responseType = 'blob';
      // When the request loads, check whether it was successful
      request.onload = function() {
        if (request.status === 200) {
        // If successful, resolve the promise by passing back the request response
          resolve(request.response);
        } else {
        // If it fails, reject the promise with a error message
          reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
        }
      };
      request.onerror = function() {
      // Also deal with the case when the entire request fails to begin with
      // This is probably a network error, so reject the promise with an appropriate message
          reject(Error('There was a network error.'));
      };
      // Send the request
      request.send();
    });
}

function loadImages() {
    imgLoad('gothamSkyline.svg').then(function(response){
        gotham.src = window.URL.createObjectURL(response);
        TweenLite.fromTo(gotham,1,{bottom:-20,opacity:0},{bottom:0,opacity:1,ease:Circ.easeOut});
    });
    imgLoad('spotlight2.svg').then(function(response){
        spotlight.src = window.URL.createObjectURL(response);
        TweenLite.fromTo(spotlight,1,{rotation:30,height:0},{rotation:30,height:500});
        TweenMax.fromTo(spotlight,4,{opacity:0.5,ease:RoughEase.ease},{opacity:1,ease: RoughEase.ease.config({ template:  Power0.easeNone, strength: 1, points: 20, taper: "none", randomize: true, clamp: true}),repeat:-1});
        
    })
    animate(0);
}
var gotham = document.getElementById('gotham-skyline');
var batman = document.getElementById('batman');
var spotlight = document.getElementById('spotlight');
//console.log(bat);
//batman.src = "svgs/bat1.svg";

function animate(n) {
    var imageURL = "svgs/bat"+(n+1)+".svg";
    imgLoad(imageURL).then(function(response){
        console.log(response);
        batman.src = window.URL.createObjectURL(response);
    });
    
    TweenLite.fromTo(batman, 1, {
        rotation: 0, 
        width: 0,
        height: 0,
        opacity: 0,
        bottom: -250,
        left:-80
    }, {
        rotation: 720, 
        width: 190,
        height: "50%",
        opacity: 1,
        bottom: 50,
        left:0
    });
    
}

function plusImage(n) {
    showImage(imageIndex += n);
}

function currentImage(n) {
    showImage(imageIndex = n);
}

function showImage(n){
    if (n > numOfImages) {
        imageIndex = 1;
    }
    
    if (n < 1) {
        imageIndex = numOfImages;
    }
    console.log(imageIndex);
    TweenLite.to(batman,1,{rotation: 0, 
        width: 0,
        height: 0,
        opacity: 0,
        bottom: -250,
        left:-80});
    setTimeout(function(){
        animate(imageIndex-1);
    },1000);
    
}

