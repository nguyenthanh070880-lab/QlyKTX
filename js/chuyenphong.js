if (!localStorage.getItem("chuyenPhongData")) {
    const mauCP = [
        { mssv: "2401010006", hoTen: "Lê Văn A", phongCu: "A102", loaiNV: "Chuyển phòng", phongMoi: "A101", trangThai: "Chờ duyệt" }
    ];
    localStorage.setItem("chuyenPhongData", JSON.stringify(mauCP));
}

function getMoveRequests() { return JSON.parse(localStorage.getItem("chuyenPhongData")) || []; }

// Ẩn/Hiện ô chọn phòng mới dựa theo loại nguyện vọng (Chuyển phòng thì hiện, Trả phòng thì ẩn)
function toggleRoomSelect() {
    const loai = document.getElementById("cp-loai").value;
    const divPhongMoi = document.getElementById("div-phongmoi");
    if (loai === "Trả phòng") {
        divPhongMoi.style.display = "none";
    } else {
        divPhongMoi.style.display = "inline-block";
    }
}

function loadCpData() {
    const selectSv = document.getElementById("cp-mssv");
    const selectPhongMoi = document.getElementById("cp-phongmoi");
    if (!selectSv || !selectPhongMoi) return;

    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const rooms = JSON.parse(localStorage.getItem("phongData")) || [];

    selectSv.innerHTML = "";
    if (students.length === 0) {
        selectSv.innerHTML = `<option value="">Chưa có sinh viên</option>`;
    } else {
        students.forEach(s => selectSv.innerHTML += `<option value="${s.mssv}">${s.mssv} - ${s.hoTen}</option>`);
    }

    selectPhongMoi.innerHTML = "";
    rooms.forEach(r => selectPhongMoi.innerHTML += `<option value="${r.maPhong}">${r.maPhong}</option>`);
}

function renderMoveRequests() {
    const body = document.getElementById("cp-table-body");
    if (!body) return;
    body.innerHTML = "";

    getMoveRequests().forEach((m, idx) => {
        const cls = m.trangThai === "Chờ duyệt" ? "badge-wait" : "badge-approved";
        body.innerHTML += `
            <tr>
                <td>${m.mssv}</td>
                <td><b>${m.hoTen}</b></td>
                <td><span style="background:#f1f5f9;padding:2px 6px;border-radius:4px;">${m.phongCu}</span></td>
                <td><b style="color:${m.loaiNV === 'Chuyển phòng' ? '#0d9488' : '#ea580c'};">${m.loaiNV}</b></td>
                <td><b>${m.loaiNV === 'Chuyển phòng' ? m.phongMoi : '-'}</b></td>
                <td><span class="badge ${cls}">${m.trangThai}</span></td>
                <td>
                    ${m.trangThai === "Chờ duyệt"
                        ? `<button class="btn" style="background:#10b981; padding:4px 8px; font-size:11px;" onclick="duyetDon(${idx})">Duyệt Đơn</button>`
                        : `<span style="color:#64748b; font-size:12px;">Đã xử lý xong</span>`
                    }
                </td>
            </tr>`;
    });
}

function themYeuCauChuyen() {
    const mssv = document.getElementById("cp-mssv").value;
    const loaiNV = document.getElementById("cp-loai").value;
    const phongMoi = document.getElementById("cp-phongmoi").value;

    if (!mssv) { alert("Vui lòng chọn sinh viên làm đơn!"); return; }

    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const sv = students.find(s => s.mssv === mssv);

    if (loaiNV === "Chuyển phòng" && sv.maPhong === phongMoi) {
        alert("Phòng muốn sang phải khác phòng cũ hiện tại!");
        return;
    }

    const list = getMoveRequests();
    list.push({
        mssv,
        hoTen: sv.hoTen,
        phongCu: sv.maPhong,
        loaiNV,
        phongMoi: loaiNV === "Chuyển phòng" ? phongMoi : "",
        trangThai: "Chờ duyệt"
    });

    localStorage.setItem("chuyenPhongData", JSON.stringify(list));
    renderMoveRequests();
    alert("Đã gửi đơn đăng ký của sinh viên lên Ban quản lý!");
    
    // Ghi log bảo mật tự động
    saveLog(`Sinh viên ${sv.hoTen} nộp đơn xin ${loaiNV.toLowerCase()}`);
}

function duyetDon(idx) {
    const list = getMoveRequests();
    const don = list[idx];
    don.trangThai = "Đã duyệt";

    // Cập nhật trực tiếp phòng mới vào hồ sơ gốc sinh viên nếu là đơn chuyển phòng
    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const svIdx = students.findIndex(s => s.mssv === don.mssv);

    if (svIdx !== -1) {
        if (don.loaiNV === "Chuyển phòng") {
            students[svIdx].maPhong = don.phongMoi;
            saveLog(`Phê duyệt đơn: Chuyển SV ${don.hoTen} sang phòng ${don.phongMoi}`);
        } else if (don.loaiNV === "Trả phòng") {
            // Trả phòng thì xóa sinh viên khỏi danh sách nội trú luôn
            students.splice(svIdx, 1);
            saveLog(`Phê duyệt đơn: Làm thủ tục trả phòng và xóa tên SV ${don.hoTen}`);
        }
        localStorage.setItem("sinhVienData", JSON.stringify(students));
    }

    localStorage.setItem("chuyenPhongData", JSON.stringify(list));
    renderMoveRequests();
    alert("Ban quản lý đã phê duyệt và cập nhật chỗ ở của sinh viên thành công!");
}

// Hàm phụ để đồng bộ nhật ký log bảo mật
function saveLog(action) {
    const logs = JSON.parse(localStorage.getItem("systemLogs")) || [];
    const now = new Date();
    const timeStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    const user = JSON.parse(sessionStorage.getItem("currentUser")) || { username: "Hệ thống", role: "Tự động" };
    logs.push({ time: timeStr, user: user.username, role: user.role, action: action });
    localStorage.setItem("systemLogs", JSON.stringify(logs));
}

window.onload = function() { loadCpData(); renderMoveRequests(); }