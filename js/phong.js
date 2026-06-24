if (!localStorage.getItem("phongData")) {
    const mauPhong = [
        { maPhong: "A101", loaiPhong: "4 Giường", sucChua: 4 },
        { maPhong: "A102", loaiPhong: "6 Giường", sucChua: 6 }
    ];
    localStorage.setItem("phongData", JSON.stringify(mauPhong));
}

function getRooms() { return JSON.parse(localStorage.getItem("phongData")) || []; }

function renderRooms() {
    const body = document.getElementById("phong-table-body");
    if (!body) return;
    body.innerHTML = "";
    const list = getRooms();

    list.forEach((r, idx) => {
        body.innerHTML += `
            <tr>
                <td><b>${r.maPhong}</b></td>
                <td>${r.loaiPhong}</td>
                <td>${r.sucChua} Người</td>
                <td>
                    <button class="btn" style="background:#ef4444; padding:4px 8px; font-size:11px;" onclick="xoaPhong(${idx})">Xóa</button>
                </td>
            </tr>`;
    });
}

function themPhong() {
    const maPhong = document.getElementById("p-maPhong").value.trim().toUpperCase();
    const loaiPhong = document.getElementById("p-loaiPhong").value;
    let sucChua = 4;
    if (loaiPhong === "6 Giường") sucChua = 6;
    if (loaiPhong === "8 Giường") sucChua = 8;

    if (!maPhong) { alert("Vui lòng nhập mã phòng!"); return; }

    const list = getRooms();
    if (list.some(r => r.maPhong === maPhong)) { alert("Mã phòng này đã tồn tại!"); return; }

    list.push({ maPhong, loaiPhong, sucChua });
    localStorage.setItem("phongData", JSON.stringify(list));

    document.getElementById("p-maPhong").value = "";
    renderRooms();
    alert("Thêm phòng mới thành công!");
}

function xoaPhong(idx) {
    if (confirm("Xóa phòng này có thể ảnh hưởng đến dữ liệu sinh viên ở trong phòng. Bạn vẫn muốn xóa chứ?")) {
        const list = getRooms().filter((_, i) => i !== idx);
        localStorage.setItem("phongData", JSON.stringify(list));
        renderRooms();
    }
}

window.onload = function() { renderRooms(); }