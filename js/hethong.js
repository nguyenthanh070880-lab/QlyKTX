// Tạo tài khoản mẫu ban đầu cho hệ thống bảo mật
if (!localStorage.getItem("accountsData")) {
    const accounts = [
        { username: "admin", password: "123", role: "Quản trị viên (Admin)" },
        { username: "baove", password: "123", role: "Cán bộ bảo vệ" }
    ];
    localStorage.setItem("accountsData", JSON.stringify(accounts));
}

// Khởi tạo một vài dòng log lịch sử mẫu
if (!localStorage.getItem("systemLogs")) {
    const initialLogs = [
        { time: "2026-06-24 08:00:12", user: "Hệ thống", role: "Tự động", action: "Khởi động tường lửa bảo mật KTX Yersin" },
        { time: "2026-06-24 08:15:45", user: "admin", role: "Quản trị viên (Admin)", action: "Đồng bộ hóa cơ sở dữ liệu học kỳ mới" }
    ];
    localStorage.setItem("systemLogs", JSON.stringify(initialLogs));
}

function renderAuthArea() {
    const area = document.getElementById("auth-area");
    if (!area) return;
    
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (!currentUser) {
        // Chưa đăng nhập -> Hiện Form Đăng Nhập Bảo Mật
        area.innerHTML = `
            <div class="login-box">
                <h3>🔒 ĐĂNG NHẬP HỆ THỐNG KTX</h3>
                <div style="margin-bottom:15px;">
                    <label style="display:block;margin-bottom:5px;font-weight:600;font-size:13px;">Tài khoản</label>
                    <input type="text" id="login-user" placeholder="Nhập 'admin' hoặc 'baove'" style="width:100%;">
                </div>
                <div style="margin-bottom:20px;">
                    <label style="display:block;margin-bottom:5px;font-weight:600;font-size:13px;">Mật khẩu</label>
                    <input type="password" id="login-pass" value="123" style="width:100%;">
                </div>
                <button class="btn" onclick="xuLyDangNhap()" style="width:100%;background-color:#1e3a8a;">Xác Thực Đăng Nhập</button>
            </div>`;
    } else {
        // Đã đăng nhập -> Hiện thông tin tài khoản hiện tại
        area.innerHTML = `
            <div class="form-container">
                <h3>🔐 Trạng thái phiên làm việc</h3>
                <div class="info-user">
                    <p>Chào mừng cán bộ: <b style="color:#1e3a8a;">${currentUser.username.toUpperCase()}</b></p>
                    <p style="margin-top:5px;font-size:13px;color:#64748b;">Quyền hạn trên hệ thống: <span class="badge badge-done" style="background:#dbeafe;color:#1e40af;">${currentUser.role}</span></p>
                </div>
                <button class="btn" onclick="dangXuat()" style="background-color:#ef4444;margin-top:15px;padding:8px 15px;font-size:13px;">Đăng Xuất Hệ Thống</button>
            </div>`;
    }
}

function xuLyDangNhap() {
    const userIn = document.getElementById("login-user").value.trim();
    const passIn = document.getElementById("login-pass").value;

    const accounts = JSON.parse(localStorage.getItem("accountsData")) || [];
    const found = accounts.find(a => a.username === userIn && a.password === passIn);

    if (found) {
        sessionStorage.setItem("currentUser", JSON.stringify(found));
        writeLog(found.username, found.role, "Đăng nhập hệ thống thành công");
        alert("Đăng nhập phân quyền bảo mật thành công!");
        window.location.href = "index.html"; // Chuyển về trang chủ xem số liệu
    } else {
        alert("Sai tài khoản hoặc mật khẩu bảo mật!");
    }
}

function dangXuat() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUser) {
        writeLog(currentUser.username, currentUser.role, "Đăng xuất khỏi hệ thống");
    }
    sessionStorage.removeItem("currentUser");
    window.location.reload();
}

function renderLogs() {
    const body = document.getElementById("log-table-body");
    if (!body) return;
    body.innerHTML = "";
    const logs = JSON.parse(localStorage.getItem("systemLogs")) || [];

    // Hiển thị danh sách log đảo ngược (mới nhất lên trên cùng)
    logs.slice().reverse().forEach(l => {
        body.innerHTML += `
            <tr>
                <td><code style="color:#64748b;">${l.time}</code></td>
                <td><b>${l.user}</b></td>
                <td><span style="font-size:12px;color:#475569;">${l.role}</span></td>
                <td><span style="color:#0369a1;font-weight:500;">${l.action}</span></td>
            </tr>`;
    });
}

function writeLog(username, role, action) {
    const logs = JSON.parse(localStorage.getItem("systemLogs")) || [];
    const now = new Date();
    const timeStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    logs.push({ time: timeStr, user: username, role: role, action: action });
    localStorage.setItem("systemLogs", JSON.stringify(logs));
}

window.onload = function() {
    renderAuthArea();
    renderLogs();
}