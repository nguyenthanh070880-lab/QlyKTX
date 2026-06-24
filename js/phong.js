if (!localStorage.getItem("phongData")) {
    const mauPhong = [
        { maPhong: "A101", loaiPhong: "Phòng 4 Người", giaPhong: 400000 },
        { maPhong: "A102", loaiPhong: "Phòng 6 Người", giaPhong: 300000 }
    ];
    localStorage.setItem("phongData", JSON.stringify(mauPhong));
}

function getRooms() { return JSON.parse(localStorage.getItem("phongData")) || []; }

function renderRooms() {
    const body = document.getElementById("phong-table-body");
    if (!body) return; body.innerHTML = "";
    getRooms().forEach((p, idx) => {
        body.innerHTML += `
            <tr>
                <td><b>${p.maPhong}</b></td>
                <td>${p.loaiPhong}</td>
                <td><b style="color:#059669;">${Number(p.giaPhong).toLocaleString()} đ</b></td>
                <td><button class="btn" style="background:#ef4444; padding:4px 8px; font-size:11px;" onclick="xoaPhong(${idx})">Xóa</button></td>
            </tr>`;
    });
}

function themPhong() {
    const maPhong = document.getElementById("p-maphong").value.trim().toUpperCase();
    const loaiPhong = document.getElementById("p-loaiphong").value;
    const giaPhong = parseInt(document.getElementById("p-gia").value) || 0;

    if (!maPhong || giaPhong <= 0) { alert("Vui lòng điền mã phòng và giá phòng hợp lệ!"); return; }
    const list = getRooms();
    if (list.some(p => p.maPhong === maPhong)) { alert("Mã phòng này đã tồn tại trên hệ thống!"); return; }

    list.push({ maPhong, loaiPhong, giaPhong });
    localStorage.setItem("phongData", JSON.stringify(list));
    document.getElementById("p-maphong").value = "";
    document.getElementById("p-gia").value = "";
    renderRooms();
    alert("Thêm phòng mới thành công!");
}

function xoaPhong(idx) {
    if (confirm("Bạn có chắc chắn muốn xóa phòng này không?")) {
        const list = getRooms();
        list.splice(idx, 1);
        localStorage.setItem("phongData", JSON.stringify(list));
        renderRooms();
    }
}
window.onload = function() { renderRooms(); }