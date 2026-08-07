<?php
header("Content-Type: application/json");
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include "db.php";
mysqli_report(MYSQLI_REPORT_OFF);
if (empty($_POST['username']) || empty($_POST['password']) || empty($_POST['email'])) {
    echo json_encode(["success" => false, "message" => "One or more Input field is empty"]);
    exit();
}
$username = $_POST['username'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);

$stmt = $conn->prepare("insert into users (name, email, password) values (?,?,?)");
$stmt->bind_param("sss", $username, $email, $password);
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Account Created"]);
} else if ($conn->errno === 1062) {

    echo json_encode(["success" => false, "error" => "email already exists"]);
} else {
    echo json_encode(["success" => false, "error" => "account Cannot be created"]);
}

$conn->close();
