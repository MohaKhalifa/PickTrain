   
         function loadp() {
    fetch('php/admin_dashboard.php')
    .then(res => res.json())
    .then(data => {
        if (!data.success) { 
            localStorage.clear();
            window.location.href = 'staff_login.html';
            }
        document.getElementById('adminUser').textContent = data.user;
var tbodyPassengers = document.getElementById('passengerTableBody');
tbodyPassengers.innerHTML = '';
data.passengers.forEach(function(row) {
    var html = "<tr>";
    html += "    <td>"+row.id +"</td>";
    html += "    <td>" + row.name + "</td>";
    html += "    <td>" + row.email + "</td>";
    html += "    <td>";
    html += "        <form class='form' onsubmit='updatePassword(event, this, \"update_passenger_pass\", " + row.id + ")'>";
    html += "            <input type='password' class='table-input' name='new_password' required placeholder='New Password'>";
    html += "            <button type='submit' class='btn-blue'>Update</button>";
    html += "        </form>";
    html += "    </td>";
    html += "    <td><button onclick='deleteRow(\"delete_passenger\", " + row.id + ")' class='btn-red'>Remove User</button></td>";
    html += "</tr>";
    tbodyPassengers.innerHTML += html;
});

    });
}
   document.getElementById('addPassengerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            fetch('php/admin_dashboard.php', 
            { 
                method: 'POST', 
                body: new FormData(this) 
            })
            .then(res=> res.json())
            .then(function(data) 
            { 
                if(data.success){
                    
                loadp(); 
                document.getElementById('addPassengerForm').reset(); 
                    }
            });
        });
        loadp();

   
