<?php
header("Content-Type: application/json");
session_start();
include 'db.php';

$email = $_POST['email'] ?? '';
$pass = $_POST['password'] ?? '';

$stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if ($user && password_verify($pass, $user['password'])) {
    $_SESSION['passenger_id'] = $user['id'];
    $_SESSION['passenger_name'] = $user['name'];
    $_SESSION['role'] = 'passenger';
    echo json_encode(["success" => true, "id" => $user['id'], "name" => $user['name']]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
}
