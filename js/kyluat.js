if (!localStorage.getItem("kyLuatData")) {
    const mauKL = [
        { mssv: "2401010249", hoTen: "Đỗ Đặng Hữu Quốc", maPhong: "A102", ngay: "2026-06-20", loi: "Về muộn sau 23h" }
    ];
    localStorage.setItem("kyLuatData", JSON.stringify(mauKL));
}

function getKyLuat() { return JSON.parse(localStorage.getItem("kyLuatData")) || []; }

function loadKlStudents() {
    const select = document.getElementById("kl-mssv");
    if(!select) return;
    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    select.innerHTML = "";
    students.forEach(s => {
        select.innerHTML += `<option value="${s.mssv}">${s.mssv} - ${s.hoTen} (${s.maPhong})</option>`;
    });
}

function renderKyLuat() {
    const body = document.getElementById("kl-table-body");
    if(!body) return;
    body.innerHTML = "";
    getKyLuat().forEach((k, idx) => {
        body.innerHTML += `
            <tr>
                <td>${k.mssv}</td>
                <td><b>${k.hoTen}</b></td>
                <td><span style="background:#fef3c7;color:#92400e;padding:3px 6px;border-radius:4px;">${k.maPhong}</span></td>
                <td>${k.ngay}</td>
                <td style="color:#ef4444;font-weight:500;">${k.loi}</td>
                <td><button class="btn" style="padding:4px 8px;font-size:11px;" onclick="xoaKL(${idx})">Hủy biên bản</button></td>
            </tr>`;
    });
}

function themKyLuat() {
    const mssv = document.getElementById("kl-mssv").value;
    const ngay = document.getElementById("kl-ngay").value;
    const loi = document.getElementById("kl-loi").value;

    if(!ngay) { alert("Vui lòng chọn ngày vi phạm!"); return; }
    
    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const svTarget = students.find(s => s.mssv === mssv);
    
    if(!svTarget) { alert("Dữ liệu sinh viên không hợp lệ!"); return; }

    const kl = getKyLuat();
    kl.push({ mssv, hoTen: svTarget.hoTen, maPhong: svTarget.maPhong, ngay, loi });
    localStorage.setItem("kyLuatData", JSON.stringify(kl));
    renderKyLuat();
    alert("Đã ghi nhận vi phạm!");
}

function xoaKL(idx) {
    if(confirm("Xóa lỗi vi phạm này?")) {
        const kl = getKyLuat().filter((_, i) => i !== idx);
        localStorage.setItem("kyLuatData", JSON.stringify(kl));
        renderKyLuat();
    }
}

window.onload = function() { loadKlStudents(); renderKyLuat(); }