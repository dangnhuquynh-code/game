import {
    createResponsiveWheels,
    getCurrentBorderColor,
    getCurrentBorderImage,
    getCurrentBtnImage,
    setCurrentBorderColor,
    setCurrentBorderImage,
    setCurrentBtnImage
} from "./spin-wheel.js";


window.addEventListener("DOMContentLoaded", () => {
    const themeOptions = document.getElementById("themeOptions");
    const iframe = document.querySelector("iframe");
    if (currentBackgroundImage.src){
        iframe.src = currentBackgroundImage.src;
    }

    function showBackgroundOptions() {
        const container = document.getElementById("bgOptions");
        if (!container || !iframe || !window.background) return;
        container.innerHTML = "";
        const emptyBg = document.createElement("div");
        Object.assign(emptyBg.style, {
            width: "100px", height: "100px", border: "2px dashed #aaa",
            borderRadius: "10px", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", fontSize: "14px"
        });
        emptyBg.addEventListener("click", () => {
            iframe.src = "";
            document.querySelectorAll("#bgOptions img, #bgOptions div").forEach(el => el.style.border = "2px solid transparent");
            emptyBg.style.border = "2px solid red";
            const wheelWrapper = document.querySelector('.wheel-wrapper');
            wheelWrapper.style.top = "30%";
        });
        container.appendChild(emptyBg);
        background.forEach(bg => {
            const img = document.createElement("img");
            Object.assign(img.style, {
                width: "100px", height: "100px", cursor: "pointer",
                border: "2px solid transparent", borderRadius: "10px", objectFit: "cover"
            });

            img.src = bg.img;
            img.addEventListener("click", () => {
                iframe.src = bg.src;
                updateWheelWrapperPosition();
                document.querySelectorAll("#bgOptions img").forEach(i => i.style.border = "2px solid transparent");
                emptyBg.style.border = "2px dashed #aaa";
                img.style.border = "2px solid red";
            });
            container.appendChild(img);
        });
    }
    showBackgroundOptions();
        function updateWheelWrapperPosition() {
            const wheelWrapper = document.querySelector('.wheel-wrapper');
            if (!wheelWrapper) return;

            if (iframe && iframe.src && iframe.src.trim() !== "") {
                wheelWrapper.style.top = "56%";
            } else {
                wheelWrapper.style.top = "30%";
            }
        }
        if (window.gameType === "spin"){
            let btnInput = document.getElementById("btnInput");
            let btnPreview = document.getElementById("btnPreview");
            let btnList = document.getElementById("btnList");
            let spinBtn = getCurrentBtnImage();
            function setupRewardEditor() {
                const numInput = document.getElementById("numInput");
                const rewardListDiv = document.getElementById("rewardList");

                if (!numInput || !rewardListDiv) return;

                // Khởi tạo giá trị ban đầu
                numInput.value = rewards.length;

                // Sự kiện thay đổi số ô
                numInput.addEventListener("input", () => {
                    const newCount = parseInt(numInput.value);
                    if (isNaN(newCount) || newCount < 2) return;

                    updateRewardCount(newCount);
                    renderEditableRewardList();
                    createResponsiveWheels();
                });

                // Render lần đầu
                renderEditableRewardList();
            }
            function updateRewardCount(newCount) {
                const currentCount = rewards.length;

                if (newCount > currentCount) {
                    for (let i = 0; i < newCount - currentCount; i++) {
                        rewards.push({ img: "img/gift.png", name: "Tên quà" });
                    }
                } else if (newCount < currentCount) {
                    rewards.splice(newCount);
                }
            }
            function renderEditableRewardList() {
                const rewardListDiv = document.getElementById("rewardList");
                if (!rewardListDiv) return;

                rewardListDiv.innerHTML = "";

                rewards.forEach((reward, index) => {
                    const itemDiv = document.createElement("div");
                    itemDiv.innerHTML = `
            <img src="${reward.img}" width="50" style="cursor:pointer;" id="img-${index}" alt="">
            <input type="file" id="file-${index}" style="display:none">
            <input type="text" id="name-${index}" value="${reward.name}">
        `;
                    itemDiv.classList.add('gift-input')
                    rewardListDiv.appendChild(itemDiv);

                    attachRewardItemEvents(index);
                });
            }
            function attachRewardItemEvents(index) {
                const imgEl = document.getElementById(`img-${index}`);
                const fileEl = document.getElementById(`file-${index}`);
                const nameEl = document.getElementById(`name-${index}`);

                if (!imgEl || !fileEl || !nameEl) return;

                imgEl.addEventListener("click", () => fileEl.click());

                fileEl.addEventListener("change", function () {
                    const file = this.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const imgSrc = e.target.result;
                        rewards[index].img = imgSrc;
                        imgEl.src = imgSrc;
                        createResponsiveWheels();
                    };
                    reader.readAsDataURL(file);
                });

                nameEl.addEventListener("input", function () {
                    rewards[index].name = this.value;
                    createResponsiveWheels();
                });
                console.log(rewards)
            }
            setupRewardEditor();
            // === Button Image Options ===
            btnPreview.src = currentBorderColor;
            btnImages.forEach((src, index) => {
                const preview = document.createElement("img");
                preview.src = src;
                preview.width = 60;
                preview.style.margin = "5px";
                preview.style.cursor = "pointer";

                preview.addEventListener("click", () => {
                    btnPreview.src = src;
                    if (spinBtn) spinBtn = src;
                    setCurrentBtnImage(src);
                    updateThemeSettings({ btn: src });
                });

                btnList.appendChild(preview);
            });
            btnPreview.src = currentBorderColor;
            btnInput.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const imageData = e.target.result;
                        btnPreview.src = imageData;
                        if (spinBtn) spinBtn = imageData;
                        setCurrentBtnImage(imageData);
                        updateThemeSettings({ btn: imageData });
                    };
                    reader.readAsDataURL(file);
                }
            });
            // === Color Options ===
            const presetColors = ["#f8a30e", "#ff4d4d", "#4caf50", "#2196f3", "#9c27b0", "#ffeb3b", "#ffffff", "#000000", ""]; // "" = không màu
            const colorOptionsDiv = document.getElementById("colorOptions");
            const colorBox = document.getElementById("currentColorBox");
            const customColorInput = document.getElementById("customColorInput");
            const addCustomColorBtn = document.getElementById("addCustomColorBtn");
            presetColors.forEach(color => {
                const colorBox = document.createElement("div");
                colorBox.style.width = "30px";
                colorBox.style.height = "30px";
                colorBox.style.borderRadius = "50%";
                colorBox.style.cursor = "pointer";
                colorBox.style.border = color === "" ? "2px dashed #ccc" : "2px solid #444";
                colorBox.style.backgroundColor = color || "transparent";
                colorBox.title = color === "" ? "Không nền" : color;

                colorBox.addEventListener("click", () => {
                    setCurrentBorderColor(color);
                    setCurrentBorderImage("")
                    createResponsiveWheels();
                    updateCurrentColorDisplay(color);
                    updateThemeSettings({ borderColor: color, borderImage: "" });
                });

                colorOptionsDiv.appendChild(colorBox);
            });
            function updateCurrentColorDisplay(color) {
                colorBox.style.backgroundColor = color || "transparent";
                colorBox.style.border = color ? "1px solid #ccc" : "1px dashed #aaa";
            }
            addCustomColorBtn.addEventListener("click", () => {
                customColorInput.click();
            });
            customColorInput.addEventListener("input", (e) => {
                const color = e.target.value;
                setCurrentBorderColor(color);
                setCurrentBorderImage("");
                borderImagePreview.src = "";
                borderImagePreview.style.display = "none";
                createResponsiveWheels();
                updateCurrentColorDisplay(color);
                updateThemeSettings({ borderColor: color, borderImage: "" });
            });
            updateCurrentColorDisplay(getCurrentBtnImage());
            // === Border Image Upload ===
            const borderImageInput = document.getElementById("borderImageInput");
            const borderImagePreview = document.getElementById("borderImagePreview");
            borderImageInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (!file || !file.type.startsWith("image/")) return;

                const reader = new FileReader();
                reader.onload = function (event) {
                    const imageData = event.target.result;
                    setCurrentBorderImage(imageData);
                    borderImagePreview.src = imageData;
                    borderImagePreview.style.display = "block";
                    createResponsiveWheels();
                    updateCurrentColorDisplay("");
                    updateThemeSettings({ borderImage: imageData, borderColor: "" });
                };
                reader.readAsDataURL(file);
            });
            // == Icon Upload ==
            const iconOptionsContainer = document.getElementById("iconOptions");
            const emptyIcon = document.createElement("div");
            emptyIcon.textContent = "✖";
            Object.assign(emptyIcon.style, {
                width: "40px", height: "40px", border: "2px dashed #ccc",
                borderRadius: "8px", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer"
            });
            emptyIcon.addEventListener("click", () => {
                document.querySelectorAll("#iconOptions img, #iconOptions div").forEach(el => {
                    el.style.border = "2px solid transparent";
                });
                emptyIcon.style.border = "2px solid #007bff";
                window.currentIcon = "";
                createResponsiveWheels();
                updateThemeSettings({ icon: "" });
            });
            iconOptionsContainer.appendChild(emptyIcon);
            icons.forEach((iconSrc) => {
                const img = document.createElement("img");
                Object.assign(img.style, {
                    width: "40px", height: "40px", cursor: "pointer",
                    border: "2px solid transparent", borderRadius: "8px"
                });
                img.src = iconSrc;
                img.addEventListener("click", () => {
                    document.querySelectorAll("#iconOptions img").forEach((el) => {
                        el.style.border = "2px solid transparent";
                    });
                    img.style.border = "2px solid #007bff";
                    window.currentIcon = iconSrc;
                    createResponsiveWheels();
                    updateThemeSettings({ icon: iconSrc });
                });
                iconOptionsContainer.appendChild(img);
            });
            function showBorderImageOptions() {
                const container = document.getElementById("borderImageList");
                if (!container || !window.borderImages) return;
                container.innerHTML = "";
                const emptyBorder = document.createElement("div");
                emptyBorder.textContent = "✖";
                Object.assign(emptyBorder.style, {
                    width: "60px", height: "60px", border: "2px dashed #ccc",
                    borderRadius: "8px", display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer"
                });
                emptyBorder.addEventListener("click", () => {
                    document.querySelectorAll("#borderImageList img").forEach(i => i.style.border = "2px solid transparent");
                    emptyBorder.style.border = "2px solid red";
                    setCurrentBorderImage("");
                    setCurrentBorderColor("");
                    borderImagePreview.src = "";
                    borderImagePreview.style.display = "none";
                    updateCurrentColorDisplay("");
                    updateThemeSettings({ borderImage: "", borderColor: "" });
                    createResponsiveWheels();

                });
                container.appendChild(emptyBorder);
                window.borderImages.forEach((src) => {
                    const img = document.createElement("img");
                    img.src = src;
                    Object.assign(img.style, {
                        width: "60px", height: "60px", cursor: "pointer",
                        border: "2px solid transparent", borderRadius: "8px", objectFit: "cover"
                    });
                    img.addEventListener("click", () => {
                        document.querySelectorAll("#borderImageList img").forEach(i => i.style.border = "2px solid transparent");
                        img.style.border = "2px solid red";
                        window.currentBorderImage = src;
                        setCurrentBorderImage(img.src);
                        borderImagePreview.src = img.src;
                        borderImagePreview.style.display = "block";
                        createResponsiveWheels();
                        updateThemeSettings({ borderImage: src, borderColor: "" });
                    });
                    container.appendChild(img);
                });
            }
            showBorderImageOptions();
            function showThemeOptions() {
                const container = document.getElementById("themeOptions");
                if (!container || !iframe || !window.theme) return;
                container.innerHTML = "";
                const emptyTheme = document.createElement("div");
                Object.assign(emptyTheme.style, {
                    width: "100px", height: "100px", border: "2px dashed #aaa",
                    borderRadius: "10px", display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", fontSize: "14px"
                });
                emptyTheme.addEventListener("click", () => {
                    iframe.src = "";
                    setCurrentBtnImage("img/btn_default.png");
                    window.currentIcon = "";
                    setCurrentBorderColor("");
                    setCurrentBorderImage("");
                    createResponsiveWheels();
                    document.querySelectorAll("#themeOptions img, #bgOptions div").forEach(el => el.style.border = "2px solid transparent");
                    emptyTheme.style.border = "2px solid red";
                    const wheelWrapper = document.querySelector('.wheel-wrapper');
                    wheelWrapper.style.top = "30%";
                });
                container.appendChild(emptyTheme);
                window.theme.forEach((themeItem, index) => {
                    const img = document.createElement("img");
                    img.src = themeItem.img;
                    img.style.width = "80px";
                    img.style.cursor = "pointer";
                    img.style.border = "2px solid transparent";
                    img.title = `Chủ đề ${index + 1}`;

                    img.addEventListener("click", () => {
                        document.querySelectorAll("#themeOptions img").forEach(el => {
                            el.style.border = "2px solid transparent";
                        });
                        emptyTheme.style.border = "2px dashed #aaa";
                        img.style.border = "2px solid red";
                        window.curentTheme = themeItem;
                        iframe.src = themeItem.background;
                        setCurrentBtnImage(themeItem.button);
                        spinBtn = themeItem.button;
                        window.currentIcon = themeItem.icon;
                        setCurrentBorderColor(themeItem.borderColor);
                        setCurrentBorderImage(themeItem.borderImage);
                        window.currentWheelColor = themeItem.wheelColor;
                        console.log( window.currentWheelColor)
                        createResponsiveWheels();
                        updateWheelWrapperPosition();
                    });
                    themeOptions.appendChild(img);
                });
            }
            showThemeOptions();
            const wheelOptionsContainer = document.getElementById("wheelOptions");
            wheelColor.forEach((wheel) => {
                const img = document.createElement("img");
                Object.assign(img.style, {
                    width: "40px", height: "40px", cursor: "pointer",
                    border: "2px solid transparent", borderRadius: "8px"
                });
                img.src = wheel.img;
                img.addEventListener("click", () => {
                    document.querySelectorAll("#wheelOptions img").forEach((el) => {
                        el.style.border = "2px solid transparent";
                    });
                    img.style.border = "2px solid #007bff";
                    window.currentWheelColor = wheel.color;
                    createResponsiveWheels();
                });
                wheelOptionsContainer.appendChild(img);
            });
            function updateThemeSettings({ btn, icon, borderColor, borderImage }) {
                if (!window.curentTheme) return;
                if (btn !== undefined) window.curentTheme.btn = btn;
                if (icon !== undefined) window.curentTheme.icon = icon;
                if (borderColor !== undefined) window.curentTheme.borderColor = borderColor;
                if (borderImage !== undefined) window.curentTheme.borderImage = borderImage;
            }
            const saveBtn = document.getElementById("saveConfigBtn");
            if (saveBtn) {
                saveBtn.addEventListener("click", exportToNewTab);
            }
            function getExportedHTML() {
                // Lấy phần tử có class 'display'

                const displayElement = document.querySelector(".display");

                // Kiểm tra nếu phần tử không tồn tại
                if (!displayElement) {
                    console.error("Không tìm thấy phần tử có class .display");
                    return "";
                }

                // Tạo mảng rewards trong đối tượng window (sử dụng cấu trúc window.rewards)

                // Tạo một thẻ script để gắn mảng rewards vào đối tượng window
                const scriptElement = document.createElement("script");
                scriptElement.type = "text/javascript";
                scriptElement.textContent = `
        
                window.rewards = ${JSON.stringify(window.rewards)};;
                window.playerData = ${JSON.stringify(window.playerData)};
                window.spinlogs = ${JSON.stringify(window.spinlogs)}`;
                // Thêm thẻ script vào DOM
                displayElement.appendChild(scriptElement);
                // Lấy HTML của phần tử .display bao gồm cả thẻ script chứa rewards
                const displayHTML = displayElement.outerHTML;
                // Debug output to check the generated HTML
                return displayHTML;
            }
            function exportToNewTab() {
                const exportedHTML = getExportedHTML();
                saveCurrentConfiguration();
                const fullHTML = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Vòng quay trung thu</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <script src="https://cdn.jsdelivr.net/npm/wheelnav@1.7.1/js/dist/raphael.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/wheelnav@1.7.1/js/dist/wheelnav.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                    <link rel="stylesheet" href="css/spin-wheel.css" />
                    <link rel="stylesheet" href="css/custom.css" />
                    <link
                    href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap"
                    rel="stylesheet"
                    />
                    <link
                            href="https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Italianno&display=swap"
                            rel="stylesheet"
                    />
                
                    </head>
                    <body>
                      <div class="popup-overlay" id="popupOverlay">
                        <div class="popup">
                            <button class="close-button" onclick="closePopup()">&times;</button>
                            <div class="popup-content">
                                <h2 class="title-popup">Title Pop-up</h2>
                                <p>Hello world Hello world Hello world Hello world</p>
                                <div class="btn"></div>
                                <button class="btn_ok" onclick="closePopup()">Đồng ý</button>
                            </div>
                        </div>
                    </div>
                           <a id="logout">Đăng xuất</a>
                    <!--   <div class="count">Số lượt chơi còn lại:&nbsp;<span></span>&nbsp;lượt</div>-->
                        ${exportedHTML}
                         <div id="overlay" class="overlay">
                            <div class="container-form" id="form">
                              <span class="close-btn" id="closeFormRes">&times;</span>
                                <div class="text">
                                    Nhập thông tin của bạn
                                </div>
                                <form action="#">
                                    <div class="form-row">
                                        <div class="input-data">
                                            <input type="text" id="nameInput" required>
                                            <div class="underline"></div>
                                            <label for="nameInput">Họ và tên</label>
                                        </div>
                                         <div class="input-data">
                                            <input type="text" id="passwordInput" required>
                                            <div class="underline"></div>
                                            <label for="passwordInput">Mật khẩu</label>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="input-data">
                                            <input type="text" id="emailInput" required>
                                            <div class="underline"></div>
                                            <label for="emailInput">Email</label>
                                        </div>
                                        <div class="input-data">
                                            <input type="text" id="phoneInput" required>
                                            <div class="underline"></div>
                                            <label for="phoneInput">Số điện thoại</label>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="input-data textarea ">
                                            <br />
                                            <div class="form-row submit-btn center-submit">
                                                <div id="registerBtn" class="input-data">
                                                    <div class="inner"></div>
                                                    <input type="submit" value="submit">
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div class="switch-form">
                                      <a href="#" id="switch-form">Bạn đã có tài khoản?</a>
                                    </div>
                                </form>
                            </div>
                             <div class="container-form register-form " id="formLogin">
                               <span class="close-btn" id="closeFormLogin">&times;</span>
                             <div class="text">
                                Đăng nhập
                             </div>
                             <form action="#">
                                 <div class="form-row">
                                     <div class="input-data">
                                         <input type="text" id="emailInput2" required>
                                         <div class="underline"></div>
                                         <label for="emailInput2">Email</label>
                                     </div>
                                 </div>
                                 <div class="form-row">
                                     <div class="input-data">
                                         <input type="text" id="passwordInput2" required>
                                         <div class="underline"></div>
                                         <label for="passwordInput2">Password</label>
                                     </div>
                                 </div>
                                 <div class="form-row">
                                     <div class="input-data textarea">
                                         <br />
                                         <div class="form-row submit-btn center-submit">
                                             <div id="loginBtn" class="input-data">
                                                 <div class="inner"></div>
                                                 <input type="submit" value="submit">
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </form>

                         </div>
                        </div>
                         <script src="js/popup.js"></script>
                    </body>
                    <script type="module" src="js/spin-wheel.js"></script>
                    <script type="module" src="js/player.js"></script>
                    </html>
                    `;
                const newWindow = window.open("");
                newWindow.document.open();
                newWindow.document.write(fullHTML);
                newWindow.document.close();

                const blob = new Blob([fullHTML], { type: "text/html" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "app.html";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            function getCurrentConfiguration() {
                // Kiểm tra các dữ liệu đầu vào trước khi lưu
                const rewardsData = rewards.map(r => ({ img: r.img, name: r.name }));
                const buttonImageData = getCurrentBtnImage();
                const borderColorData = getCurrentBorderColor();
                const borderImageData = getCurrentBorderImage();
                const iconData = window.currentIcon || "";
                const backgroundData = iframe?.src || "";

                const wheelHTML = document.querySelector(".wheel-wrapper")?.outerHTML || "";
                const iframeHTML = iframe?.outerHTML || "";

                return {
                    rewards: rewardsData,
                    buttonImage: buttonImageData,
                    borderColor: borderColorData,
                    borderImage: borderImageData,
                    icon: iconData,
                    background: backgroundData,
                    html: {
                        wheel: wheelHTML,
                        iframe: iframeHTML
                    }
                };
            }
            function saveCurrentConfiguration() {
                const config = getCurrentConfiguration();
                // In ra cấu hình đầy đủ sau khi lấy
                configFromDB.background = config.background;
                configFromDB.button = config.buttonImage;
                configFromDB.borderColor = config.borderColor;
                configFromDB.borderImage = config.borderImage;
                configFromDB.icon = config.icon;
                console.log(rewards);
                console.log("Đã lưu cấu hình:", config);

                // Ví dụ lưu lên server (nếu cần):
                // fetch("/api/save-config", {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     body: JSON.stringify(config),
                // });
            }

        }
        if(window.gameType === "guess") {
            const cupImages = document.querySelectorAll('.img_cup_1, .img_cup_2, .img_cup_3');
            cupImages.forEach(cupImg => {
                cupImg.src = window.currentCup; // Cập nhật cúp mặc định cho tất cả các cúp
            });
            const ballImage = document.querySelector('.guess')
            ballImage.src = window.currentBall;
            function showCupOptions() {
                const container = document.getElementById("cupOptions");
                if (!container || !window.cups) return;
                container.innerHTML = "";
                const defaultCup = "img/MA9SE8f.png";
                const defaultCupDiv = document.createElement("div");
                defaultCupDiv.style.width = "100px";
                defaultCupDiv.style.height = "100px";
                defaultCupDiv.style.border = "2px solid transparent";
                defaultCupDiv.style.borderRadius = "10px";
                defaultCupDiv.style.display = "flex";
                defaultCupDiv.style.alignItems = "center";
                defaultCupDiv.style.justifyContent = "center";
                defaultCupDiv.style.cursor = "pointer";

                const img = document.createElement("img");
                img.src = defaultCup; // Dùng ảnh cúp mặc định
                img.style.width = "80px";
                img.style.height = "80px";
                img.style.borderRadius = "8px";
                img.style.objectFit = "cover";

                defaultCupDiv.appendChild(img);

                // Thêm sự kiện click để chọn cúp mặc định
                defaultCupDiv.addEventListener("click", () => {
                    document.querySelectorAll("#cupOptions img").forEach((el) => {
                        el.style.border = "2px solid transparent"; // Loại bỏ viền cúp đã chọn
                    });
                    img.style.border = "2px solid red"; // Đánh dấu cúp mặc định là đã chọn
                    window.currentCup = "img/MA9SE8f.png"; // Cập nhật cúp hiện tại là cúp mặc định
                    cupImages.forEach(img => {
                        img.src = window.currentCup;
                    });
                });
                container.appendChild(defaultCupDiv);
                window.cups.forEach((cup) => {
                    const cupDiv = document.createElement("div");
                    cupDiv.style.width = "100px";
                    cupDiv.style.height = "100px";
                    cupDiv.style.border = "2px solid transparent";
                    cupDiv.style.borderRadius = "10px";
                    cupDiv.style.display = "flex";
                    cupDiv.style.alignItems = "center";
                    cupDiv.style.justifyContent = "center";
                    cupDiv.style.cursor = "pointer";

                    const cupImg = document.createElement("img");
                    cupImg.src = cup.img;
                    cupImg.style.width = "80px";
                    cupImg.style.height = "80px";
                    cupImg.style.borderRadius = "8px";
                    cupImg.style.objectFit = "cover";

                    cupDiv.appendChild(cupImg);

                    cupDiv.addEventListener("click", () => {
                        document.querySelectorAll("#cupOptions img").forEach((el) => {
                            el.style.border = "2px solid transparent";
                        });
                        cupImg.style.border = "2px solid red";
                        window.currentCup = cup.img;
                        cupImages.forEach(img => {
                            img.src = window.currentCup;
                        });
                    });
                    container.appendChild(cupDiv); // Thêm cúp vào container
                });
            }
            showCupOptions();
            function showBallOptions() {
                const container = document.getElementById("ballOptions");
                if (!container || !window.balls) return;
                container.innerHTML = "";
                const defaultBall = "img/BMMCBkx.png";
                const defaultBallDiv = document.createElement("div");
                defaultBallDiv.style.width = "100px";
                defaultBallDiv.style.height = "100px";
                defaultBallDiv.style.border = "2px solid transparent";
                defaultBallDiv.style.borderRadius = "10px";
                defaultBallDiv.style.display = "flex";
                defaultBallDiv.style.alignItems = "center";
                defaultBallDiv.style.justifyContent = "center";
                defaultBallDiv.style.cursor = "pointer";

                const img = document.createElement("img");
                img.src = defaultBall; // Dùng ảnh cúp mặc định
                img.style.width = "80px";
                img.style.height = "80px";
                img.style.borderRadius = "8px";
                img.style.objectFit = "cover";

                defaultBallDiv.appendChild(img);

                // Thêm sự kiện click để chọn cúp mặc định
                defaultBallDiv.addEventListener("click", () => {
                    document.querySelectorAll("#ballOptions img").forEach((el) => {
                        el.style.border = "2px solid transparent"; // Loại bỏ viền cúp đã chọn
                    });
                    img.style.border = "2px solid red"; // Đánh dấu cúp mặc định là đã chọn
                    window.currentCup = "img/BMMCBkx.png"; // Cập nhật cúp hiện tại là cúp mặc định
                    ballImage.src = window.currentCup;
                });
                container.appendChild(defaultBallDiv);
                window.balls.forEach((ball) => {
                    const ballDiv = document.createElement("div");
                    ballDiv.style.width = "100px";
                    ballDiv.style.height = "100px";
                    ballDiv.style.border = "2px solid transparent";
                    ballDiv.style.borderRadius = "10px";
                    ballDiv.style.display = "flex";
                    ballDiv.style.alignItems = "center";
                    ballDiv.style.justifyContent = "center";
                    ballDiv.style.cursor = "pointer";

                    const ballImg = document.createElement("img");
                    ballImg.src = ball.img;
                    ballImg.style.width = "80px";
                    ballImg.style.height = "80px";
                    ballImg.style.borderRadius = "8px";
                    ballImg.style.objectFit = "cover";

                    ballDiv.appendChild(ballImg);

                    ballDiv.addEventListener("click", () => {
                        document.querySelectorAll("#ballOptions img").forEach((el) => {
                            el.style.border = "2px solid transparent";
                        });
                        ballImg.style.border = "2px solid red";
                        window.currentBall = ball.img;

                        ballImage.src = window.currentBall;

                    });
                    container.appendChild(ballDiv); // Thêm cúp vào container
                });
            }
            showBallOptions();
            window.theme.forEach((themeItem, index) => {
                const img = document.createElement("img");
                img.src = themeItem.img;
                img.style.width = "80px";
                img.style.cursor = "pointer";
                img.style.border = "2px solid transparent";
                img.title = `Chủ đề ${index + 1}`;

                img.addEventListener("click", () => {
                    document.querySelectorAll("#themeOptions img").forEach(el => {
                        el.style.border = "2px solid transparent";
                    });
                    img.style.border = "2px solid red";
                    window.currentBackgroundImage = themeItem.src
                    iframe.src = currentBackgroundImage;
                    window.currentBall = themeItem.ball;
                    console.log(currentBall)
                    ballImage.src = window.currentBall;

                });
                themeOptions.appendChild(img);
            });
        }
    })




