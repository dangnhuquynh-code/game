// -----POP-UP-----
// JavaScript để điều khiển việc hiển thị và ẩn pop-up
function requestPopup(type) {
    parent.postMessage({
        action: 'openPopup',
        type: type,
        popupCSS: 'popup-trungthu.css'
    }, '*');
}
// -----POP-UP-----
// -----UNICORN EYES-----
// Function to control unicorn eye blinking
function controlUnicornEyes() {
    const openedEyes = document.querySelector(".img_eyes_unicorn.opened");
    const closedEyes = document.querySelector(".img_eyes_unicorn.closed");

    function performBlink() {
        openedEyes.style.opacity = "0";
        closedEyes.style.opacity = "1";

        setTimeout(() => {
            openedEyes.style.opacity = "1";
            closedEyes.style.opacity = "0";
        }, 400);
    }

    function performDoubleBlink() {
        performBlink();
        setTimeout(() => {
            performBlink();
        }, 800);
    }

    const isDoubleBlink = Math.random() < 0.3; // 30% chance of double blink
    /*        console.log("isDoubleBlink: ", isDoubleBlink);*/

    if (isDoubleBlink) {
        performDoubleBlink();
    } else {
        performBlink();
    }

    // Schedule next blink with random delay (5-15 seconds)
    const nextBlinkDelay = Math.random() * 10000 + 5000;
    /*        console.log("nextBlinkDelay: ", nextBlinkDelay);*/

    setTimeout(controlUnicornEyes, nextBlinkDelay);
}

// Start the eye blinking when the page loads

// -----UNICORN EYES-----