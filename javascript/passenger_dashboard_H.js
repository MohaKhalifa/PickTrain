   function loadh() {
            fetch('php/passenger_dashboard.php')
            .then(function(res) { return res.json(); })
            .then(function(res) {
                if (!res.success) 
                { 
                    window.location.href = 'passenger_login.html'; return; 
                }
                document.getElementById('passUser').textContent = res.user;
                var historyTbody = document.getElementById('historyTbody');
                historyTbody.innerHTML = '';
                res.history.forEach(function(row) {
                    var html = "<tr>";
                    html += "<td>" + row.id +"</td>";
                    html += "    <td>" + row.train_name + "</td>";
                    html += "    <td>" + row.booking_date + "</td>";
                    html += "    <td>" + row.source + "</td>";
                    html += "    <td>" + row.destination + "</td>";
                    html += "    <td>" + row.departure_time + "</td>";
                    html += "    <td>" + row.ticket_count + "</td>";
                    html += "    <td><b class='" + row.status + "'>" + row.status + "</b></td>";
                    html += "</tr>";
                    historyTbody.innerHTML += html;
                });
            });
        }

        function logout() {
            if (confirm("Log out?")) {
                fetch( 'php/logout.php', {method: 'POST'})
                .then (res => res.json())
                .then (data => {
                    if (data.success){
                localStorage.clear();
                window.location.href = 'passenger_login.html';

                    }
                    else {
                        alert("Falied to logout, Try again")
                    }
                })
            }
        }

        loadh();
 