
const rewards = window.rewards || [];
  let currentBtnImage = window.currentBtnImages || [];
  let currentBorderColor = window.currentBorderColor || [];
  let currentBorderImage = window.currentBorderImage || [];
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const finalIndex = 0;
  let remainingPlays = window.remainingSpins || 0;
  const wrapper = document.querySelector(".wheel-wrapper");
  const wheelAnimateEffect = "easeOut";
  const wheelTitleRotateAngle = 90;
  const wheelNavAngle = -90;
  let spinBtn = document.createElement("img");
let countSpan = document.querySelector(".count span");
if (countSpan) {
  countSpan.innerText = remainingPlays;
}
window.addEventListener("message", function (event) {
  // Bạn có thể kiểm tra origin nếu muốn bảo mật hơn
  if (event.data && event.data.type === "updateSpins") {
    const remainingSpins = event.data.remainingSpins;


    if (countSpan) {
      countSpan.innerText = remainingSpins;
    } else {
      console.warn("Không tìm thấy .count span trong iframe");
    }
  }
  const message = event.data;
  if (message.type === "updateUser") {
    loggedInUser = message.user;
    console.log("Cập nhật người dùng:", loggedInUser);
  }
});

  export function setCurrentBtnImage(image) {
    currentBtnImage = image;
  }
  export function getCurrentBtnImage() {
    return currentBtnImage;
  }
  export function setCurrentBorderColor(color) {
    currentBorderColor = color;

  }
  export function getCurrentBorderColor() {
    return currentBorderColor;
  }
  export function setCurrentBorderImage(image) {
    currentBorderImage = image;
  }
  export function getCurrentBorderImage() {
    return currentBorderImage;
  }
  function createColoredCircle(color, size = 500) {
    const img = document.createElement("img");

    // Tạo hình ảnh với viền theo màu
    img.width = size;
    img.height = size;
    img.src = generateCircleImageSrc(color, size); // Tạo hình ảnh từ màu sắc (hoặc viền)

    return img;
  }
  function generateCircleImageSrc(color, size) {
  // Tạo hình ảnh PNG từ một hình tròn có màu viền
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;

  // Vẽ hình tròn lên canvas và xuất ra dưới dạng base64
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  return canvas.toDataURL("image/png"); // Trả về dưới dạng Base64 hình ảnh PNG
}
  export function createResponsiveWheels() {
    const radius = getResponsiveRadius();
    const wheelTitleWidth = radius / 4.5;
    const wheelImageRadius = radius;
    const wheelTextRadius = radius * 2 - 50;
    const wheelTextTittleAttr = {
      fill: "#ffffff",
      font: `${radius /12}px Arial`,
    };

    const wheel = new wheelnav("wheelDiv");
    const wheel2 = new wheelnav("wheelDiv2");
    wheel.navAngle = wheelNavAngle;
    wheel.animateeffect = wheelAnimateEffect;
    wheel.animatetime = 0;
    wheel.colors = window.currentWheelColor;

    wheel.titleWidth = wheelTitleWidth;
    wheel.wheelRadius = wheelImageRadius;
    wheel.titleRotateAngle = wheelTitleRotateAngle;
    wheel.createWheel(rewards.map((r) => `imgsrc:${r.img}`));
    //tạo wheel chứa text
    wheel2.navAngle = wheelNavAngle;
    wheel2.animateeffect = wheelAnimateEffect;
    wheel2.animatetime = 0;
    wheel2.titleAttr = wheelTextTittleAttr;
    wheel2.slicePathFunction = slicePath().NullSlice;
    wheel2.titleRotateAngle = wheelTitleRotateAngle;
    wheel2.wheelRadius = wheelTextRadius;
    wheel2.titleSelectedAttr = wheelTextTittleAttr;
    wheel2.createWheel(rewards.map((r) => `${r.name}`));

    const oldBgs = wrapper.querySelectorAll(".bg-wheel, .spin, .bg-wheel-border, .icon-container");
    oldBgs.forEach(el => el.remove());
    if (currentBorderImage && String(currentBorderImage).trim() !== "") {
      const borderImg = document.createElement("img");
      borderImg.src = currentBorderImage;
      borderImg.className = "bg-wheel-border";
      wrapper.insertBefore(borderImg, wrapper.firstChild);
    } else if (currentBorderColor && String(currentBorderColor).trim() !== "") {
      const borderCircle = createColoredCircle(currentBorderColor, wrapper.offsetWidth);
      borderCircle.className = "bg-wheel-border";
      wrapper.insertBefore(borderCircle, wrapper.firstChild);
    }



    //tạo nút quay
    const oldSpinBtn = document.getElementById("spin");
    if (oldSpinBtn) {
      oldSpinBtn.remove();
    }


    spinBtn.src = currentBtnImage;
    spinBtn.className = "spin_button";
    spinBtn.id = "spin";
    wrapper.appendChild(spinBtn);

    initSpinFunctionalityOnly();
    addIconsToBorder();
  }
  function initSpinFunctionalityOnly() {
    const spinBtn = document.getElementById("spin");
    const overlay = document.getElementById('overlay');
    const form = document.getElementById('form');
    function openForm() {
      if (overlay && form) {
        overlay.style.display = 'block';
        form.style.display = 'block';
      } else {
        console.error('Overlay hoặc form không tồn tại');
      }
    }
    if (!spinBtn) return;
    spinBtn.addEventListener("click", function () {
      loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      console.log("Kiểm tra loggedInUser", loggedInUser);
      if (!loggedInUser) {
        openForm();
        return;
      }
/*      if (remainingSpins <= 0) {
        showOutOfPlaysPopup();
        return;
      }*/
      spinBtn.disabled = true;
      spinBtn.style.pointerEvents = "none";
/*      remainingSpins--;*/
     /* window.addEventListener("message", function (event) {
        if (event.data && event.data.type === "updateCount") {
          const remainingSpins = event.data.remainingSpins;
          if (countSpan) {
            countSpan.innerText = remainingSpins;
          } else
            console.warn("Không tìm thấy .count span trong iframe");
          }

      });*/
/*      if (countSpan) {
        countSpan.innerText = remainingSpins;
      } else {
        console.warn("Không tìm thấy .count span khi quay");
      }*/
/*
      console.log(remainingSpins)*/
      spinWithCustomEasing(finalIndex);
    });
  }
  function addIconsToBorder() {
    const wheelWrapper = document.querySelector(".wheel-wrapper");
    if (!wheelWrapper) return;

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");
    iconContainer.style.position = "absolute";
    iconContainer.style.top = 0;
    iconContainer.style.left = 0;
    iconContainer.style.width = "100%";
    iconContainer.style.height = "100%";
    iconContainer.style.pointerEvents = "none"; // không cản trở thao tác

    const iconCount = 10;
    const iconSize = 15;
    // Tính bán kính từ kích thước thật của wheel
    const radius = wheelWrapper.offsetWidth / 2 - 8; // 10px dư để icon chạm viền ngoài

    for (let i = 0; i < iconCount; i++) {
      const angleDeg = (360 / iconCount) * i;
      const angleRad = angleDeg * Math.PI / 180;

      const x = radius * Math.cos(angleRad) + wheelWrapper.offsetWidth / 2;
      const y = radius * Math.sin(angleRad) + wheelWrapper.offsetHeight / 2;

      const icon = document.createElement("div");
      icon.classList.add("icon");
      icon.style.width = `${iconSize}px`;
      icon.style.height = `${iconSize}px`;
      icon.style.backgroundImage = `url('${currentIcon}')`;
      icon.style.backgroundSize = "contain";
      icon.style.backgroundRepeat = "no-repeat";
      icon.style.position = "absolute";
      icon.style.left = `${x}px`;
      icon.style.top = `${y}px`;
      icon.style.transform = "translate(-50%, -50%)";

      iconContainer.appendChild(icon);
    }

    wheelWrapper.appendChild(iconContainer);
  }
  function getResponsiveRadius() {
    const wrapper = document.querySelector("#wheelDiv");
    let width = wrapper.offsetWidth;
    return width / 2;
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
  function alertPrize(prizeName) {
    Swal.fire({
      title: "🎉 Chúc mừng bạn, bạn nhận được " + prizeName,
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
  }
  window.addEventListener("load", () => {
  if (window.gameType === "spin") {
    createResponsiveWheels();
  } else {
    initSpinFunctionalityOnly();
  }
});
  window.addEventListener("resize", () => {
    if (window.gameType === "spin") {
      createResponsiveWheels();
    }
  });
  function spinWithCustomEasing(finalIndex) {
    const totalDuration = 25000;
    const start = performance.now();
    const totalRotations = 10;
    const anglePerItem = 360 / rewards.length;
    const randomOffset = (Math.random() - 0.5) * anglePerItem * 0.6;
    const finalAngle = 360 * totalRotations + (360 - finalIndex * anglePerItem) + randomOffset;
    let calledAlert = false;
    const useExpoEasing = Math.random() < 0.5;
    function customEasing(n) {
      if (useExpoEasing) {
        return 1 - Math.pow(2, -13 * n);
      } else {
        return 1 - Math.pow(1 - n, 8);
      }
    }
    const wheelDiv = document.getElementById("wheelDiv");
    const wheelDiv2 = document.getElementById("wheelDiv2");
    const spinBtn = document.getElementById("spin");

    if (!wheelDiv || !wheelDiv2) {
      console.error("Không tìm thấy các phần tử wheelDiv hoặc wheelDiv2");
      return;
    }

    function animate(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / totalDuration, 1);
      const eased = customEasing(progress);
      let currentAngle = eased * finalAngle;
      wheelDiv.style.transform = `rotate(${currentAngle}deg)`;
      wheelDiv2.style.transform = `rotate(${currentAngle}deg)`;
      if (useExpoEasing) {
        if (progress >= 0.7 && !calledAlert) {

          calledAlert = true;
          alertPrize(rewards[finalIndex].name);
        }
      }
      else {
        if (progress >= 0.7 && !calledAlert) {

          calledAlert = true;
          alertPrize(rewards[finalIndex].name);
        }
      }
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Cho phép nút quay lại
        spinBtn.disabled = false;
        spinBtn.style.pointerEvents = "auto";
      }
    }

    requestAnimationFrame(animate);
  }
