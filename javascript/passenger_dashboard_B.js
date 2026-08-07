   function loadb() {
            fetch('php/passenger_dashboard.php')
            .then(function(res) { return res.json(); })
            .then(function(res) {
                if (!res.success) 
                { 
                    window.location.href = 'passenger_login.html'; return; 
                }
                document.getElementById('passUser').textContent = res.user;

                var trainsTbody = document.getElementById('trainsTbody');
                trainsTbody.innerHTML = '';
                res.trains.forEach(function(row) {
                    var formBlock = "";
                    if (row.available_seats > 0) {
                        formBlock += "<form onsubmit='bookTicket(event, this, " + row.id + ")' style='display:flex; gap:5px; justify-content:center;'>";
                        formBlock += "    <input type='number' name='ticket_count' value='1' min='1' max='" + row.available_seats + "' style='width:50px; height:28px; padding:2px;'>";
                        formBlock += "    <button type='submit' class='btn-blue'>Book</button>";
                        formBlock += "</form>";
                    } 
                    else 
                    {
                        formBlock += "Sold Out";
                    }

                    var html = "<tr>";
                    html += "    <td>" + row.train_name + "</td>";
                    html += "    <td>" + row.source + "</td>";
                    html += "    <td>" + row.destination + "</td>";
                    html += "    <td>" + row.departure_time + "</td>";
                    html += "    <td>" + row.available_seats + "</td>";
                    html += "    <td>$" + row.price + "</td>";
                    html += "    <td>" + formBlock + "</td>";
                    html += "</tr>";
                    trainsTbody.innerHTML += html;
                });
            });
        }

        function bookTicket(e, formElement, id) {
            e.preventDefault();
            var ticketCount = formElement.querySelector('input').value;
            
            if (confirm("Book " + ticketCount + " ticket(s)?")) {
                var formData = new FormData(formElement);
                formData.append('action', 'book_ticket');
                formData.append('train_id', id);

                fetch('php/passenger_dashboard.php', {
                    method: 'POST',
                    body: formData
                })
                .then(function() { loadb(); });
            }
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

        loadb();
 