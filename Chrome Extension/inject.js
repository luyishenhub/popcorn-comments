(function () {
    // alert("inserted");

    // change video style

    var videos = document.getElementsByClassName("html5-video-container");
    console.log("here!");
    console.log(videos);
    
    let frame = videos.item(0);
    console.log(frame.offsetWidth);

    var httpRes = [];
    var comments = [];
    var layers = [];
    var pos = [];
    
    var isPaused = false;

    var id;

    getComments();
 
    // http request to fetch all comments
    function getVideoID(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    function getComments() {
        var url = "https://us-central1-popcorn-comments.cloudfunctions.net/get-popcorn-comments";
        var params = getVideoID(document.URL);

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                // callback
                const obj = JSON.parse(xmlHttp.responseText);
                // console.log(obj.items);
                httpRes = obj.items.slice();
                comments = obj.items.slice();

                // fill comments
                for (var i = 0; i < 6; i++) {
                    padding = 40 + 30*i;
                    var popcorn = document.createElement("div");
                    popcorn.style.position = "absolute";
                    popcorn.style.paddingTop = padding.toString() + "px";
                    popcorn.style.color = "white";
                    popcorn.style.fontSize = "16px";
                    popcorn.style.overflow = "hidden";
                    popcorn.style.whiteSpace = "nowrap";
                    updateComment(popcorn);
            
                    frame.appendChild(popcorn);
                    layers.push(popcorn);
            
            
                    console.log(popcorn.textContent);
            
            
                    // scrolling comment
                    var init = 0 - popcorn.offsetWidth;
            
                    pos.push(init);
            
                }

                var id = setInterval(move, 10);

            }
                
        }
        if (params) {
            xmlHttp.open("GET", url+"?video-id="+params, true);
            xmlHttp.send(null);
        }
    }
    
 
    // observe YouTube video pause/play
    var pauseObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "aria-label") {
                console.log(mutation);
                isPaused = !isPaused;
            }
        });
    });
    
    pauseObserver.observe(document.getElementsByClassName("ytp-play-button").item(0), {
        attributes: true
    });


    function move() {
        if (layers.length == 0) {
            clearInterval(id);
            pauseObserver.disconnect();
        }
        if (!isPaused) {
            for (var i = 0; i < layers.length; i++) {
                if (pos[i] == frame.offsetWidth) {

                    updateComment(layers[i]);
                    pos[i] = 0 - layers[i].offsetWidth;

                    console.log(layers[i].textContent);
                    
                } else {
                    pos[i]++;
                    layers[i].style.right = pos[i] + 'px';
                        
                }
    
            }

        }
    }
    
    function updateComment(elem) {
        if (comments.length == 0) {
            comments = httpRes.slice();
            console.log("updated");
            console.log(httpRes.length);
        }
        elem.textContent = comments.shift();
        elem.style.right = (-elem.offsetWidth).toString() + "px";
    }

   
})();
