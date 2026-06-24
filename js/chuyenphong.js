if (!localStorage.getItem("chuyenPhongData")) {
    const mauCP = [
        { mssv: "2401010006", hoTen: "Lê Văn A", phongCu: "A102", loaiNV: "Chuyển phòng", phongMoi: "A101", trangThai: "Chờ duyệt" }
    ];
    localStorage.setItem("chuyenPhongData", JSON.stringify(mauCP));
}

function getMoveRequests() { return JSON.parse(localStorage.getItem("chuyenPhongData")) || []; }

function toggleRoomSelect() {
    const loai = document.getElementById("cp-loai").value;
    const divPhongMoi = document.getElementById("div-phongmoi");
    divPhongMoi.style.display = loai === "Trả phòng" ? "none" : "inline-block";
}

function loadCpData() {
    const selectSv = document.getElementById("cp-mssv");
    const selectPhongMoi = document.getElementById("cp-phongmoi");
    if (!selectSv || !selectPhongMoi) return;
    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const rooms = JSON.parse(localStorage.getItem("phongData")) || [];
    selectSv.innerHTML = "";
    students.forEach(s => selectSv.innerHTML += `<option value="${s.mssv}">${s.mssv} - ${s.hoTen}</option>`);
    selectPhongMoi.innerHTML = "";
    rooms.forEach(r => selectPhongMoi.innerHTML += `<option value="${r.maPhong}">${r.maPhong}</option>`);
}

function renderMoveRequests() {
    const body = document.getElementById("cp-table-body");
    if (!body) return; body.innerHTML = "";
    getMoveRequests().forEach((m, idx) => {
        const cls = m.trangThai === "Chờ duyệt" ? "badge-wait" : "badge-approved";
        body.innerHTML += `
            <tr>
                <td>${m.mssv}</td><td><b>${m.hoTen}</b></td><td>${m.phongCu}</td>
                <td><b style="color:${m.loaiNV==='Chuyển phòng'?'#0d9488':'#ea580c'};">${m.loaiNV}</b></td>
                <td>${m.loaiNV==='Chuyển phòng'?m.phongMoi:'-'}</td><td><span class="badge ${cls}">${m.trangThai}</span></td>
                <td>
                    ${m.trangThai === "Chờ duyệt" ? `<button class="btn" style="background:#10b981;padding:4px 8px;font-size:11px;" onclick="duyetDon(${idx})">Duyệt Đơn</button>` : `Đã duyệt`}
                </td>
            </tr>`;
    });
}

function themYeuCauChuyen() {
    const mssv = document.getElementById("cp-mssv").value;
    const loaiNV = document.getElementById("cp-loai").value;
    const phongMoi = document.getElementById("cp-phongmoi").value;
    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const sv = students.find(s => s.mssv === mssv);
    
    const list = getMoveRequests();
    list.push({ mssv, hoTen: sv.hoTen, phongCu: sv.maPhong, loaiNV, phongMoi: loaiNV==='Chuyển phòng'?phongMoi:'', trangThai: "Chờ duyệt" });
    localStorage.setItem("chuyenPhongData", JSON.stringify(list));
    renderMoveRequests();
    alert("Gửi đơn thành công!");
}

function duyetDon(idx) {
    const list = getMoveRequests();
    const don = list[idx];
    don.trangThai = "Đã duyệt";
    const students = JSON.parse(localStorage.getItem("sinhVienData")) || [];
    const svIdx = students.findIndex(s => s.mssv === don.mssv);
    if (svIdx !== -1) {
        if (don.loaiNV === "Chuyển phòng") students[svIdx].maPhong = don.phongMoi;
        else if (don.loaiNV === "Trả phòng") students.splice(svIdx, 1);
        localStorage.setItem("sinhVienData", JSON.stringify(students));
    }
    localStorage.setItem("chuyenPhongData", JSON.stringify(list));
    renderMoveRequests();
    alert("Duyệt thành công!");
}
window.onload = function() { loadCpData(); renderMoveRequests(); }