if (!localStorage.getItem("phongData")) {
    const danhSachPhongMau = [
        { maPhong: "A101", loaiPhong: "6 Giường" },
        { maPhong: "A102", loaiPhong: "6 Giường" },
        { maPhong: "B201", loaiPhong: "4 Giường" }
    ];
    localStorage.setItem("phongData", JSON.stringify(danhSachPhongMau));
}

function getRooms() { return JSON.parse(localStorage.getItem("phongData")) || []; }
function getStudents() { return JSON.parse(localStorage.getItem("sinhVienData")) || []; }

function renderRooms() {
    const roomTableBody = document.getElementById("room-table-body");
    if (!roomTableBody) return;

    const rooms = getRooms();
    const students = getStudents();
    roomTableBody.innerHTML = "";

    rooms.forEach(room => {
        // TỰ ĐỘNG ĐẾM SỐ SINH VIÊN THUỘC PHÒNG NÀY
        const soNguoiThucTe = students.filter(sv => sv.maPhong === room.maPhong).length;
        const sucChuaToiDa = parseInt(room.loaiPhong) || 6;

        let trangThai = "Còn trống";
        let statusClass = "badge-success";
        if (soNguoiThucTe >= sucChuaToiDa) {
            trangThai = "Đã đầy";
            statusClass = "badge-danger";
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><b>${room.maPhong}</b></td>
            <td>${room.loaiPhong}</td>
            <td><b style="color: #2563eb;">${soNguoiThucTe}</b> / ${sucChuaToiDa} thành viên</td>
            <td><span class="badge ${statusClass}">${trangThai}</span></td>
            <td><button class="btn btn-delete" onclick="xoaPhong('${room.maPhong}')">Xóa</button></td>
        `;
        roomTableBody.appendChild(row);
    });
}

function themPhong() {
    const maPhong = document.getElementById("maPhong").value.trim().toUpperCase();
    const loaiPhong = document.getElementById("loaiPhong").value;

    if (!maPhong) {
        alert("Vui lòng nhập mã phòng!");
        return;
    }

    const rooms = getRooms();
    if (rooms.some(r => r.maPhong === maPhong)) {
        alert("Mã phòng này đã tồn tại!");
        return;
    }

    rooms.push({ maPhong, loaiPhong });
    localStorage.setItem("phongData", JSON.stringify(rooms));
    document.getElementById("maPhong").value = "";
    renderRooms();
    alert("Thêm phòng thành công!");
}

function xoaPhong(maPhong) {
    if (confirm(`Xóa phòng ${maPhong}?`)) {
        let rooms = getRooms().filter(r => r.maPhong !== maPhong);
        localStorage.setItem("phongData", JSON.stringify(rooms));
        renderRooms();
    }
}

window.onload = function() { renderRooms(); };