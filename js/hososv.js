window.onload = function() {
    initProfileData();
    loadStudentSelect();
    loadStudentProfile();
}

function initProfileData() {
    if (!localStorage.getItem("sinhVienChiTietData")) {
        const chiTietSV = [
            { mssv: "2401010006", ngaySinh: "2006-05-20", gioiTinh: "Nam", queQuan: "Đà Lạt, Lâm Đồng", sdt: "0987654321", lop: "CNTT K24", ngayVaoKTX: "2026-02-01" }
        ];
        localStorage.setItem("sinhVienChiTietData", JSON.stringify(chiTietSV));
    }
}

function loadStudentSelect() {
    const select = document.getElementById("select-sv-profile");
    if (!select) return;
    const listSV = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    select.innerHTML = "";
    if (listSV.length === 0) { select.innerHTML = "<option value=''>Không có dữ liệu sinh viên</option>"; return; }
    listSV.forEach(s => select.innerHTML += `<option value="${s.mssv}">${s.mssv} - ${s.hoTen}</option>`);
}

function loadStudentProfile() {
    const mssvSelected = document.getElementById("select-sv-profile").value;
    const container = document.getElementById("profile-content");
    if (!container) return;
    if (!mssvSelected) { container.innerHTML = "<p style='color:#64748b;'>Vui lòng thêm sinh viên tra cứu.</p>"; return; }

    const listSV = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const listChiTiet = JSON.parse(localStorage.getItem("sinhVienChiTietData")) || [];
    const listXe = JSON.parse(localStorage.getItem("guiXeData")) || [];
    const listBuuKien = JSON.parse(localStorage.getItem("buuKienData")) || [];
    const listKyLuat = JSON.parse(localStorage.getItem("kyLuatData")) || [];

    const svCoBan = listSV.find(s => s.mssv === mssvSelected);
    let svNangCao = listChiTiet.find(s => s.mssv === mssvSelected);

    if (!svNangCao && svCoBan) {
        svNangCao = { mssv: svCoBan.mssv, ngaySinh: "Chưa cập nhật", gioiTinh: "Chưa rõ", queQuan: "Chưa cập nhật", sdt: "Chưa cập nhật", lop: "Chưa cập nhật", ngayVaoKTX: "Mới đăng ký" };
    }

    const thongTinXe = listXe.find(x => x.mssv === mssvSelected);
    const thongTinBK = listBuuKien.filter(b => b.mssv === mssvSelected);
    const thongTinKL = listKyLuat.filter(k => k.mssv === mssvSelected);

    let chuoiXe = thongTinXe ? `🏍️ <b>Loại xe:</b> ${thongTinXe.loaiXe} | <b>Biển số:</b> ${thongTinXe.bienSo} <br>Phí xe: <b>${thongTinXe.tinhTrang}</b>` : "❌ Không đăng ký gửi xe máy";
    let chuoiBK = "";
    if (thongTinBK.length === 0) chuoiBK = "📦 Không có bưu kiện";
    else thongTinBK.forEach(b => chuoiBK += `<div>• ${b.maVanDon} (${b.dv}) - ${b.trangThai}</div>`);

    let chuoiKL = "";
    if (thongTinKL.length === 0) chuoiKL = "✅ Lý lịch sạch sẽ, không vi phạm nội quy";
    else thongTinKL.forEach(k => chuoiKL += `<div style="color:#ef4444;">⚠️ Ngày ${k.ngay}: Lỗi "${k.loi}"</div>`);

    container.innerHTML = `
        <div class="profile-card">
            <div class="avatar-placeholder">🎓</div>
            <h3>${svCoBan ? svCoBan.hoTen : 'Chưa rõ'}</h3><p style="color:#2563eb;font-weight:700;">MSSV: ${mssvSelected}</p>
            <div style="background:#eff6ff;padding:12px;border-radius:6px;font-weight:700;margin-bottom:15px;">🏢 Phòng: ${svCoBan ? svCoBan.maPhong : 'Chưa rõ'}</div>
            <button class="btn" style="width:100%; background:#0284c7;" onclick="openModal('${mssvSelected}')">✏️ Cập Nhật Thông Tin</button>
        </div>
        <div class="profile-details">
            <div class="section-title">📌 Lý lịch cá nhân</div>
            <div class="info-row"><span>Lớp:</span> <span>${svNangCao.lop}</span></div>
            <div class="info-row"><span>Ngày sinh:</span> <span>${svNangCao.ngaySinh}</span></div>
            <div class="info-row"><span>Số điện thoại:</span> <span>${svNangCao.sdt}</span></div>
            <div class="info-row"><span>Quê quán:</span> <span>${svNangCao.queQuan}</span></div>
            <div class="section-title">🏍️ Gửi xe máy</div><div>${chuoiXe}</div>
            <div class="section-title">📦 Bưu kiện nhận</div><div>${chuoiBK}</div>
            <div class="section-title">🚨 Kỷ luật</div><div>${chuoiKL}</div>
        </div>`;
}

// Hàm mở Hộp thoại và đổ dữ liệu cũ vào form nhập
function openModal(mssv) {
    document.getElementById("edit-mssv").value = mssv;
    const listChiTiet = JSON.parse(localStorage.getItem("sinhVienChiTietData")) || [];
    const data = listChiTiet.find(s => s.mssv === mssv);

    document.getElementById("edit-lop").value = data && data.lop !== "Chưa cập nhật" ? data.lop : "";
    document.getElementById("edit-ngaySinh").value = data && data.ngaySinh !== "Chưa cập nhật" ? data.ngaySinh : "";
    document.getElementById("edit-sdt").value = data && data.sdt !== "Chưa cập nhật" ? data.sdt : "";
    document.getElementById("edit-queQuan").value = data && data.queQuan !== "Chưa cập nhật" ? data.queQuan : "";

    document.getElementById("updateModal").style.display = "block";
}

function closeModal() {
    document.getElementById("updateModal").style.display = "none";
}

// Lưu dữ liệu cập nhật vào LocalStorage
function saveProfileData() {
    const mssv = document.getElementById("edit-mssv").value;
    const lop = document.getElementById("edit-lop").value.trim() || "Chưa cập nhật";
    const ngaySinh = document.getElementById("edit-ngaySinh").value || "Chưa cập nhật";
    const sdt = document.getElementById("edit-sdt").value.trim() || "Chưa cập nhật";
    const queQuan = document.getElementById("edit-queQuan").value.trim() || "Chưa cập nhật";

    let listChiTiet = JSON.parse(localStorage.getItem("sinhVienChiTietData")) || [];
    const idx = listChiTiet.findIndex(s => s.mssv === mssv);

    if (idx !== -1) {
        listChiTiet[idx].lop = lop;
        listChiTiet[idx].ngaySinh = ngaySinh;
        listChiTiet[idx].sdt = sdt;
        listChiTiet[idx].queQuan = queQuan;
    } else {
        listChiTiet.push({ mssv, lop, ngaySinh, sdt, queQuan, gioiTinh: "Chưa rõ", ngayVaoKTX: "Mới đăng ký" });
    }

    localStorage.setItem("sinhVienChiTietData", JSON.stringify(listChiTiet));
    closeModal();
    loadStudentProfile(); // Tải lại thông tin để hiển thị ngay lập tức
    alert("Cập nhật thông tin lý lịch sinh viên thành công!");
}