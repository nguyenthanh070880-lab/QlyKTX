if (!localStorage.getItem("sinhVienData")) {
    const mauSV = [
        { mssv: "2401010006", hoTen: "Lê Văn A", maPhong: "A102" }
    ];
    localStorage.setItem("sinhVienData", JSON.stringify(mauSV));
}
// Các hàm xử lý CRUD sinh viên của bồ giữ nguyên ở dưới...
function getStudents() { return JSON.parse(localStorage.getItem("sinhVienData")) || []; }
function getRooms() { return JSON.parse(localStorage.getItem("phongData")) || []; }

// Đổ danh sách phòng vào ô Select để chọn khi thêm sinh viên
function loadRoomsToSelect() {
    const select = document.getElementById("sv-phong");
    if (!select) return;
    const rooms = getRooms();
    select.innerHTML = "";
    if (rooms.length === 0) {
        select.innerHTML = `<option value="">Chưa có phòng</option>`;
        return;
    }
    rooms.forEach(r => {
        select.innerHTML += `<option value="${r.maPhong}">${r.maPhong}</option>`;
    });
}

function renderStudents() {
    const body = document.getElementById("sv-table-body");
    if (!body) return;
    body.innerHTML = "";
    const list = getStudents();

    if (list.length === 0) {
        body.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#94a3b8;">Danh sách sinh viên trống</td></tr>`;
        return;
    }

    list.forEach((s, idx) => {
        body.innerHTML += `
            <tr>
                <td>${s.mssv}</td>
                <td><b>${s.hoTen}</b></td>
                <td><span style="background:#dbeafe; color:#1e40af; padding:3px 6px; border-radius:4px; font-weight:bold;">${s.maPhong}</span></td>
                <td>
                    <button class="btn" style="background:#ef4444; padding:4px 8px; font-size:11px;" onclick="xoaSinhVien(${idx})">Xóa</button>
                </td>
            </tr>`;
    });
}

function themSinhVien() {
    const mssv = document.getElementById("sv-mssv").value.trim();
    const hoTen = document.getElementById("sv-hoTen").value.trim();
    const maPhong = document.getElementById("sv-phong").value;

    if (!mssv || !hoTen || !maPhong) { alert("Vui lòng điền đầy đủ thông tin!"); return; }

    const list = getStudents();
    // Kiểm tra trùng MSSV
    if (list.some(s => s.mssv === mssv)) { alert("Mã số sinh viên này đã tồn tại!"); return; }

    list.push({ mssv, hoTen, maPhong });
    localStorage.setItem("sinhVienData", JSON.stringify(list));

    document.getElementById("sv-mssv").value = "";
    document.getElementById("sv-hoTen").value = "";
    renderStudents();
    alert("Thêm sinh viên thành công!");
}

function xoaSinhVien(idx) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
        const list = getStudents().filter((_, i) => i !== idx);
        localStorage.setItem("sinhVienData", JSON.stringify(list));
        renderStudents();
    }
}

window.onload = function() { loadRoomsToSelect(); renderStudents(); }