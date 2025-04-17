$(function () {
    var intMoves = 5; // number of moves
    var speed = 0.2; // initial speed of moves - increase each move
    var maxSpeed = 0.3; // maximum speed of moves
    var objMovePattern = []; // object contains a pattern for the cup shifting
    var guess = $("#guess");
    var widthGuess = guess.width() / 2 - 40;
    var firstCup;
    var targetDisplayPosition = 2;
    let displayCupNumber;
    var remainingPlays = 2;
    var time = 5000;
    const btnRestart = document.querySelector("#btnRestart");
    function restartGame() {
        const cups = document.querySelectorAll(
            ".cup_2 img, .cup_3 img, .cup_4 img"
        );
        const guess = document.querySelector(".guess");
        guess.style.left = "30%";
        guess.style.transform = "none";
        guess.style.display = "block";
        cups.forEach((cup, index) => {
            cup.style.transform = "none";
        });
        objMovePattern = generateMovePatterns();
        startGame({ currentTarget: document.querySelector("#btnStart") });
    }
    btnRestart.addEventListener("click", () => {
        $("#btnRestart").css("visibility", "hidden");
        restartGame();
    });
   /* document.querySelector(".count span").innerText = remainingPlays;*/
    (function init() {
        objMovePattern = generateMovePatterns();
        $("#btnStart").on("click", startGame);
    })();
    function startGame(event) {
        if (remainingPlays <= 0) {
            showOutOfPlaysPopup();
            return;
        }
        $(event.currentTarget).hide();
        firstCup = Math.round(Math.random() * 2 + 1);
        var cup = $(".cup-" + firstCup);
        let finalCup = findFinalCupPosition(firstCup, objMovePattern);
        let lastPattern = objMovePattern[objMovePattern.length - 1];
        let currentGuessIndex = lastPattern.indexOf(finalCup);
        if (currentGuessIndex !== targetDisplayPosition - 1) {
            [lastPattern[targetDisplayPosition - 1], lastPattern[currentGuessIndex]] =
                [
                    lastPattern[currentGuessIndex],
                    lastPattern[targetDisplayPosition - 1],
                ];
        }
        displayCupNumber = lastPattern[targetDisplayPosition - 1];
        let cupImg = cup.find("img").filter(function () {
            return $(this).attr("class")?.includes("img_cup_");
        });
        TweenMax.to(cupImg, 0.5, {
            y: -240,
            ease: Sine.easeIn,
            delay: 0.1,
        });

        TweenMax.to(guess, 0.4, {
            left: cup.position().left + widthGuess + 65,
            y: -10,

            onComplete: function () {
                guess.hide();
                guess.css("z-index", "10");
                $(".cup").css("z-index", "10");
                TweenMax.to(cupImg, 0.5, { y: 0, onComplete: shakeCups });
            },
        });
        remainingPlays--;
        document.querySelector(".count span").innerText = remainingPlays;
    }
    function shakeCups() {
        // guess.css("display", "none");
        var aPos = [
            $(".cup-" + objMovePattern[0][0]).position().left,
            $(".cup-" + objMovePattern[0][1]).position().left,
            $(".cup-" + objMovePattern[0][2]).position().left,
        ];
        for (var i = 0; i < objMovePattern.length; i++) {
            speed = speed > maxSpeed ? speed / 1.1 : maxSpeed;
            TweenMax.to($(".cup-" + objMovePattern[i][0]), speed, {
                left: aPos[0],
                delay: speed * i,
                ease: Sine.easeOut,
            });
            TweenMax.to($(".cup-" + objMovePattern[i][1]), speed, {
                left: aPos[1],
                delay: speed * i,
                ease: Sine.easeOut,
            });
            if (i == objMovePattern.length - 1) {
                TweenMax.to($(".cup-" + objMovePattern[i][2]), speed, {
                    left: aPos[2],
                    delay: speed * i,
                    ease: Sine.easeOut,
                    onComplete: unableCupClick,
                });
            } else {
                TweenMax.to($(".cup-" + objMovePattern[i][2]), speed, {
                    left: aPos[2],
                    delay: speed * i,
                    ease: Sine.easeOut,
                });
            }
        }
    }
    function unableCupClick() {
        $(".cup").css("cursor", "pointer");
        $(".cup").on("click", clickCup);
        waitToChooseTimer = setTimeout(() => {
            Swal.fire({
                icon: "warning",
                title: "⏰ Nhắc nhở",
                text: "Bạn chưa chọn lồng đèn nào. Hãy chọn một cái nhé!",
                confirmButtonText: "OK",
                confirmButtonColor: "#f8a30e",
            });
        }, time);
    }
    function clickCup(event) {
        clearTimeout(waitToChooseTimer);
        var currentCup = $(event.currentTarget);
        $(".cup").off("click").css("cursor", "default");
        currentCup.off("click");
        currentCup.css("cursor", "default");

        var iCup = parseInt(currentCup.attr("id").split("cup")[1]);

        let cupImg = currentCup.find("img").filter(function () {
            return $(this).attr("class")?.includes("img_cup_");
        });
        TweenMax.to(cupImg, 0.5, {
            y: -120,
            ease: Sine.easeIn,
            delay: 0.1, // Chờ một chút trước khi nâng
        });

        if (iCup === displayCupNumber) {
            guess.css({
                left: currentCup.position().left + widthGuess + 65,
                display: "block",
                opacity: 0,
            });

            TweenMax.to(guess, 0.5, {
                opacity: 1,
                ease: Sine.easeOut,
            });
            // ✅ GỌI THÔNG BÁO TRÚNG THƯỞNG SAU 3s
            setTimeout(() => {
                alertPrize();
                $("#btnRestart").css("visibility", "visible");
            }, 2000);
        } else {
            // Sử dụng jQuery để thay đổi visibility của phần tử có id "btnStart"
            setTimeout(() => {
                $("#btnRestart").css("visibility", "visible");
            }, 3000);

            setTimeout(() => {
                // Tìm lồng đèn đúng
                let correctCup = $("#cup" + displayCupNumber);
                let correctLanternImg = correctCup.find("img").filter(function () {
                    return $(this).attr("class")?.includes("img_cup_");
                });

                // Hiển thị bóng dưới lồng đèn đúng
                guess.css({
                    left: correctCup.position().left + widthGuess + 65,
                    display: "block",
                    opacity: 0,
                });
                TweenMax.to(guess, 0.5, {
                    opacity: 1,
                    ease: Sine.easeOut,
                    delay: 0.6, // Hiển thị bóng sau khi lồng đèn đúng nâng lên một chút
                });

                // Nâng lồng đèn đúng lên
                TweenMax.to(correctLanternImg, 0.5, {
                    y: -120,
                    ease: Sine.easeIn,
                    delay: 0.1, // Nâng lồng đèn đúng lên cùng lúc với lồng đèn sai (hoặc gần như vậy)
                });
            }, 2000); // Đợi 2 giây sau khi click sai
        }

        // let cupImg = currentCup.find("img").filter(function () {
        //   return $(this).attr("class")?.includes("img_cup_");
        // });

        // TweenMax.to(cupImg, 0.5, {
        //   y: -130,
        //   ease: Sine.easeIn,
        //   delay: 0.1,
        // });
    }
    function generateMovePatterns() {
        var objMoves = [[1, 2, 3]]; // initial state, cups order
        var aMoves = [1, 2, 3];

        for (var i = 0; i < intMoves; i++) {
            var initialPattern = [1, 2, 3];
            var objShuffledPattern = shuffle(initialPattern);
            while (objShuffledPattern[0] == objMoves[i][0]) {
                objShuffledPattern = shuffle(initialPattern);
            }
            objMoves.push(objShuffledPattern);
        }

        return objMoves;
    }
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    function findFinalCupPosition(cupNumber, pattern) {
        let index = pattern[0].indexOf(cupNumber);
        for (let i = 1; i < pattern.length; i++) {
            index = pattern[i].indexOf(pattern[i - 1][index]);
        }
        return pattern[pattern.length - 1][index];
    }
    function alertPrize() {
        Swal.fire({
            title: "🎉 Chúc mừng bạn, bạn đã đúng ",
            width: 600,
            padding: "3em",
            color: "#00000",
            imageUrl: "img/bg_pop.gif",
            imageWidth: 400,
            imageHeight: 400,
            imageAlt: "Custom image",
            background: "#fff",
            confirmButtonColor: "#f8a30e",
            backdrop: `
                  rgba(0,0,123,0.4)
                  url("img/nyan-cat.gif")
                  left top
                  no-repeat
                `,
        });
        /* setTimeout(() => {
                  $("#btnRestart").css("visibility", "visible");
                }, 2000);*/
    }
    function showOutOfPlaysPopup() {
        Swal.fire({
            icon: "warning",
            title: "Oops!",
            text: "Bạn đã hết lượt quay!",
            confirmButtonText: "OK",
            confirmButtonColor: "#f8a30e",
        });
    }
});

/*const music = document.getElementById("bg-music");
const playBtn = document.getElementById("play");

let isPlaying = false;*/

// Bắt sự kiện click để toggle phát/dừng nhạc
/*playBtn.addEventListener("click", function () {
    if (isPlaying) {
        music.pause();
        playBtn.src = "img/play.png"; // đổi icon
    } else {
        music.play();
        playBtn.src = "img/pause.png";
    }
    isPlaying = !isPlaying;
});*/

// Cố gắng phát nhạc tự động (có thể bị chặn)
/*window.addEventListener("load", () => {
    music.play().catch((error) => {
        // Trình duyệt có thể chặn autoplay => có thể hiện nút "Play" nếu muốn
        console.log("Tự động phát bị chặn. Người dùng cần tương tác.");
    });
});*/
