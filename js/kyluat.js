if (!localStorage.getItem("kyLuatData")) {
    const mauKL = [
        { mssv: "2401010006", hoTen: "Lê Văn A", maPhong: "A102", ngay: "2026-03-15", loi: "Về muộn sau 23h" }
    ];
    localStorage.setItem("kyLuatData", JSON.stringify(mauKL));
}
// Giữ nguyên logic lập biên bản kỷ luật cũ của bồ...
function getViolations() { return JSON.parse(localStorage.getItem("kyLuatData")) || []; }

// Đổ danh sách sinh viên vào ô Select để chọn khi lập biên bản
function loadKlStudents() {
    const select = document.getElementById("kl-mssv");
    if (!select) return;
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

function renderViolations() {
    const body = document.getElementById("kl-table-body");
    if (!body) return;
    body.innerHTML = "";
    const list = getViolations();

    if (list.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">Sổ kỷ luật trống</td></tr>`;
        return;
    }

    list.forEach((k, idx) => {
        body.innerHTML += `
            <tr>
                <td>${k.mssv}</td>
                <td><b>${k.hoTen}</b></td>
                <td><span style="background:#fee2e2; color:#991b1b; padding:3px 6px; border-radius:4px; font-weight:bold;">${k.maPhong}</span></td>
                <td>${k.ngay}</td>
                <td><b style="color:#dc2626;">${k.loi}</b></td>
                <td>
                    <button class="btn" style="background:#ef4444; padding:4px 8px; font-size:11px;" onclick="xoaKyLuat(${idx})">Xóa</button>
                </td>
            </tr>`;
    });
}

function themKyLuat() {
    const mssv = document.getElementById("kl-mssv").value;
    const ngay = document.getElementById("kl-ngay").value;
    const loi = document.getElementById("kl-loi").value;

    if (!mssv) { alert("Vui lòng thêm sinh viên trước khi lập biên bản!"); return; }
    if (!ngay) { alert("Vui lòng chọn ngày vi phạm!"); return; }

    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const sv = students.find(s => s.mssv === mssv);

    const list = getViolations();
    list.push({ mssv, hoTen: sv.hoTen, maPhong: sv.maPhong, ngay, loi });
    localStorage.setItem("kyLuatData", JSON.stringify(list));

    document.getElementById("kl-ngay").value = "";
    renderViolations();
    alert("Đã lập biên bản vi phạm kỷ luật thành công!");
}

function xoaKyLuat(idx) {
    if (confirm("Xóa biên bản vi phạm này khỏi hệ thống?")) {
        const list = getViolations().filter((_, i) => i !== idx);
        localStorage.setItem("kyLuatData", JSON.stringify(list));
        renderViolations();
    }
}

window.onload = function() { loadKlStudents(); renderViolations(); }