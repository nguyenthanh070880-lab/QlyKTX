// Khởi tạo dữ liệu mẫu nếu kho LocalStorage chưa có dữ liệu hóa đơn nào
if (!localStorage.getItem("hoaDonData")) {
    const mauHD = [
        { maPhong: "A102", kyHD: "2026-06", tienDien: 150000, tienNuoc: 60000, tongTien: 210000, trangThai: "Chưa thanh toán" }
    ];
    localStorage.setItem("hoaDonData", JSON.stringify(mauHD));
}

function getBills() {
    return JSON.parse(localStorage.getItem("hoaDonData")) || [];
}

// Hàm load danh sách phòng ở hiện tại vào ô select lựa chọn để lập hóa đơn
function loadRoomsToBillSelect() {
    const select = document.getElementById("hd-phong");
    if (!select) return;
    const rooms = JSON.parse(localStorage.getItem("phongData")) || [];
    select.innerHTML = "";
    
    if (rooms.length === 0) {
        select.innerHTML = "<option value=''>Chưa có dữ liệu phòng</option>";
        return;
    }
    rooms.forEach(r => {
        select.innerHTML += `<option value="${r.maPhong}">${r.maPhong}</option>`;
    });
}

// In danh sách hóa đơn ra bảng giao diện ứng dụng
function renderBills() {
    const body = document.getElementById("hd-table-body");
    if (!body) return;
    body.innerHTML = "";
    
    const list = getBills();
    list.forEach((b, idx) => {
        const cls = b.trangThai === "Chưa thanh toán" ? "badge-unpaid" : "badge-paid";
        body.innerHTML += `
            <tr>
                <td><b>${b.maPhong}</b></td>
                <td>${b.kyHD}</td>
                <td>${Number(b.tienDien).toLocaleString()} đ</td>
                <td>${Number(b.tienNuoc).toLocaleString()} đ</td>
                <td><b style="color:#b45309;">${Number(b.tongTien).toLocaleString()} đ</b></td>
                <td><span class="badge ${cls}">${b.trangThai}</span></td>
                <td>
                    ${b.trangThai === "Chưa thanh toán" 
                        ? `<button class="btn" style="background:#10b981; padding:4px 8px; font-size:11px;" onclick="thanhToanHD(${idx})">Thu Tiền</button>` 
                        : `<span style="color:#64748b; font-size:12px;">✔️ Đã tất toán</span>`
                    }
                </td>
            </tr>`;
    });
}

// Hàm thêm mới một hóa đơn
function themHoaDon() {
    const maPhong = document.getElementById("hd-phong").value;
    const kyHD = document.getElementById("hd-thang").value;
    const tienDien = parseInt(document.getElementById("hd-tiendien").value) || 0;
    const tienNuoc = parseInt(document.getElementById("hd-tiennuoc").value) || 0;

    if (!kyHD) {
        alert("Vui lòng chọn kỳ hóa đơn (tháng năm)!");
        return;
    }
    if (tienDien <= 0 || tienNuoc <= 0) {
        alert("Vui lòng nhập số tiền điện và tiền nước hợp lệ!");
        return;
    }

    const tongTien = tienDien + tienNuoc;
    const list = getBills();
    
    list.push({ maPhong, kyHD, tienDien, tienNuoc, tongTien, trangThai: "Chưa thanh toán" });
    localStorage.setItem("hoaDonData", JSON.stringify(list));
    
    // Clear dữ liệu form nhập
    document.getElementById("hd-tiendien").value = "";
    document.getElementById("hd-tiennuoc").value = "";
    
    renderBills();
    alert(`Lập hóa đơn phòng ${maPhong} thành công!`);
}

// Hàm xử lý khi cán bộ ấn nút "Thu Tiền"
function thanhToanHD(idx) {
    const list = getBills();
    list[idx].trangThai = "Đã thanh toán";
    localStorage.setItem("hoaDonData", JSON.stringify(list));
    renderBills();
    alert("Cập nhật trạng thái hóa đơn: ĐÃ ĐÓNG TIỀN thành công!");
}

window.onload = function() {
    loadRoomsToBillSelect();
    // Tự động set tháng mặc định là tháng hiện tại cho ô input month cho mượt
    const nay = new Date();
    const thang = ("0" + (nay.getMonth() + 1)).slice(-2);
    document.getElementById("hd-thang").value = `${nay.getFullYear()}-${thang}`;
    renderBills();
}