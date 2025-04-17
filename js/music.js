const music = document.getElementById("bg-music");
const playBtn = document.getElementById("play");
let isPlaying = false;

// Bắt sự kiện click để toggle phát/dừng nhạc
playBtn.addEventListener("click", function () {
    if (isPlaying) {
        music.pause();
        playBtn.src = "../img/play.png"; // đổi icon
    } else {
        music.play();
        playBtn.src = "../img/pause.png";
    }
    isPlaying = !isPlaying;
});