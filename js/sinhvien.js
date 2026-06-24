if (!localStorage.getItem("sinhVienData")) {
    const danhSachSVMau = [
        { mssv: "2401010406", hoTen: "Đinh Trọng Tâm", lop: "CNTT-K21", maPhong: "A102" },
        { mssv: "2401010460", hoTen: "Lê Văn Thứ", lop: "CNTT-K21", maPhong: "A102" }
    ];
    localStorage.setItem("sinhVienData", JSON.stringify(danhSachSVMau));
}

function getStudents() {
    return JSON.parse(localStorage.getItem("sinhVienData")) || [];
}

// Tự động load danh sách phòng vào ô Select để chọn
function loadRoomSelect() {
    const selectPhong = document.getElementById("maPhong");
    if (!selectPhong) return;
    const phongData = JSON.parse(localStorage.getItem("phongData")) || [
        { maPhong: "A101" }, { maPhong: "A102" }, { maPhong: "B201" }
    ];
    selectPhong.innerHTML = "";
    phongData.forEach(p => {
        selectPhong.innerHTML += `<option value="${p.maPhong}">${p.maPhong}</option>`;
    });
}

function renderStudents(filterText = "") {
    const studentTableBody = document.getElementById("student-table-body");
    if (!studentTableBody) return;
    
    const students = getStudents();
    studentTableBody.innerHTML = "";

    const filtered = students.filter(sv => 
        sv.hoTen.toLowerCase().includes(filterText.toLowerCase()) || sv.mssv.includes(filterText)
    );

    if (filtered.length === 0) {
        studentTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: #94a3b8;">Không tìm thấy sinh viên nào</td></tr>`;
        return;
    }

    filtered.forEach(sv => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><b>${sv.mssv}</b></td>
            <td>${sv.hoTen}</td>
            <td>${sv.lop}</td>
            <td><span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${sv.maPhong}</span></td>
            <td><button class="btn btn-delete" onclick="deleteStudent('${sv.mssv}')">Xóa</button></td>
        `;
        studentTableBody.appendChild(row);
    });
}

function themSinhVien() {
    const mssv = document.getElementById("mssv").value.trim();
    const hoTen = document.getElementById("hoTen").value.trim();
    const lop = document.getElementById("lop").value.trim();
    const maPhong = document.getElementById("maPhong").value;

    if (!mssv || !hoTen || !lop) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const students = getStudents();
    if (students.some(sv => sv.mssv === mssv)) {
        alert("MSSV này đã tồn tại!");
        return;
    }

    students.push({ mssv, hoTen, lop, maPhong });
    localStorage.setItem("sinhVienData", JSON.stringify(students));
    
    document.getElementById("mssv").value = "";
    document.getElementById("hoTen").value = "";
    document.getElementById("lop").value = "";
    
    renderStudents();
    alert("Thêm sinh viên mới thành công!");
}

function timKiemSinhVien(val) { renderStudents(val); }

function deleteStudent(mssv) {
    if (confirm(`Xóa sinh viên ${mssv}?`)) {
        let students = getStudents().filter(sv => sv.mssv !== mssv);
        localStorage.setItem("sinhVienData", JSON.stringify(students));
        renderStudents();
    }
}

window.onload = function() {
    loadRoomSelect();
    renderStudents();
};