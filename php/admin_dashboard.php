<?php
header("Content-Type: application/json");
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false]);
    exit();
}
include 'db.php';
$action = $_POST['action'] ?? '';
$id = (int)($_POST['id'] ?? $_POST['booking_id'] ?? 0);

if ($action === 'add_emp') {
    $p = password_hash($_POST['pw'], PASSWORD_BCRYPT);
    $stmt = $conn->prepare("INSERT INTO admin (username, password, role) VALUES (?, ?, 'employee')");
    $stmt->bind_param("ss", $_POST['un'], $p);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
    exit();
} elseif ($action === 'add_passenger') {
    $p = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $_POST['name'], $_POST['email'], $p);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
    exit();
} elseif ($action === 'update_staff_pass') {
    $p = password_hash($_POST['new_password'], PASSWORD_BCRYPT);
    $stmt = $conn->prepare("UPDATE admin SET password = ? WHERE id = ? AND role = 'employee'");
    $stmt->bind_param("si", $p, $id);
if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
    exit();
} elseif ($action === 'update_passenger_pass') {
    $p = password_hash($_POST['new_password'], PASSWORD_BCRYPT);
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $p, $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
    exit();
} elseif ($action === 'delete_staff') {
    $stmt = $conn->prepare("DELETE FROM admin WHERE id = ? AND role = 'employee'");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
    exit();
} elseif ($action === 'delete_passenger') {
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
    exit();
}

$staff = $conn->query("SELECT id, username FROM admin WHERE role = 'employee'")->fetch_all(MYSQLI_ASSOC);
$passengers = $conn->query("SELECT id, name, email FROM users")->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "success" => true,
    "user" => $_SESSION['userName'],
    "staff" => $staff,
    "passengers" => $passengers
]);
