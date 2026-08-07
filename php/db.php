<?php
$conn = new mysqli("localhost", "root", "", "train_ticketing_db");
if ($conn->connect_error) die(json_encode(["success" => false, "message" => "DB Failed"]));
