$(document).ready(function () {
    var myPlayer = videojs("my-video");
    console.log(myPlayer);
    // var videoMP4 = document.getElementById("videoMP4")

    $(".episode-button").click(function () {

        myPlayer.pause();
        myPlayer.src($(this).attr("url"));
        myPlayer.load();
        myPlayer.play();
    })

});

