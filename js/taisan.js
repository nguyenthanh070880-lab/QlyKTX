if (!localStorage.getItem("taiSanData")) {
    const mauTS = [
        { maPhong: "A102", tenThietBi: "Quạt trần Panasonic", tinhTrang: "Sử dụng tốt" },
        { maPhong: "A102", tenThietBi: "Bóng đèn tuýp LED", tinhTrang: "Hỏng / Cần sửa" }
    ];
    localStorage.setItem("taiSanData", JSON.stringify(mauTS));
}

function getAssets() { return JSON.parse(localStorage.getItem("taiSanData")) || []; }

function loadRoomsToAssetSelect() {
    const select = document.getElementById("ts-phong");
    if (!select) return;
    const rooms = JSON.parse(localStorage.getItem("phongData")) || [];
    select.innerHTML = "";
    rooms.forEach(r => select.innerHTML += `<option value="${r.maPhong}">${r.maPhong}</option>`);
}

function renderAssets() {
    const body = document.getElementById("taisan-table-body");
    if (!body) return; body.innerHTML = "";
    getAssets().forEach((t, idx) => {
        const cls = t.tinhTrang === "Sử dụng tốt" ? "badge-good" : "badge-broken";
        body.innerHTML += `
            <tr>
                <td><b>${t.maPhong}</b></td>
                <td>${t.tenThietBi}</td>
                <td><span class="badge ${cls}">${t.tinhTrang}</span></td>
                <td>
                    ${t.tinhTrang === "Hỏng / Cần sửa" 
                        ? `<button class="btn" style="background:#10b981; padding:4px 8px; font-size:11px;" onclick="suaTaiSan(${idx})">Đã Sửa Xong</button>` 
                        : `<button class="btn" style="background:#f59e0b; padding:4px 8px; font-size:11px;" onclick="baoHongTaiSan(${idx})">Báo Hỏng</button>`
                    }
                </td>
            </tr>`;
    });
}

function themTaiSan() {
    const maPhong = document.getElementById("ts-phong").value;
    const tenThietBi = document.getElementById("ts-ten").value.trim();
    const tinhTrang = document.getElementById("ts-tinhtrang").value;

    if (!tenThietBi) { alert("Vui lòng nhập tên thiết bị!"); return; }
    const list = getAssets();
    list.push({ maPhong, tenThietBi, tinhTrang });
    localStorage.setItem("taiSanData", JSON.stringify(list));
    document.getElementById("ts-ten").value = "";
    renderAssets();
    alert("Khai báo thiết bị thành công!");
}

function suaTaiSan(idx) {
    const list = getAssets(); list[idx].tinhTrang = "Sử dụng tốt";
    localStorage.setItem("taiSanData", JSON.stringify(list)); renderAssets();
}

function baoHongTaiSan(idx) {
    const list = getAssets(); list[idx].tinhTrang = "Hỏng / Cần sửa";
    localStorage.setItem("taiSanData", JSON.stringify(list)); renderAssets();
}
window.onload = function() { loadRoomsToAssetSelect(); renderAssets(); }