const currentTheme = "halloween";

// Function to check if an image exists
function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Function to handle theme-based audio playback
function handleThemeAudio(theme) {
  const audioElement = document.getElementById("bg-music");
  const playBtn = document.getElementById("play"); // Lấy nút play/pause
  let isPlaying = !audioElement.paused; // Kiểm tra trạng thái hiện tại

  if (!audioElement) {
    return;
  }

  let audioSrc = "";

  if (theme === "christmas") {
    audioSrc = "audio/music_christmas.mp3";
  } else if (theme === "halloween") {
    audioSrc = "audio/music_halloween.mp3";
  } else {
    audioElement.pause();
    if (playBtn) playBtn.src = "img/play.png";
    return;
  }

  // Chỉ thay đổi và tải lại nếu nguồn khác nguồn hiện tại
  if (audioElement.currentSrc !== audioSrc && audioSrc) {
    audioElement.src = audioSrc;
    audioElement.load(); // Yêu cầu trình duyệt tải nguồn mới

    // Cố gắng phát lại nếu nhạc đang phát trước đó
    if (isPlaying) {
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            if (playBtn) playBtn.src = "img/pause.png";
            isPlaying = true;
          })
          .catch((error) => {
            if (playBtn) playBtn.src = "img/play.png";
            isPlaying = false;
          });
      }
    } else {
      if (playBtn) playBtn.src = "img/play.png";
    }
  } else if (!audioSrc) {
    audioElement.pause();
    if (playBtn) playBtn.src = "img/play.png";
  }
}

// Function to handle title elements
async function handleTitleElements() {
  const titleElements = document.querySelectorAll(".title");
  for (const title of titleElements) {
    const img = title.querySelector("img");
    if (img) {
      if (img.src && img.src !== window.location.href) {
        const exists = await checkImageExists(img.src);
        if (exists) {
          title.classList.add("image-loaded");
          title.classList.remove("image-failed");
        } else {
          title.classList.remove("image-loaded");
          title.classList.add("image-failed");
        }
      } else {
        title.classList.remove("image-loaded");
        title.classList.add("image-failed");
      }
    } else {
      title.classList.remove("image-loaded");
      title.classList.add("image-failed");
    }
  }
}

// Function to handle elements with images
async function handleElements() {
  const elements = document.querySelectorAll(
    "[class*='ghost'], [class*='spider'], [class*='deer'], [class*='item'], [class*='gift'], [class*='cup'], [class*='guess']"
  );

  for (const element of elements) {
    const imgs = element.querySelectorAll("img");
    let shouldHide = false;

    for (const img of imgs) {
      if (img.src && img.src !== window.location.href) {
        const exists = await checkImageExists(img.src);
        if (!exists) {
          shouldHide = true;
          break;
        }
      } else {
        shouldHide = true;
        break;
      }
    }

    if (shouldHide) {
      element.style.display = "none";
    } else {
      element.style.display = "";
    }
  }

  // Handle light elements specifically
  const lightElements = document.querySelectorAll(
    ".img_bottom_left_light_1, .img_bottom_left_light_2"
  );
  for (const light of lightElements) {
    if (light.src && light.src !== window.location.href) {
      const exists = await checkImageExists(light.src);
      if (!exists) {
        light.style.display = "none";
      } else {
        light.style.display = "";
      }
    } else {
      light.style.display = "none";
    }
  }
}

// Check immediately and then after a short delay
handleTitleElements();
handleElements();
setTimeout(() => {
  handleTitleElements();
  handleElements();
  handleThemeAudio(currentTheme);
}, 0);

// Also check when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  handleTitleElements();
  handleElements();
  handleThemeAudio(currentTheme);
});

// And check when page is fully loaded
window.addEventListener("load", () => {
  handleTitleElements();
  handleElements();
  handleThemeAudio(currentTheme);
});
