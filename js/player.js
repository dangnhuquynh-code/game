function registerUser(name, email, phone, password) {
    console.log(window.playerData)
    const existedUserByEmail = window.playerData.find(u => u.email === email);
    const existedUserByPhone = window.playerData.find(u => u.phone === phone);
    if (existedUserByEmail || existedUserByPhone) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Thông tin đăng ký đã tồn tại"
        });
        return;
    }
    const newUserId = playerData.length + 1;
    const newUser = { id: newUserId, name, email, phone, password};
    playerData.push(newUser);

   // Tự động cộng 1 lượt quay khi đăng ký thành công
/*    spinlogs.push({
        userId: newUserId,
        status: "unused",
        prizeId: null,
        createdAt: Date.now(),
        spinTime: null
    });*/
    // Cộng 3 lượt quay
    for (let i = 0; i < 3; i++) {
        spinlogs.push({
            userId: newUserId,
            status: "unused",
            prizeId: null,
            createdAt: Date.now(),
            spinTime: null
        });
    }
    Swal.fire({
        title: "Đăng ký thành công, bạn nhận được 3 lượt quay miễn phí",
        icon: "success",
        draggable: true
    });
    const overlay = document.getElementById('overlay');
    const form = document.getElementById('form');
    if (overlay && form) {
        overlay.style.display = 'none';
        form.style.display = 'none';
    } else {
        console.error('Overlay hoặc form không tồn tại');
    }

    console.log("Danh sách người chơi:", playerData);
    console.log("🎯 spinlogs:", spinlogs);
    return newUser;
}
function getRemainingSpins(userId) {
    return spinlogs.filter(sa => sa.userId === userId && sa.status === "unused").length;
}
function loginUser(email, password) {
    const user = window.playerData.find(u => u.email === email && u.password === password);
    if (user) {
        Swal.fire({
            title: "Đăng nhập thành công!",
            icon: "success",
            draggable: true
        });
        const overlay = document.getElementById('overlay');
        const formLogin = document.getElementById('formLogin');
        formLogin.style.display = "none";
        overlay.style.display = "none";
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.remainingSpins = getRemainingSpins(user.id);
        const iframe = document.getElementById("spinFrame");
        iframe.contentWindow.postMessage({
            type: "updateSpins",
            remainingSpins: remainingSpins
        }, "*");
        iframe.contentWindow.postMessage({
            type: "updateUser",
            user: user
        }, "*");
        return user;
    } else {
        Swal.fire({
            icon: "error",
            title: "Đăng nhập thất bại",
            text: "Email hoặc mật khẩu không chính xác."
        });
        return null;
    }
}

// Xử lý đăng ký khi người dùng bấm nút
document.addEventListener("DOMContentLoaded", function () {

    const overlay = document.getElementById('overlay');
    const form = document.getElementById('form');
    const formLogin = document.getElementById('formLogin');
    const closeBtnRes = document.getElementById("closeFormRes");
    const closeBtnLogin = document.getElementById("closeFormLogin");
    const spinBtn = document.getElementById("spin");
    const iframe = document.getElementById("spinFrame");

/*
    spinBtn.addEventListener("click", function () {
        let user = localStorage.getItem('loggedInUser');
        let spins = getRemainingSpins(user.id);
        if (spins === null) {
            spins = 0; // Nếu không có giá trị nào trong localStorage thì gán bằng 0
        }
        console.log("🎯 remainingSpins:", spins);
        iframe.contentWindow.postMessage({
            type: "updateCount",
            remainingSpins: spins
        }, "*");
    });

*/

    document.getElementById("registerBtn").addEventListener("click", function () {
        const name = document.getElementById("nameInput").value.trim();
        const phone = document.getElementById("phoneInput").value.trim();
        const email = document.getElementById("emailInput").value.trim();
        const password = document.getElementById("passwordInput").value.trim();

        const user = registerUser(name, email, phone, password);
        const turns = getRemainingSpins(user.id);

    });
    document.getElementById('logout').addEventListener('click', function() {
        localStorage.clear();
    });
    document.getElementById('form').addEventListener('submit', function(event) {
        event.preventDefault(); // Ngừng hành vi mặc định (quay lại trang trước)
    });
    document.getElementById('formLogin').addEventListener('submit', function(event) {
        event.preventDefault(); // Ngừng hành vi mặc định (quay lại trang trước)
    });
    document.getElementById('switch-form').addEventListener("click", function () {
        if (overlay && form) {
            form.style.display = 'none';
            formLogin.style.display = 'block';
        } else {
            console.error('Overlay hoặc form không tồn tại');
        }
    });

    closeBtnRes.addEventListener("click", () => {
        form.style.display = "none";
        overlay.style.display = "none"
    });
    closeBtnLogin.addEventListener("click", () => {
        formLogin.style.display = "none";
        overlay.style.display = "none";
    });
    window.addEventListener("click", (e) => {
        if (e.target === form) {
            form.style.display = "none";
            formLogin.style.display = "none";
            overlay.style.display = "none";
        }
    });
    document.getElementById("loginBtn").addEventListener("click", function () {
        const email = document.getElementById("emailInput2").value.trim();
        const password = document.getElementById("passwordInput2").value.trim();

        const user = loginUser(email, password);

        if (user) {

        }
    });
});
