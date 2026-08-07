<?php
header("Content-Type: application/json");
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'passenger') {
    echo json_encode(["success" => false]);
    exit();
}
include 'db.php';

$user_id = $_SESSION['passenger_id'];
$action = $_POST['action'] ?? '';

if ($action === 'book_ticket') {
    $t_id = (int)($_POST['train_id'] ?? 0);
    $count = (int)($_POST['ticket_count'] ?? 0);

    $stmt = $conn->prepare("SELECT available_seats FROM trains WHERE id = ?");
    $stmt->bind_param("i", $t_id);
    $stmt->execute();
    $train = $stmt->get_result()->fetch_assoc();

    if ($train && $train['available_seats'] >= $count) {
        $stmt = $conn->prepare("INSERT INTO bookings (user_id, train_id, ticket_count, status) VALUES (?, ?, ?, 'Pending')");
        $stmt->bind_param("iii", $user_id, $t_id, $count);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
    } else {
        echo json_encode(["success" => false]);
    }
    exit();
}


$trains = $conn->query("SELECT * FROM trains")->fetch_all(MYSQLI_ASSOC);

$stmt = $conn->prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$bookingsResult = $stmt->get_result();

$history = [];
while ($booking = $bookingsResult->fetch_assoc()) {
    $trainResult = $conn->query("SELECT * FROM trains WHERE id = " . $booking['train_id']);
    $train = $trainResult->fetch_assoc();

    $booking['train_name']   = $train['train_name'];
    $booking['source']         = $train['source'];
    $booking['destination']    = $train['destination'];
    $booking['departure_time'] = $train['departure_time'];

    $history[] = $booking;
}

echo json_encode(["success" => true, "user" => $_SESSION['passenger_name'], "trains" => $trains, "history" => $history]);
