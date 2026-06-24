if (!localStorage.getItem("hoaDonData")) {
    const danhSachHDMau = [
        { maPhong: "A101", thang: "2026-06", tienDien: 150000, tienNuoc: 80000, trangThai: "Chưa thanh toán" },
        { maPhong: "A102", thang: "2026-06", tienDien: 210000, tienNuoc: 95000, trangThai: "Đã thanh toán" }
    ];
    localStorage.setItem("hoaDonData", JSON.stringify(danhSachHDMau));
}

function getBills() { return JSON.parse(localStorage.getItem("hoaDonData")) || []; }

function loadBillRoomSelect() {
    const selectPhong = document.getElementById("bill-maPhong");
    if (!selectPhong) return;
    const phongData = JSON.parse(localStorage.getItem("phongData")) || [
        { maPhong: "A101" }, { maPhong: "A102" }, { maPhong: "B201" }
    ];
    selectPhong.innerHTML = "";
    phongData.forEach(p => {
        selectPhong.innerHTML += `<option value="${p.maPhong}">${p.maPhong}</option>`;
    });
}

function renderBills() {
    const billTableBody = document.getElementById("bill-table-body");
    if (!billTableBody) return;

    const bills = getBills();
    billTableBody.innerHTML = "";

    bills.forEach((bill, index) => {
        const tongTien = parseInt(bill.tienDien) + parseInt(bill.tienNuoc);
        const statusClass = bill.trangThai === "Đã thanh toán" ? "badge-paid" : "badge-unpaid";
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><b>${bill.maPhong}</b></td>
            <td>${bill.thang}</td>
            <td>${parseInt(bill.tienDien).toLocaleString()} đ</td>
            <td>${parseInt(bill.tienNuoc).toLocaleString()} đ</td>
            <td><b style="color: #2563eb;">${tongTien.toLocaleString()} đ</b></td>
            <td><span class="badge ${statusClass}">${bill.trangThai}</span></td>
            <td>
                ${bill.trangThai === "Chưa thanh toán" 
                    ? `<button class="btn" style="background-color: #10b981; padding: 5px 10px; font-size: 12px;" onclick="payBill(${index})">Thanh toán</button>` 
                    : `<span style="color: #64748b; font-size: 12px;">Đóng đủ</span>`
                }
            </td>
        `;
        billTableBody.appendChild(row);
    });
}

function lapHoaDon() {
    const maPhong = document.getElementById("bill-maPhong").value;
    const thang = document.getElementById("bill-thang").value;
    const tienDien = document.getElementById("tienDien").value;
    const tienNuoc = document.getElementById("tienNuoc").value;

    if (!thang || !tienDien || !tienNuoc) {
        alert("Vui lòng điền đủ thông tin hóa đơn!");
        return;
    }

    const bills = getBills();
    if (bills.some(b => b.maPhong === maPhong && b.thang === thang)) {
        alert(`Phòng ${maPhong} đã có hóa đơn tháng ${thang}!`);
        return;
    }

    bills.push({ maPhong, thang, tienDien, tienNuoc, trangThai: "Chưa thanh toán" });
    localStorage.setItem("hoaDonData", JSON.stringify(bills));
    
    document.getElementById("tienDien").value = "";
    document.getElementById("tienNuoc").value = "";
    renderBills();
    alert("Lập hóa đơn thành công!");
}

function payBill(index) {
    const bills = getBills();
    bills[index].trangThai = "Đã thanh toán";
    localStorage.setItem("hoaDonData", JSON.stringify(bills));
    renderBills();
    alert("Thanh toán thành công!");
}

window.onload = function() {
    loadBillRoomSelect();
    renderBills();
};