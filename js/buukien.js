if (!localStorage.getItem("buuKienData")) {
    const mauBK = [
        { mssv: "2401010249", hoTen: "Đỗ Đặng Hữu Quốc", maPhong: "A102", maVanDon: "SPX99881122", dv: "Shopee Xpress", trangThai: "Chờ lấy" }
    ];
    localStorage.setItem("buuKienData", JSON.stringify(mauBK));
}

function getParcels() { return JSON.parse(localStorage.getItem("buuKienData")) || []; }

function loadBkStudents() {
    const select = document.getElementById("bk-mssv");
    if(!select) return;
    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    select.innerHTML = "";
    if (students.length === 0) {
        select.innerHTML = `<option value="">Chưa có dữ liệu sinh viên</option>`;
        return;
    }
    students.forEach(s => {
        select.innerHTML += `<option value="${s.mssv}">${s.mssv} - ${s.hoTen} (${s.maPhong})</option>`;
    });
}

function renderParcels() {
    const body = document.getElementById("bk-table-body");
    if(!body) return;
    body.innerHTML = "";
    const listBK = getParcels();

    if(listBK.length === 0) {
        body.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8;">Kho bưu kiện trống</td></tr>`;
        return;
    }

    listBK.forEach((p, idx) => {
        const cls = p.trangThai === "Chờ lấy" ? "badge-waiting" : "badge-done";
        body.innerHTML += `
            <tr>
                <td>${p.mssv}</td>
                <td><b>${p.hoTen}</b></td>
                <td><span style="background:#f3e8ff;color:#6b21a8;padding:3px 6px;border-radius:4px;font-weight:bold;">${p.maPhong}</span></td>
                <td><code>${p.maVanDon}</code></td>
                <td>${p.dv}</td>
                <td><span class="badge ${cls}">${p.trangThai}</span></td>
                <td>
                    ${p.trangThai === "Chờ lấy"
                        ? `<button class="btn" style="background:#10b981;padding:4px 8px;font-size:11px;" onclick="daLayHang(${idx})">Đã Phát</button>`
                        : `<button class="btn" style="background:#ef4444;padding:4px 8px;font-size:11px;" onclick="xoaBK(${idx})">Xóa</button>`
                    }
                </td>
            </tr>`;
    });
}

function themBuuKien() {
    const mssv = document.getElementById("bk-mssv").value;
    const maVanDon = document.getElementById("maVanDon").value.trim().toUpperCase();
    const dv = document.getElementById("donViVc").value;

    if(!mssv) { alert("Vui lòng chọn sinh viên trước!"); return; }
    if(!maVanDon) { alert("Vui lòng nhập mã vận đơn hoặc thông tin kiện hàng!"); return; }

    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const sv = students.find(s => s.mssv === mssv);

    const list = getParcels();
    list.push({ mssv, hoTen: sv.hoTen, maPhong: sv.maPhong, maVanDon, dv, trangThai: "Chờ lấy" });
    localStorage.setItem("buuKienData", JSON.stringify(list));
    
    document.getElementById("maVanDon").value = "";
    renderParcels();
    alert("Đã ghi nhận kiện hàng gửi hộ!");
}

function daLayHang(idx) {
    const list = getParcels();
    list[idx].trangThai = "Đã nhận";
    localStorage.setItem("buuKienData", JSON.stringify(list));
    renderParcels();
    alert("Xác nhận sinh viên đã lấy đồ thành công!");
}

function xoaBK(idx) {
    if(confirm("Xóa lịch sử bưu kiện này?")) {
        const list = getParcels().filter((_, i) => i !== idx);
        localStorage.setItem("buuKienData", JSON.stringify(list));
        renderParcels();
    }
}

window.onload = function() { loadBkStudents(); renderParcels(); }