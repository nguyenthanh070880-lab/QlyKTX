// Khởi tạo dữ liệu dự án mẫu ban đầu nếu bộ nhớ trống
if (!localStorage.getItem("hoSoVanBanData")) {
    const mauDuan = [
        { 
            maHS: "MS-406", 
            hopSo: "HỘP-01", 
            loaiHinh: "Phần mềm Quản lý", 
            chuDuAn: "Đinh Trọng Tâm", 
            lienHe: "Trường ĐH Yersin Đà Lạt - ĐT: 0398xxxxxx", 
            tenDuAn: "Hệ thống Quản lý Ký túc xá Điện tử thông minh", 
            diachiThucHien: "Tòa nhà KTX ĐH Yersin, TP. Đà Lạt, Lâm Đồng", 
            quyMo: "Quy mô lưu trữ toàn trường, công suất xử lý dữ liệu thời gian thực", 
            lyDoTra: "Hồ sơ thiếu biên bản kiểm kê tài sản cơ sở vật chất phòng ở đính kèm." 
        }
    ];
    localStorage.setItem("hoSoVanBanData", JSON.stringify(mauDuan));
}

function getHoSoList() {
    return JSON.parse(localStorage.getItem("hoSoVanBanData")) || [];
}

function renderHoSoTable() {
    const body = document.getElementById("hoso-table-body");
    if (!body) return;
    body.innerHTML = "";

    const list = getHoSoList();
    list.forEach((hs, idx) => {
        const lydoText = hs.lyDoTra ? `<span style="color:#ef4444; font-size:12px;">⚠️ ${hs.lyDoTra}</span>` : `<span style="color:#10b981; font-size:12px;">✅ Đủ điều kiện</span>`;
        
        body.innerHTML += `
            <tr>
                <td><b>${hs.maHS}</b><br><small style="color:#64748b;">${hs.hopSo}</small></td>
                <td><b style="color:#1e3a8a;">${hs.tenDuAn}</b><br><small>Chủ DA: ${hs.chuDuAn}</small></td>
                <td>${hs.loaiHinh}</td>
                <td><small>${hs.quyMo}</small></td>
                <td style="max-width:200px; word-wrap:break-word;">${lydoText}</td>
                <td>
                    <button class="btn" style="background:#f59e0b; padding:4px 6px; font-size:11px;" onclick="kichHoatSuaPro(${idx})">✏️ Sửa</button>
                    <button class="btn" style="background:#ef4444; padding:4px 6px; font-size:11px;" onclick="xoaHoSoPro(${idx})">🗑️ Xóa</button>
                    <button class="btn" style="background:#10b981; padding:4px 6px; font-size:11px;" onclick="xuatFileWordPro(${idx})">📝 Word</button>
                </td>
            </tr>`;
    });
}

function luuHoSoPro() {
    const editIdx = parseInt(document.getElementById("hs-edit-idx").value);
    
    const hsData = {
        maHS: document.getElementById("hs-ma").value.trim(),
        hopSo: document.getElementById("hs-hop").value.trim(),
        loaiHinh: document.getElementById("hs-loaihinh").value.trim(),
        chuDuAn: document.getElementById("hs-chudaon").value.trim(),
        lienHe: document.getElementById("hs-lienhe").value.trim(),
        tenDuAn: document.getElementById("hs-tenduan").value.trim(),
        diachiThucHien: document.getElementById("hs-diachithuchien").value.trim(),
        quyMo: document.getElementById("hs-quymo").value.trim(),
        lyDoTra: document.getElementById("hs-lydotra").value.trim()
    };

    if (!hsData.maHS || !hsData.tenDuAn || !hsData.chuDuAn) {
        alert("Bồ nhớ điền tối thiểu các mục: Mã số, Tên dự án và Tên chủ dự án nhé!");
        return;
    }

    let list = getHoSoList();

    if (editIdx === -1) {
        list.push(hsData);
        alert("Thêm mới hồ sơ dự án thành công!");
    } else {
        list[editIdx] = hsData;
        alert("Cập nhật thông tin hồ sơ thành công!");
    }

    localStorage.setItem("hoSoVanBanData", JSON.stringify(list));
    huyCheDoSuaPro();
    renderHoSoTable();
}

function kichHoatSuaPro(idx) {
    const list = getHoSoList();
    const hs = list[idx];

    document.getElementById("hs-edit-idx").value = idx;
    document.getElementById("hs-ma").value = hs.maHS;
    document.getElementById("hs-hop").value = hs.hopSo;
    document.getElementById("hs-loaihinh").value = hs.loaiHinh;
    document.getElementById("hs-chudaon").value = hs.chuDuAn;
    document.getElementById("hs-lienhe").value = hs.lienHe;
    document.getElementById("hs-tenduan").value = hs.tenDuAn;
    document.getElementById("hs-diachithuchien").value = hs.diachiThucHien;
    document.getElementById("hs-quymo").value = hs.quyMo;
    document.getElementById("hs-lydotra").value = hs.lyDoTra;

    document.getElementById("form-title").innerText = "✏️ Chỉnh sửa thông tin hồ sơ dự án";
    document.getElementById("btn-submit-hs").innerText = "Cập Nhật Hồ Sơ";
    document.getElementById("btn-submit-hs").style.backgroundColor = "#f59e0b";
    document.getElementById("btn-cancel-hs").style.display = "inline-block";
}

function huyCheDoSuaPro() {
    document.getElementById("hs-edit-idx").value = "-1";
    document.getElementById("hs-ma").value = "";
    document.getElementById("hs-hop").value = "";
    document.getElementById("hs-loaihinh").value = "";
    document.getElementById("hs-chudaon").value = "";
    document.getElementById("hs-lienhe").value = "";
    document.getElementById("hs-tenduan").value = "";
    document.getElementById("hs-diachithuchien").value = "";
    document.getElementById("hs-quymo").value = "";
    document.getElementById("hs-lydotra").value = "";

    document.getElementById("form-title").innerText = "📥 Nhập thông tin hồ sơ dự án mới";
    document.getElementById("btn-submit-hs").innerText = "Lưu Hồ Sơ";
    document.getElementById("btn-submit-hs").style.backgroundColor = "#2563eb";
    document.getElementById("btn-cancel-hs").style.display = "none";
}

function xoaHoSoPro(idx) {
    if (confirm("Bạn có chắc muốn xóa hồ sơ dự án này?")) {
        const list = getHoSoList();
        list.splice(idx, 1);
        localStorage.setItem("hoSoVanBanData", JSON.stringify(list));
        huyCheDoSuaPro();
        renderHoSoTable();
    }
}

// 🔥 XUẤT VĂN BẢN TRẢ HỒ SƠ WORD THUẦN KHÔNG LỖI CDN
function xuatFileWordPro(idx) {
    const list = getHoSoList();
    const hs = list[idx];

    const HeaderWord = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><title>Thong Bao Tra Ho So</title><meta charset='utf-8'>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.6; padding: 20px; }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .title { font-size: 15pt; font-weight: bold; margin-top: 25px; margin-bottom: 25px; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        td { padding: 6px; vertical-align: top; }
        .label-cell { width: 30%; font-weight: bold; }
    </style>
    </head><body>`;
    
    const FooterWord = `</body></html>`;

    const NoiDungVanBan = `
        <div class="center bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="center bold">Độc lập - Tự do - Hạnh phúc</div>
        <div class="center">-----------------------</div>
        
        <div class="title">THÔNG BÁO VỀ VIỆC TRẢ LẠI HỒ SƠ DỰ ÁN</div>
        
        <p>Kính gửi: <span class="bold">${hs.chuDuAn}</span></p>
        
        <p>Ban quản lý thông báo về tình trạng tiếp nhận văn bản, hồ sơ liên quan đến dự án với chi tiết thông tin kiểm kê dưới đây:</p>
        
        <table>
            <tr>
                <td class="label-cell">Ø Mã số hồ sơ:</td>
                <td>${hs.maHS}</td>
            </tr>
            <tr>
                <td class="label-cell">Ø Hộp số lưu trữ:</td>
                <td>${hs.hopSo || "Chưa xếp hộp"}</td>
            </tr>
            <tr>
                <td class="label-cell">Ø Loại hình dự án:</td>
                <td>${hs.loaiHinh}</td>
            </tr>
            <tr>
                <td class="label-cell">Ø Tên chủ dự án:</td>
                <td>${hs.chuDuAn}</td>
            </tr>
            <tr>
                <td class="label-cell">Ø Địa chỉ & Điện thoại:</td>
                <td>${hs.lienHe}</td>
            </tr>
            <tr>
                <td class="label-cell">Ø Tên dự án:</td>
                <td><span class="bold">${hs.tenDuAn}</span></td>
            </tr>
            <tr>
                <td class="label-cell">Ø Địa chỉ thực hiện:</td>
                <td>${hs.diachiThucHien}</td>
            </tr>
            <tr>
                <td class="label-cell">Ø Quy mô, Công suất:</td>
                <td>${hs.quyMo}</td>
            </tr>
        </table>
        
        <br/>
        <div style="border: 1px solid #ef4444; padding: 15px; background-color: #fff5f5;">
            <p class="bold" style="color: #b91c1c; margin-top:0;">Ø LÝ DO TRẢ LẠI HỒ SƠ:</p>
            <p class="italic" style="margin-bottom:0;">${hs.lyDoTra ? hs.lyDoTra : "Hồ sơ đầy đủ nhưng chủ dự án xin rút lại hoặc chuyển cấp có thẩm quyền khác xử lý."}</p>
        </div>
        
        <br/><br/>
        <table style="border:none;">
            <tr>
                <td style="width:50%; text-align:center;" class="italic">Nơi nhận:<br/>- Như trên;<br/>- Lưu hồ sơ văn bản.</td>
                <td style="width:50%; text-align:center;"><span class="bold">ĐẠI DIỆN TIẾP NHẬN HỒ SƠ</span><br/><span class="italic">(Ký và ghi rõ họ tên)</span></td>
            </tr>
        </table>
    `;

    const FullContent = HeaderWord + NoiDungVanBan + FooterWord;
    const blob = new Blob(['\ufeff' + FullContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ThongBao_TraHoSo_${hs.maHS}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Chạy khởi tạo bảng khi load xong trang
window.onload = function() {
    renderHoSoTable();
}