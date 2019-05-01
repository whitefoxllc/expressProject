$(document).ready(function () {
    let episodeSelected = $("#persistentVariables").attr("episodeSelected");

    if (episodeSelected) {
        var myPlayer = videojs("my-video");
        myPlayer.load();
        myPlayer.play();

        $(".epbox").click(function () {
            myPlayer.pause();
            myPlayer.src("/" + $(this).attr("url"));
            myPlayer.load();
            myPlayer.play();
        });
    } else {
        $(".epbox").click(function () {
            window.location.href = $(this).attr("pageUrl");
        });
    }
});

