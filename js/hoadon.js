if (!localStorage.getItem("hoaDonData")) {
    const mauHD = [
        { maPhong: "A101", tien: "1250000", trangThai: "Chưa thanh toán" },
        { maPhong: "A102", tien: "950000", trangThai: "Đã thanh toán" }
    ];
    localStorage.setItem("hoaDonData", JSON.stringify(mauHD));
}

function getBills() { return JSON.parse(localStorage.getItem("hoaDonData")) || []; }

function loadRoomsToSelect() {
    const select = document.getElementById("hd-phong");
    if (!select) return;
    const rooms = JSON.parse(localStorage.getItem("phongData")) || [];
    select.innerHTML = "";
    rooms.forEach(r => select.innerHTML += `<option value="${r.maPhong}">${r.maPhong}</option>`);
}

function renderBills() {
    const body = document.getElementById("hd-table-body");
    if (!body) return;
    body.innerHTML = "";
    
    getBills().forEach((b, idx) => {
        const cls = b.trangThai === "Đã thanh toán" ? "badge-paid" : "badge-unpaid";
        body.innerHTML += `
            <tr>
                <td><b>${b.maPhong}</b></td>
                <td><b style="color:#b45309;">${parseInt(b.tien).toLocaleString()} đ</b></td>
                <td><span class="badge ${cls}">${b.trangThai}</span></td>
                <td>
                    ${b.trangThai === "Chưa thanh toán" 
                        ? `<button class="btn" style="background:#10b981; padding:4px 8px; font-size:11px;" onclick="thanhToanHD(${idx})">Thanh Toán</button>` 
                        : `<span style="color:#64748b; font-size:12px;">Hoàn thành</span>`
                    }
                    <button class="btn" style="background:#ef4444; padding:4px 8px; font-size:11px; margin-left:5px;" onclick="xoaHD(${idx})">Xóa</button>
                </td>
            </tr>`;
    });
}

function themHoaDon() {
    const maPhong = document.getElementById("hd-phong").value;
    const tien = document.getElementById("hd-tien").value.trim();

    if (!maPhong || !tien) { alert("Vui lòng điền số tiền!"); return; }

    const list = getBills();
    list.push({ maPhong, tien, trangThai: "Chưa thanh toán" });
    localStorage.setItem("hoaDonData", JSON.stringify(list));

    document.getElementById("hd-tien").value = "";
    renderBills();
    alert("Tạo hóa đơn tháng thành công!");
}

function thanhToanHD(idx) {
    const list = getBills();
    list[idx].trangThai = "Đã thanh toán";
    localStorage.setItem("hoaDonData", JSON.stringify(list));
    renderBills();
    alert("Cập nhật trạng thái thanh toán thành công!");
}

function xoaHD(idx) {
    if (confirm("Xóa hóa đơn này?")) {
        const list = getBills().filter((_, i) => i !== idx);
        localStorage.setItem("hoaDonData", JSON.stringify(list));
        renderBills();
    }
}

window.onload = function() { loadRoomsToSelect(); renderBills(); }