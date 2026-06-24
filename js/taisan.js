if (!localStorage.getItem("taiSanData")) {
    const mauTS = [
        { maPhong: "A101", tenThietBi: "Điều hòa Daikin", soLuong: 1, tinhTrang: "Hoạt động tốt" },
        { maPhong: "A102", tenThietBi: "Bóng đèn tuýp", soLuong: 2, tinhTrang: "Hỏng / Cần sửa" }
    ];
    localStorage.setItem("taiSanData", JSON.stringify(mauTS));
}

function getAssets() { return JSON.parse(localStorage.getItem("taiSanData")) || []; }

function loadRoomsToSelect() {
    const select = document.getElementById("asset-maPhong");
    if (!select) return;
    const rooms = JSON.parse(localStorage.getItem("phongData")) || [];
    select.innerHTML = "";
    rooms.forEach(r => select.innerHTML += `<option value="${r.maPhong}">${r.maPhong}</option>`);
}

function renderAssets() {
    const body = document.getElementById("asset-table-body");
    if (!body) return;
    body.innerHTML = "";

    getAssets().forEach((t, idx) => {
        const cls = t.tinhTrang === "Hoạt động tốt" ? "badge-good" : "badge-bad";
        body.innerHTML += `
            <tr>
                <td><b>${t.maPhong}</b></td>
                <td>${t.tenThietBi}</td>
                <td>${t.soLuong}</td>
                <td><span class="badge ${cls}">${t.tinhTrang}</span></td>
                <td>
                    ${t.tinhTrang === "Hỏng / Cần sửa"
                        ? `<button class="btn" style="background:#10b981; padding:4px 8px; font-size:11px;" onclick="suaTaiSan(${idx})">Đã Sửa</button>`
                        : `<span style="color:#64748b; font-size:12px;">Ổn định</span>`
                    }
                    <button class="btn" style="background:#ef4444; padding:4px 8px; font-size:11px; margin-left:5px;" onclick="xoaTaiSan(${idx})">Xóa</button>
                </td>
            </tr>`;
    });
}

function themTaiSan() {
    const maPhong = document.getElementById("asset-maPhong").value;
    const tenThietBi = document.getElementById("tenThietBi").value.trim();
    const soLuong = document.getElementById("soLuongAsset").value;
    const tinhTrang = document.getElementById("tinhTrangAsset").value;

    if (!tenThietBi) { alert("Vui lòng nhập tên thiết bị!"); return; }

    const list = getAssets();
    list.push({ maPhong, tenThietBi, soLuong, tinhTrang });
    localStorage.setItem("taiSanData", JSON.stringify(list));

    document.getElementById("tenThietBi").value = "";
    renderAssets();
    alert("Ghi nhận thiết bị thành công!");
}

function suaTaiSan(idx) {
    const list = getAssets();
    list[idx].tinhTrang = "Hoạt động tốt";
    localStorage.setItem("taiSanData", JSON.stringify(list));
    renderAssets();
    alert("Đã cập nhật trạng thái thiết bị thành hoạt động tốt!");
}

function xoaTaiSan(idx) {
    if (confirm("Xóa thiết bị này khỏi danh sách?")) {
        const list = getAssets().filter((_, i) => i !== idx);
        localStorage.setItem("taiSanData", JSON.stringify(list));
        renderAssets();
    }
}

window.onload = function() { loadRoomsToSelect(); renderAssets(); }