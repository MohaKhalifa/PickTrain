      function loade() {
    fetch('php/admin_dashboard.php')
    .then(res => res.json())
    .then(data => {
        if (!data.success) { 
            localStorage.clear();
            window.location.href = 'staff_login.html';
            }
        document.getElementById('adminUser').textContent = data.user;
        var tbodyStaff = document.getElementById('staffTableBody');
tbodyStaff.innerHTML = '';
data.staff.forEach(function(row) {
    //++ String Concatenation \" for quotoes 
    var html = "<tr>";
    html += " <td>"+ row.id + "</td>";
    html += "    <td>" + row.username + "</td>";
    html += "    <td>";
    html += "        <form class='form' onsubmit='updatePassword(event, this, \"update_staff_pass\", " + row.id + ")'>";
    html += "            <input type='password' class='table-input' name='new_password' required placeholder='New Password'>";
    html += "            <button type='submit' class='btn-blue'>Update</button>";
    html += "        </form>";
    html += "    </td>";
    html += "    <td><button onclick='deleteRow(\"delete_staff\", " + row.id + ")' class='btn-red'>Delete Employee</button></td>";
    html += "</tr>";
    tbodyStaff.innerHTML += html;
});
    });
}      
document.getElementById('addEmpForm').addEventListener('submit', function(e) {
            e.preventDefault();
            fetch('php/admin_dashboard.php', { method: 'POST', body: new FormData(this) })
            .then(res=> res.json())
            .then(function(data) { 
                if (data.success)
                {
                loade(); 
                document.getElementById('addEmpForm').reset(); 
            }
            });
        });
            loade();