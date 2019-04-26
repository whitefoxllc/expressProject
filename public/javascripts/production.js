$(document).ready(function () {
    var myPlayer = videojs("my-video");
    console.log(myPlayer);

    let episodeSelected = $("#persistentVariables").attr("episodeSelected");
    // alert(episodeSelected);
    if (episodeSelected) {
        myPlayer.load();
        myPlayer.play();
    }

    $(".episode-button").click(function () {

        myPlayer.pause();
        myPlayer.src($(this).attr("url"));
        myPlayer.load();
        myPlayer.play();
    })

});

