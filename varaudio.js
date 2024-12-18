
var varaudio = document.getElementById("varaudio")


var button = document.getElementById("musiq-button");


var isPlaying = false;
var varmel = 0;


function playMusiq() {
    if (varmel == 0) {
        varmel = 1;
        varaudio.pause();
    } else {
        varmel = 0;
        varaudio.play();
    }
}
 