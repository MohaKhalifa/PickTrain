function updateStatus(e, formElement, id) {
    e.preventDefault();
    var selectField = formElement.querySelector('select');
    if (confirm("Change ticket status to " + selectField.value + "?")) {
        var formData = new FormData(formElement);
        formData.append('action', 'update_status');
        formData.append('booking_id', id);

        fetch('php/employee_dashboard.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(function(data) 
        {
            if (!data.success){
                alert("Status Not Updated, Try again")
            }
            
            loadt(); });
    }
}

        function loadt() {
            fetch('php/employee_dashboard.php')
            .then(res => res.json())
            .then(data => {
                if (!data.success) 
                { 
                    window.location.href = 'staff_login.html';
                    localStorage.clear(); 
                    }
                document.getElementById('empUser').textContent = data.user;

                var bookingsTbody = document.getElementById('bookingsTbody');
                bookingsTbody.innerHTML = '';
                data.bookings.forEach(function(row) {
                    var actionBlock = "";
                    if (row.status === 'Pending') {
                actionBlock += "<form onsubmit='updateStatus(event, this, " + (row.id || 0) + ")' style='display: flex; gap: 14px; justify-content: center;'>";
                actionBlock += "    <select name='status' class='dropMenu'>";
                actionBlock += "        <option value='Approved' class='dropMenu'>Approved</option>";
                actionBlock += "        <option value='Rejected' class='dropMenu'>Rejected</option>";
                actionBlock += "    </select>";
                actionBlock += "    <button type='submit' class='btn-blue'>Save</button>";
                actionBlock += "</form>";

                        
                    } else {
                        actionBlock += "Locked";
                    }

                    var html = "<tr>";
                    html += "    <td>" + row.id + "</td>";
                    html += "    <td>" + row.name + "</td>";
                    html += "    <td>" + row.train_name + "</td>";
                    html += "    <td>" + row.source + "</td>";
                    html += "    <td>" + row.destination + "</td>";
                    html += "    <td>" + row.departure_time + "</td>";
                    html += "    <td>" + row.ticket_count + "</td>";
                    html += "    <td><b class='" + row.status + "'>" + row.status + "</b></td>";
                    html += "    <td>" + actionBlock + "</td>";
                    html += "</tr>";
                    bookingsTbody.innerHTML += html;
                });
            });
        }

        function logout() {
            if (confirm("Log out?")) {
                fetch ('php/logout.php' , {method: 'POST'}  )
                .then(res =>res.json())
                .then( data =>{
                    if (data.success){
                        localStorage.clear();
                window.location.href = 'staff_login.html';

                    }
                else { alert("Falied to logout, Try again")}
            })
            }
        }
        
        loadt();
 