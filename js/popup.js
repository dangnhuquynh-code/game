const popupConfigs = {
  rule: {
    title: "Quy tắc chơi",
    content: "Các quy tắc của trò chơi sẽ được hiển thị ở đây.",
    showButton: true,
    buttonText: "Đã hiểu",
  },
  history: {
    title: "Lịch sử chơi",
    content: "Lịch sử chơi sẽ được hiển thị ở đây.",
    showButton: true,
    buttonText: "Đồng ý",
  },
  gift: {
    title: "Quà tặng",
    content: "Nội dung quà tặng sẽ xuất hiện ở đây.",
    showButton: true,
    buttonText: "Đồng ý",
  },
  list: {
    title: "Danh sách quà",
    content: "Nội dung danh sách quà sẽ xuất hiện ở đây.",
    showButton: true,
    buttonText: "Đồng ý",
  },
  recharge: {
    title: "Nạp thêm",
    content: "Nội dung nạp thêm sẽ xuất hiện ở đây.",
    showButton: true,
    buttonText: "Đồng ý",
  },
  share: {
    title: "Chia sẻ",
    content: "Chia sẻ trò chơi với bạn bè!",
    showButton: true,
    buttonText: "Chia sẻ ngay",
  },

};
popupConfigs.form = {
  content: `
     <div class="container-form">
                <div class="text">
                    Nhập thông tin của bạn
                </div>
                <form action="#">
                    <div class="form-row">
                        <div class="input-data">
                            <input type="text" required>
                            <div class="underline"></div>
                            <label for="">First Name</label>
                        </div>
                        <div class="input-data">
                            <input type="text" required>
                            <div class="underline"></div>
                            <label for="">Last Name</label>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="input-data">
                            <input type="text" required>
                            <div class="underline"></div>
                            <label for="">Email Address</label>
                        </div>
                        <div class="input-data">
                            <input type="text" required>
                            <div class="underline"></div>
                            <label for="">Website Name</label>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="input-data textarea">
                            <textarea rows="8" cols="80" required></textarea>
                            <br />
                            <div class="underline"></div>
                            <label for="">Write your message</label>
                            <br />
                            <div class="form-row submit-btn">
                                <div class="input-data">
                                    <div class="inner"></div>
                                    <input type="submit" value="submit">
                                </div>
                            </div>
                </form>
            </div>
  `,
  showButton: false, // Ẩn nút ở dưới nếu form đã có nút riêng
};
const openPopup = (type = "", customConfig = null) => {
  const popupOverlay = document.getElementById("popupOverlay");
  const titleElement = document.querySelector(".title-popup");
  const contentElement = document.querySelector(".popup-content p");
  const buttonElement = document.querySelector(".btn_ok");

  const config = customConfig ||
    popupConfigs[type] || {
      title: "Thông báo",
      content: "Nội dung thông báo",
      showButton: true,
      buttonText: "Đóng",
    };

  // Update popup content
  titleElement.textContent = config.title;
  contentElement.innerHTML = config.content;

  if (config.showButton) {
    buttonElement.style.display = "block";
    buttonElement.textContent = config.buttonText;
  } else {
    buttonElement.style.display = "none";
  }

  popupOverlay.style.display = "flex";
};
const closePopup = () => {
  const popupOverlay = document.getElementById("popupOverlay");
  popupOverlay.style.display = "none";
};
// Đóng pop-up khi nhấp ra ngoài pop-up
window.onclick = function (event) {
  if (event.target === document.getElementById("popupOverlay")) {
    closePopup();
  }
};
const createCustomPopup = (
  title,
  content,
  buttonText = "Đóng",
  showButton = true
) => {
  return {
    title: title,
    content: content,
    showButton: showButton,
    buttonText: buttonText,
  };
};
window.addEventListener("message", function (event) {
  const { action, type, popupCSS } = event.data;
  if (action === "openPopup") {
    openPopup(type);
    loadPopupCSS(popupCSS);
  }
  function loadPopupCSS(cssFileName) {
    let existingLink = document.querySelector(`link[href="${cssFileName}"]`);

    if (!existingLink) {
      let linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = `css/${cssFileName}`; // Đường dẫn đến CSS của từng file con
      document.head.appendChild(linkElement);
    }
  }
});
