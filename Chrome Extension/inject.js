(function () {
    alert("inserted");

    // change video style

    var videos = document.getElementsByClassName("html5-video-container");
    console.log("here!");
    console.log(videos);
    
    let frame = videos.item(0);
    console.log(frame.offsetWidth);
    
    // just place a div at top right
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = 0;
    div.style.right = 0;
    div.style.color = "white";
    div.textContent = "Injected!";

    frame.appendChild(div);

    // scrolling comment
    var pos = 0 - div.offsetWidth;
    var id = setInterval(move, 10);

    function move() {
        if (pos == frame.offsetWidth) {
            frame.removeChild(div);
            clearInterval(id);
        } else {
            pos++;
            div.style.right = pos + 'px';
        }
    }
})();
