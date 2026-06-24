if (!localStorage.getItem("taiSanData")) {
    const mauTS = [
        { maPhong: "A101", tenThietBi: "Quạt trần Điện Cơ", soLuong: 2, tinhTrang: "Hoạt động tốt" },
        { maPhong: "A102", tenThietBi: "Bóng đèn Led 1m2", soLuong: 1, tinhTrang: "Hỏng / Cần sửa" }
    ];
    localStorage.setItem("taiSanData", JSON.stringify(mauTS));
}

function getAssets() { return JSON.parse(localStorage.getItem("taiSanData")) || []; }

function loadAssetRooms() {
    const select = document.getElementById("asset-maPhong");
    if(!select) return;
    const rooms = JSON.parse(localStorage.getItem("phongData")) || [{maPhong:"A101"},{maPhong:"A102"}];
    select.innerHTML = "";
    rooms.forEach(r => select.innerHTML += `<option value="${r.maPhong}">${r.maPhong}</option>`);
}

function renderAssets() {
    const body = document.getElementById("asset-table-body");
    if(!body) return;
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
                        ? `<button class="btn" style="background:#10b981;padding:4px 8px;font-size:11px;" onclick="suaXong(${idx})">Đã Sửa</button>`
                        : `<button class="btn" style="background:#ef4444;padding:4px 8px;font-size:11px;" onclick="xoaTS(${idx})">Xóa</button>`
                    }
                </td>
            </tr>`;
    });
}

function themTaiSan() {
    const maPhong = document.getElementById("asset-maPhong").value;
    const tenThietBi = document.getElementById("tenThietBi").value.trim();
    const soLuong = document.getElementById("soLuongAsset").value;
    const tinhTrang = document.getElementById("tinhTrangAsset").value;

    if(!tenThietBi) { alert("Vui lòng nhập tên thiết bị!"); return; }
    const ts = getAssets();
    ts.push({ maPhong, tenThietBi, soLuong, tinhTrang });
    localStorage.setItem("taiSanData", JSON.stringify(ts));
    document.getElementById("tenThietBi").value = "";
    renderAssets();
    alert("Thêm thông tin tài sản thành công!");
}

function suaXong(idx) {
    const ts = getAssets();
    ts[idx].tinhTrang = "Hoạt động tốt";
    localStorage.setItem("taiSanData", JSON.stringify(ts));
    renderAssets();
}

function xoaTS(idx) {
    if(confirm("Xóa thiết bị này khỏi danh sách?")) {
        const ts = getAssets().filter((_, i) => i !== idx);
        localStorage.setItem("taiSanData", JSON.stringify(ts));
        renderAssets();
    }
}

window.onload = function() { loadAssetRooms(); renderAssets(); }