if (!localStorage.getItem("guiXeData")) {
    const mauXe = [
        { mssv: "2401010006", hoTen: "Lê Văn A", loaiXe: "Exciter 150", bienSo: "49G1-99999", phi: "50000", tinhTrang: "Chưa đóng" }
    ];
    localStorage.setItem("guiXeData", JSON.stringify(mauXe));
}

function getBikes() { return JSON.parse(localStorage.getItem("guiXeData")) || []; }

function loadBikeStudents() {
    const select = document.getElementById("xe-mssv");
    if(!select) return;
    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    select.innerHTML = "";
    if (students.length === 0) {
        select.innerHTML = `<option value="">Chưa có dữ liệu sinh viên</option>`;
        return;
    }
    students.forEach(s => {
        select.innerHTML += `<option value="${s.mssv}">${s.mssv} - ${s.hoTen}</option>`;
    });
}

function renderBikes() {
    const body = document.getElementById("xe-table-body");
    if(!body) return;
    body.innerHTML = "";
    const listXe = getBikes();

    if(listXe.length === 0) {
        body.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8;">Bãi giữ xe hiện tại trống</td></tr>`;
        return;
    }

    listXe.forEach((x, idx) => {
        const cls = x.tinhTrang === "Đã đóng" ? "badge-paid" : "badge-unpaid";
        body.innerHTML += `
            <tr>
                <td>${x.mssv}</td>
                <td><b>${x.hoTen}</b></td>
                <td>${x.loaiXe}</td>
                <td><b style="color: #047857;">${x.bienSo}</b></td>
                <td>${parseInt(x.phi).toLocaleString()} đ</td>
                <td><span class="badge ${cls}">${x.tinhTrang}</span></td>
                <td>
                    ${x.tinhTrang === "Chưa đóng"
                        ? `<button class="btn" style="background:#10b981;padding:4px 8px;font-size:11px;" onclick="dongTienXe(${idx})">Thu Tiền</button>`
                        : `<span style="color:#64748b;font-size:12px;">Đã hoàn thành</span>`
                    }
                    <button class="btn" style="background:#ef4444;padding:4px 8px;font-size:11px;margin-left:5px;" onclick="xoaXe(${idx})">Hủy Vé</button>
                </td>
            </tr>`;
    });
}

function themXe() {
    const mssv = document.getElementById("xe-mssv").value;
    const loaiXe = document.getElementById("loaiXe").value.trim();
    const bienSo = document.getElementById("bienSo").value.trim().toUpperCase();
    const phi = document.getElementById("phiGui").value;

    if(!mssv) { alert("Vui lòng thêm sinh viên trước khi đăng ký giữ xe!"); return; }
    if(!loaiXe || !bienSo) { alert("Vui lòng điền đủ loại xe và biển số xe!"); return; }
    
    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const sv = students.find(s => s.mssv === mssv);

    const bikes = getBikes();
    bikes.push({ mssv, hoTen: sv.hoTen, loaiXe, bienSo, phi, tinhTrang: "Chưa đóng" });
    localStorage.setItem("guiXeData", JSON.stringify(bikes));
    
    document.getElementById("loaiXe").value = "";
    document.getElementById("bienSo").value = "";
    renderBikes();
    alert("Đăng ký vé xe tháng thành công!");
}

function dongTienXe(idx) {
    const bikes = getBikes();
    bikes[idx].tinhTrang = "Đã đóng";
    localStorage.setItem("guiXeData", JSON.stringify(bikes));
    renderBikes();
    alert("Thu tiền gửi xe thành công!");
}

function xoaXe(idx) {
    if(confirm("Bạn có chắc chắn muốn hủy thẻ giữ xe của sinh viên này?")) {
        const bikes = getBikes().filter((_, i) => i !== idx);
        localStorage.setItem("guiXeData", JSON.stringify(bikes));
        renderBikes();
    }
}

window.onload = function() { loadBikeStudents(); renderBikes(); }