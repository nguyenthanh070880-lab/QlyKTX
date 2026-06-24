if (!localStorage.getItem("khieuNaiData")) {
    const mauKN = [
        { maPhong: "A102", noiDung: "Thiết bị điện phòng sinh hoạt chung bị lỏng chập chờn", trangThai: "Chưa xử lý" }
    ];
    localStorage.setItem("khieuNaiData", JSON.stringify(mauKN));
}

function getComplaints() { return JSON.parse(localStorage.getItem("khieuNaiData")) || []; }

function loadRoomsToSelect() {
    const select = document.getElementById("kn-phong");
    if (!select) return;
    const rooms = JSON.parse(localStorage.getItem("phongData")) || [];
    select.innerHTML = "";
    rooms.forEach(r => select.innerHTML += `<option value="${r.maPhong}">${r.maPhong}</option>`);
}

function renderComplaints() {
    const body = document.getElementById("kn-table-body");
    if (!body) return;
    body.innerHTML = "";
    getComplaints().forEach((c, idx) => {
        const cls = c.trangThai === "Chưa xử lý" ? "badge-pending" : "badge-success";
        body.innerHTML += `
            <tr>
                <td><b>${c.maPhong}</b></td>
                <td>${c.noiDung}</td>
                <td><span class="badge ${cls}">${c.trangThai}</span></td>
                <td>
                    ${c.trangThai === "Chưa xử lý"
                        ? `<button class="btn" style="background:#10b981; padding:4px 8px; font-size:11px;" onclick="giaiQuyetKN(${idx})">Xử Lý Ngay</button>`
                        : `<span style="color:#64748b; font-size:12px;">Đã đóng đơn</span>`
                    }
                </td>
            </tr>`;
    });
}

function themKhieuNai() {
    const maPhong = document.getElementById("kn-phong").value;
    const noiDung = document.getElementById("kn-noidung").value.trim();
    if (!noiDung) { alert("Vui lòng ghi nội dung phản ánh!"); return; }
    const list = getComplaints();
    list.push({ maPhong, noiDung, trangThai: "Chưa xử lý" });
    localStorage.setItem("khieuNaiData", JSON.stringify(list));
    document.getElementById("kn-noidung").value = "";
    renderComplaints();
    alert("Gửi ý kiến phản ánh thành công!");
}

function giaiQuyetKN(idx) {
    const list = getComplaints();
    list[idx].trangThai = "Đã xử lý";
    localStorage.setItem("khieuNaiData", JSON.stringify(list));
    renderComplaints();
}
window.onload = function() { loadRoomsToSelect(); renderComplaints(); }