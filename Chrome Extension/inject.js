(function () {
    function httpGetAsync(url, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                console.log("success");
                callback(xmlHttp.responseText);
            }
        }
        if (params) {
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        }
    }

    // change video style
    // feature 1: popcorn comments 
    var frame = document.getElementsByClassName("html5-video-container").item(0);
    // console.log("here!");
    // console.log(frame.offsetWidth);

    var httpRes = [];
    var comments = [];
    var layers = [];
    var pos = [];
    
    var isPaused = false;

    var id;


    var params = getVideoID(document.URL);
    var commentHTTPURL = "https://us-central1-popcorn-comments.cloudfunctions.net/get-popcorn-comments?video-id=" + params;


    // httpGetAsync(commentHTTPURL, loadComments);
 
    // http request to fetch all comments
    function getVideoID(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    function loadComments(responseText) {
        const obj = JSON.parse(responseText);
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

            // scrolling comment
            var init = 0 - popcorn.offsetWidth;
    
            pos.push(init);
    
        }

        var id = setInterval(move, 10);

    }
    
 
    // observe YouTube video pause/play
    var pauseObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "aria-label") {
                // console.log(mutation);
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

                    // console.log(layers[i].textContent);
                    
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
            // console.log("updated");
        }
        elem.textContent = comments.shift();
        elem.style.right = (-elem.offsetWidth).toString() + "px";
    }


    // feature 2: highlight snippet
    // TODO: http response
    var intervals = [[15, 20], [37, 40], [80, 95]];

    var progressContainer = document.getElementsByClassName("ytp-progress-bar-container").item(0);
    var highlightContainer = document.createElement("div");
    highlightContainer.style.display = "block";
    highlightContainer.style.position = "relative";
    highlightContainer.style.overflow = "hidden";
    highlightContainer.style.backgroundColor = "#EB3223"; // bgd color
    highlightContainer.style.height = "3px";
    highlightContainer.style.width = frame.offsetWidth;
    highlightContainer.style.top = "-2px";
    
    progressContainer.appendChild(highlightContainer);

    for (interval in intervals) {
        // TODO add separate divs?

        // var highlight = document.createElement("div");
    }

})();
