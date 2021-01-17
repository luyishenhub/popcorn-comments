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


    httpGetAsync(commentHTTPURL, loadComments);
 
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
            popcorn.style.fontWeight = "bold";
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
    var end = 0;

    var intervalHTTPURL = "https://us-central1-popcorn-comments.cloudfunctions.net/get-most-watched-intervals";

    httpGetAsync(intervalHTTPURL, displayHighlight);

    var progressContainer = document.getElementsByClassName("ytp-progress-bar-container").item(0);
    var highlightContainer = document.createElement("div");
    highlightContainer.style.display = "flex";
    highlightContainer.style.position = "relative";
    highlightContainer.style.overflow = "hidden";
    highlightContainer.style.height = "5px";
    highlightContainer.style.width = frame.offsetWidth;
    highlightContainer.style.top = "-4px";
    
    progressContainer.appendChild(highlightContainer);

    function displayHighlight(responseText) {
        const obj = JSON.parse(responseText);

        intervals = obj.intervals;
        
        console.log(intervals.length);

        for (var i = 0; i < intervals.length; i++) {
            // TODO add separate divs?
            interval = intervals[i];
            console.log(interval);
    
            var transparent = createNewHighlight(interval[0] - end, "");
            var highlight = createNewHighlight(interval[1] - interval[0], "#rgba(235, 50, 35, 0.5)");
    
            highlightContainer.appendChild(transparent);
            highlightContainer.appendChild(highlight);
            end = interval[1];
        }
    
        var transparent = createNewHighlight(100 - end, "");
    
        highlightContainer.appendChild(transparent);

    }

    function createNewHighlight(grow, color) {
        var highlight = document.createElement("div");
        highlight.style.flexGrow = grow;
        highlight.style.height = "5px";
        highlight.style.backgroundColor = color;
        return highlight;
    }

    // feature 3: translate comments
    var targetLocale = window.navigator.language;
    console.log(targetLocale);

    // var commentList = document.getElementById('contents').children;

    // for (commentNode in commentList) {

    // }


})();
