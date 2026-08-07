<?php
header("Content-Type: application/json");
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'employee') {
    echo json_encode(["success" => false]);
    exit();
}
include 'db.php';
$action = $_POST['action'] ?? '';
$id = (int)($_POST['id'] ?? $_POST['booking_id'] ?? 0);

if ($action === 'add_train') {
    $stmt = $conn->prepare("INSERT INTO trains (train_name, source, destination, departure_time, available_seats, price) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssid", $_POST['t_num'], $_POST['src'], $_POST['dst'], $_POST['dep'], $_POST['seats'], $_POST['prc']);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Route Added Successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => "DB error, Try again"]);
    }
    exit();
} elseif ($action === 'del_train') {
    $stmt = $conn->prepare("DELETE FROM trains WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message"=> "Route Removed Successfully"]);
    } else {
        echo json_encode(["success" => false, "error"=>"DB Error, Try again"]);
    }
    exit();
} elseif ($action === 'update_status') {
    $statusChoice = $_POST['status'] ?? '';

    if ($statusChoice === 'Approved') {
        $stmt = $conn->prepare("UPDATE trains t JOIN bookings b ON t.id = b.train_id SET t.available_seats = t.available_seats - b.ticket_count, b.status = 'Approved' WHERE b.id = ? AND b.status = 'Pending' AND t.available_seats >= b.ticket_count");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
    } elseif ($statusChoice === 'Rejected') {
        $stmt = $conn->prepare("UPDATE bookings SET status = 'Rejected' WHERE id = ? AND status = 'Pending'");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
    }
    exit();
}


$trains = $conn->query("SELECT * FROM trains")->fetch_all(MYSQLI_ASSOC);

$bookingsResult = $conn->query("SELECT * FROM bookings ORDER BY booking_date DESC");
$bookings = [];
while ($booking = $bookingsResult->fetch_assoc()) {
    $userResult = $conn->query("SELECT name FROM users WHERE id = " . $booking['user_id']);
    $user = $userResult->fetch_assoc();

    $trainResult = $conn->query("SELECT * FROM trains WHERE id = " . $booking['train_id']);
    $train = $trainResult->fetch_assoc();

    $booking['id']             = $booking['id'];
    $booking['name']           = $user['name'];
    $booking['train_name']   = $train['train_name'];
    $booking['source']         = $train['source'];
    $booking['destination']    = $train['destination'];
    $booking['departure_time'] = $train['departure_time'];

    $bookings[] = $booking;
}

echo json_encode(["success" => true, "user" => $_SESSION['userName'], "trains" => $trains, "bookings" => $bookings]);
