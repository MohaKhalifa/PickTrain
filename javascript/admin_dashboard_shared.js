function deleteRow(actionType, id) {
    if (confirm('Are you sure?')) {
        let windowName = '';
        const formData = new FormData();
        formData.append('action', actionType);
        formData.append('id', id);
        fetch('php/admin_dashboard.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then( function(data) {
            if (data.success){
            let windowName = window.location.pathname;
            if (windowName == '/testproject/admin_dashboard_MGE.html'){
                loade(); 
                alert("Employee account Deleted Successfully");
            }
        else if (windowName == '/testproject/admin_dashboard_MGP.html')
                {loadp();
                    alert("Passenger account Deleted Successfully");
                }
        }
        else { alert("User Not Deleted, Try again.")}
        });
    }
}
function updatePassword(e, formElement, actionType, id) {
   if(confirm("Update Password?")){ e.preventDefault();
    const formData = new FormData(formElement);
    formData.append('action', actionType);
    formData.append('id', id);

    fetch('php/admin_dashboard.php', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(function(data) {
        if (data.success){ 
        let windowName = window.location.pathname;
        alert("Password updated!");
        if (windowName == '/testproject/admin_dashboard_MGE.html'){
         loade();
        }
        else if (windowName == '/testproject/admin_dashboard_MGP.html'){
        loadp();
        }
        }
        else { alert("DB Failure, try again")}
})}}
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
 // live