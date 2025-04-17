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

  <link rel="stylesheet" href="css/custom.css" />
  <link rel="stylesheet" href="css/guess.css" />
</head>
<body>
<div class="container"  style="display: flex; height: 100vh;">
  <!-- Cột trái: Tuỳ chỉnh -->
    <div class="settings-panel" style="display: none;">
        <h2>Tuỳ chỉnh vòng quay</h2>
        <div class="tabs">
            <button data-tab="wheel">🎡 Vòng quay</button>
            <button data-tab="button">🔘 Nút quay</button>
            <button data-tab="border">🌄 Viền</button>
        </div>
        <!-- Nội dung chỉnh sửa -->
        <div id="tab-wheel" class="tab-content">
            <h3>Chỉnh phần thưởng</h3>
            <label for="numInput">Số ô:</label>
            <input type="number" id="numInput"  min="2" max="20" value="" />
            <div id="rewardList"></div>
            <div id="segmentFields"></div>
        </div>

        <div id="tab-button" class="tab-content" style="display:none">
            <h3>Chỉnh Nút Quay</h3>
            <div id="btnList"></div>
            <input type="file" id="btnInput" />
            <img id="btnPreview" src="" width="100" style="margin-top: 10px;" alt="">
        </div>

        <div id="tab-border" class="tab-content" style="display:none">
            <h3>Chỉnh Viền</h3>
            <div id="colorOptions" style="display:flex; gap:10px; margin:10px 0;">
            </div>
            <button id="addCustomColorBtn">+ Thêm màu tùy chọn</button>
            <input type="color" id="customColorInput" style="display:none">
            <div id="currentColorDisplay" style="margin-top:10px; font-weight: bold;">
                Màu nền hiện tại: <span id="currentColorBox" style="display:inline-block; width:30px; height:30px; vertical-align:middle; border:1px solid #ccc; margin-left:10px;"></span>
            </div>

            <div style="margin-bottom: 10px;">
                <label>Chọn hình viền:</label><br>
                <div id="borderImageList" style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;"></div>
                <input type="file" id="borderImageInput" accept="image/*">
                <img id="borderImagePreview" style="width: 80px; height: 80px; display: none; margin-top: 5px;">
            </div>
            <div style="margin-top: 10px;">
                <label>Chọn icon viền:</label>
                <div id="iconOptions" style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 5px;"></div>
            </div>

        </div>
        <button id="saveConfigBtn">Cập nhật vòng quay</button>
    </div>
    <div class="settings-panel">
        <h2>Tuỳ chỉnh vòng quay</h2>
        <div class="tabs">
            <button data-tab="background">🌄 Hình nền</button>
            <button data-tab="cup">🌄 Hình ly</button>
            <button data-tab="ball">🌄 Hình bóng</button>
            <button data-tab="theme">🌄 Chủ đề</button>
        </div>
        <div id="tab-background" class="tab-content" style="display:none">
            <h3>Chọn nền hiển thị:</h3>
            <div id="bgOptions" style="display: flex; gap: 10px; flex-wrap: wrap;"></div>
        </div>
        <div id="tab-cup" class="tab-content" style="display:none">
            <h3>Chọn hình dáng ly hiển thị:</h3>
            <div id="cupOptions" style="display: flex; gap: 10px; flex-wrap: wrap;"></div>
        </div>
        <div id="tab-ball" class="tab-content" style="display:none">
            <h3>Chọn hình dáng bóng hiển thị:</h3>
            <div id="ballOptions" style="display: flex; gap: 10px; flex-wrap: wrap;"></div>
        </div>
        <div id="tab-theme" class="tab-content" style="display:none">
            <h3>Chọn chủ đề:</h3>
            <div id="themeOptions" style="display: flex; gap: 10px; flex-wrap: wrap;"></div>
        </div>
        <button id="saveConfigBtn">Cập nhật vòng quay</button>
    </div>
    <div class="display">
        <iframe src=""></iframe>
      <!--  <div class="wheel-wrapper" style="display: none">
            <div class="wheel" id="wheelDiv" data-wheelnav></div>
            <div class="wheel" id="wheelDiv2" data-wheelnav></div>
            <img id="spin" class="spin_button" />
        </div>-->
        <div class="box_guess">
            <div id="cup1" class="cup_2 cup cup-1">
                <img src="" alt="" class="img_cup_1" />
            </div>
            <div id="cup2" class="cup_3 cup cup-2">
                <img src="" alt="" class="img_cup_2" />
            </div>
            <div id="cup3" class="cup_4 cup cup-3">
                <img src="" alt="" class="img_cup_3" />
            </div>
            <img src="" alt="" class="guess" id="guess" />

        </div>
        <div class="btn_start" id="btnStart">
            <button>
                Bắt đầu
               <!-- <img src="img/img_bg_btn_start.png" alt="" />-->
            </button>
        </div>
        <div class="btn_restart" id="btnRestart">
            <button>
                Chơi lại
                <!--<img src="img/img_bg_btn_start.png" alt="" />-->
            </button>
        </div>
    </div>

</div>
</body>
<script>
    window.gameType = "guess";
    rewards = [];
    const configFromDB = {
        borderColor: "",
        borderImage: "",
        icon: "",
        background: "",
        button: "",
        cup: "img/MA9SE8f.png",
        ball: "img/BMMCBkx.png",
    };
    window.currentBackgroundImage = configFromDB.background;
    window.currentBorderColor = configFromDB.borderColor;
    window.currentBtnImages = configFromDB.button;
    window.currentBorderImage = configFromDB.borderImage;
    window.currentIcon = configFromDB.icon;
    window.currentCup = configFromDB.cup;
    window.currentBall = configFromDB.ball;
    window.background = [
        { img: "img/bg_halloween.png", src: "bg/guess-halloween.html" }
    ]
    window.cups = [
        { img: "img/img_cup.png" }
    ]
    window.balls = [
        { img: "img/img_guess.png" }
    ]
    window.theme = [
        { img: "img/bg_halloween.png", src: "bg/guess-halloween.html", cup: "img/img_cup.png", ball: "img/img_guess.png"},
    ]
</script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js'></script>
<script src="js/guess.js"></script>
<script type="module" src="js/custom.js"></script>
</html>
