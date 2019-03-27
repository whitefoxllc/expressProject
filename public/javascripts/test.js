$(document).ready(function () {
    var myPlayer = videojs("my-video");
    // var videoMP4 = document.getElementById("videoMP4")

    $("button.episode-button").click(function () {
        myPlayer.pause();
        myPlayer.src($(this).attr("url"));
        myPlayer.load();
        myPlayer.play();
    })
});

