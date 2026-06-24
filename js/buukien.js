// Khởi tạo dữ liệu mẫu nếu LocalStorage chưa có dữ liệu bưu kiện nào
if (!localStorage.getItem("buuKienData")) {
    const mauBK = [
        { 
            maVanDon: "SPX99881122", 
            dv: "Shopee Xpress", 
            mssv: "2401010006", 
            hoTen: "Lê Văn A", 
            trangThai: "Chờ lấy" 
        }
    ];
    localStorage.setItem("buuKienData", JSON.stringify(mauBK));
}

// Hàm lấy dữ liệu bưu kiện từ LocalStorage
function getParcels() {
    return JSON.parse(localStorage.getItem("buuKienData")) || [];
}

// Đổ danh sách sinh viên hiện có vào thẻ <select> để chọn người nhận bưu kiện
function loadStudentsToParcelSelect() {
    const select = document.getElementById("bk-mssv");
    if (!select) return;
    
    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    select.innerHTML = "";
    
    if (students.length === 0) {
        select.innerHTML = "<option value=''>Chưa có dữ liệu sinh viên</option>";
        return;
    }
    
    students.forEach(s => {
        select.innerHTML += `<option value="${s.mssv}">${s.mssv} - ${s.hoTen}</option>`;
    });
}

// Hiển thị danh sách bưu kiện ra bảng giao diện
function renderParcels() {
    const body = document.getElementById("buukien-table-body");
    if (!body) return;
    body.innerHTML = "";
    
    const list = getParcels();
    list.forEach((b, idx) => {
        const cls = b.trangThai === "Chờ lấy" ? "badge-waiting" : "badge-received";
        body.innerHTML += `
            <tr>
                <td><code style="color:#a855f7; font-weight:bold;">${b.maVanDon}</code></td>
                <td>${b.dv}</td>
                <td>${b.mssv}</td>
                <td><b>${b.hoTen}</b></td>
                <td><span class="badge ${cls}">${b.trangThai}</span></td>
                <td>
                    ${b.trangThai === "Chờ lấy" 
                        ? `<button class="btn" style="background:#10b981; padding:4px 8px; font-size:11px;" onclick="kyNhanBuuKien(${idx})">Ký Nhận</button>` 
                        : `<span style="color:#64748b; font-size:12px;">✔️ Đã phát</span>`
                    }
                </td>
            </tr>`;
    });
}

// Thêm mới một bưu kiện vào kho lưu trữ
function themBuuKien() {
    const maVanDon = document.getElementById("bk-mavandon").value.trim().toUpperCase();
    const dv = document.getElementById("bk-dv").value.trim();
    const mssv = document.getElementById("bk-mssv").value;

    if (!maVanDon || !dv || !mssv) {
        alert("Vui lòng nhập đầy đủ mã vận đơn và đơn vị vận chuyển!");
        return;
    }

    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const sv = students.find(s => s.mssv === mssv);
    
    if (!sv) {
        alert("Không tìm thấy thông tin sinh viên này!");
        return;
    }

    const list = getParcels();
    
    // Kiểm tra xem mã vận đơn này đã có trong kho chưa (tránh trùng)
    if (list.some(b => b.maVanDon === maVanDon && b.trangThai === "Chờ lấy")) {
        alert("Mã vận đơn này hiện đang nằm trong kho chờ lấy rồi bồ ơi!");
        return;
    }

    // Thêm bưu kiện mới vào mảng dữ liệu
    list.push({ 
        maVanDon, 
        dv, 
        mssv, 
        hoTen: sv.hoTen, 
        trangThai: "Chờ lấy" 
    });
    
    localStorage.setItem("buuKienData", JSON.stringify(list));
    
    // Reset lại ô nhập
    document.getElementById("bk-mavandon").value = "";
    document.getElementById("bk-dv").value = "";
    
    renderParcels();
    alert(`Đăng ký bưu kiện thành công cho sinh viên ${sv.hoTen}!`);
}

// Cập nhật trạng thái khi sinh viên tới lấy đồ
function kyNhanBuuKien(idx) {
    const list = getParcels();
    list[idx].trangThai = "Đã lấy";
    localStorage.setItem("buuKienData", JSON.stringify(list));
    renderParcels();
    alert("Xác nhận: Sinh viên đã ký và nhận bưu phẩm thành công!");
}

// Khởi chạy hệ thống nạp dữ liệu khi load trang
window.onload = function() {
    loadStudentsToParcelSelect();
    renderParcels();
}