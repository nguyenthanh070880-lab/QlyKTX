if (!localStorage.getItem("phongData")) {
    const danhSachPhongMau = [
        { maPhong: "A101", loaiPhong: "6 Giường", soNguoi: 6, trangThai: "Đã đầy" },
        { maPhong: "A102", loaiPhong: "6 Giường", soNguoi: 4, trangThai: "Còn trống" },
        { maPhong: "B201", loaiPhong: "4 Giường", soNguoi: 2, trangThai: "Còn trống" }
    ];
    localStorage.setItem("phongData", JSON.stringify(danhSachPhongMau));
}

function getRooms() {
    return JSON.parse(localStorage.getItem("phongData")) || [];
}

function renderRooms() {
    const roomTableBody = document.getElementById("room-table-body");
    if (!roomTableBody) return;

    const rooms = getRooms();
    roomTableBody.innerHTML = "";

    rooms.forEach(room => {
        const statusClass = room.trangThai === "Còn trống" ? "badge-success" : "badge-danger";
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><b>${room.maPhong}</b></td>
            <td>${room.loaiPhong}</td>
            <td>${room.soNguoi} thành viên</td>
            <td><span class="badge ${statusClass}">${room.trangThai}</span></td>
            <td><button class="btn btn-delete" onclick="xoaPhong('${room.maPhong}')">Xóa</button></td>
        `;
        roomTableBody.appendChild(row);
    });
}

function themPhong() {
    const maPhong = document.getElementById("maPhong").value.trim().toUpperCase();
    const loaiPhong = document.getElementById("loaiPhong").value;
    const soNguoi = document.getElementById("soNguoi").value;
    const trangThai = document.getElementById("trangThai").value;

    if (!maPhong) {
        alert("Vui lòng nhập mã phòng!");
        return;
    }

    const rooms = getRooms();
    if (rooms.some(r => r.maPhong === maPhong)) {
        alert("Mã phòng này đã tồn tại!");
        return;
    }

    rooms.push({ maPhong, loaiPhong, soNguoi, trangThai });
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

window.onload = function() {
    renderRooms();
};