<?php
header("Content-Type: application/json");
session_start();
include 'db.php';

$user = $_POST['userName'] ?? '';
$pass = $_POST['password'] ?? '';

$stmt = $conn->prepare("SELECT username, password, role FROM admin WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();

if ($row && password_verify($pass, $row['password'])) {
    $_SESSION['userName'] = $row['username'];
    $_SESSION['role'] = $row['role'];
    echo json_encode(["success" => true, "role" => $row['role'], "username" => $row['username']]);
} else {
    echo json_encode(["success" => false, "message" => "Wrong Credentials"]);
}
