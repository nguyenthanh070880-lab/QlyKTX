if (!localStorage.getItem("accountsData")) {
    const accounts = [
        { username: "admin", password: "123", role: "Quản trị viên (Admin)" },
        { username: "baove", password: "123", role: "Cán bộ bảo vệ" }
    ];
    localStorage.setItem("accountsData", JSON.stringify(accounts));
}

if (!localStorage.getItem("systemLogs")) {
    const initialLogs = [
        { time: "2026-06-24 08:00:12", user: "Hệ thống", role: "Tự động", action: "Khởi động tường lửa bảo mật KTX Yersin" },
        { time: "2026-06-24 08:15:45", user: "admin", role: "Quản trị viên (Admin)", action: "Đồng bộ hóa cơ sở dữ liệu" }
    ];
    localStorage.setItem("systemLogs", JSON.stringify(initialLogs));
}

function renderAuthArea() {
    const area = document.getElementById("auth-area");
    if (!area) return;
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser) {
        area.innerHTML = `
            <div class="login-box">
                <h3>🔒 ĐĂNG NHẬP BẢO MẬT</h3>
                <div style="margin-bottom:15px;"><label>Tài khoản</label><input type="text" id="login-user" style="width:100%;"></div>
                <div style="margin-bottom:20px;"><label>Mật khẩu</label><input type="password" id="login-pass" style="width:100%;"></div>
                <button class="btn" onclick="xuLyDangNhap()" style="width:100%;background:#1e3a8a;">Xác Thực</button>
            </div>`;
    } else {
        area.innerHTML = `
            <div class="form-container">
                <div class="info-user"><p>Cán bộ: <b>${currentUser.username.toUpperCase()}</b> (${currentUser.role})</p></div>
                <button class="btn" onclick="dangXuat()" style="background:#ef4444;margin-top:15px;">Đăng Xuất</button>
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
        writeLog(found.username, found.role, "Đăng nhập hệ thống");
        window.location.href = "index.html";
    } else { alert("Sai tài khoản/mật khẩu!"); }
}

function dangXuat() { sessionStorage.removeItem("currentUser"); window.location.reload(); }

function renderLogs() {
    const body = document.getElementById("log-table-body");
    if (!body) return; body.innerHTML = "";
    const logs = JSON.parse(localStorage.getItem("systemLogs")) || [];
    logs.slice().reverse().forEach(l => {
        body.innerHTML += `<tr><td><code>${l.time}</code></td><td><b>${l.user}</b></td><td>${l.role}</td><td>${l.action}</td></tr>`;
    });
}

function writeLog(username, role, action) {
    const logs = JSON.parse(localStorage.getItem("systemLogs")) || [];
    const now = new Date();
    logs.push({ time: `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, user: username, role: role, action: action });
    localStorage.setItem("systemLogs", JSON.stringify(logs));
}
window.onload = function() { renderAuthArea(); renderLogs(); }