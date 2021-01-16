(function () {
    // alert("inserted");

    // change video style

    var videos = document.getElementsByClassName("html5-video-container");
    console.log("here!");
    console.log(videos);
    
    let frame = videos.item(0);
    console.log(frame.offsetWidth);

    // TODO: list of popcorn comments
    var comments = ["comment1", "long comment2", "very long comment3", "very very very long comment4", "comment5", "comment6", "very very long comment7", "long comment8", "comment9", "long comment10"];

    
    
    // layers of popcorn comments
    var layers = [];
    var pos = [];
    
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

    function move() {

        // TODO: stop/scroll scrolling upon pause/play
        for (var i = 0; i < layers.length; i++) {
            if (pos[i] == frame.offsetWidth) {
    
                // if (pos[index] == 200) {
                clearInterval(id);
                updateComment(layers[i]);
                pos[i] = 0 - layers[i].offsetWidth;


                console.log(layers[i].textContent);

                id = setInterval(move, 10);
        
        
            } else {
                pos[i]++;
                layers[i].style.right = pos[i] + 'px';
                    
            }

        }
    }
    
    function updateComment(elem) {
        elem.textContent = comments.shift();
        elem.style.right = (-elem.offsetWidth).toString() + "px";
    }



})();
