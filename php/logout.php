<?php
session_start();
session_unset();

if (session_destroy()) {
    echo json_encode(["success" => true]);
    exit;
}
/*commit check, again don't change the PT folder, if done git push -f */