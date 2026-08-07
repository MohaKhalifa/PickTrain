   function deleteRoute(id) {
    if (confirm('Remove route?')) {
        var formData = new FormData();
        formData.append('action', 'del_train');
        formData.append('id', id);

        fetch('php/employee_dashboard.php', { method: 'POST', body: formData })
        .then(res=> res.json())
        .then(function(data) {
            if (data.success){alert(data.message)}
            else{alert(data.error)}
            loadr(); });
    }
}
document.getElementById('addRouteForm').addEventListener('submit', function(e) {
            e.preventDefault();
            fetch('php/employee_dashboard.php', { method: 'POST', body: new FormData(this) })
            .then (res=> res.json())
            .then(function(data) { if (data.success){ alert(data.message)}
            else {alert(data.error)}
            loadr(); document.getElementById('addRouteForm').reset(); });
        });


        function loadr() {
            fetch('php/employee_dashboard.php')
            .then(res => res.json())
            .then(data => {
                if (!data.success) 
                { 
                    window.location.href = 'staff_login.html';
                    localStorage.clear(); 
                    }
                document.getElementById('empUser').textContent = data.user;

                var trainsTbody = document.getElementById('trainsTbody');
                trainsTbody.innerHTML = '';
                data.trains.forEach(function(row) {
                    var html = "<tr>";
                    html+= "<td>" + row.id +"</td>";
                    html += "    <td>" + row.train_name + "</td>";
                    html += "    <td>" + row.source + "</td>";
                    html += "    <td>" + row.destination + "</td>";
                    html += "    <td>" + row.departure_time + "</td>";
                    html += "    <td>" + row.available_seats + "</td>";
                    html += "    <td>$" + row.price + "</td>";
                    html += "    <td><button onclick='deleteRoute(" + row.id + ")' class='btn-red'>Remove Route</button></td>";
                    html += "</tr>";
                    trainsTbody.innerHTML += html;
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
        
        loadr();
 