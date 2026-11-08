<?php

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS"){
  http_response_code(204);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  header("Allow: POST, OPTIONS");
  exit;
}

$secret = "myplueplue";

$pw = $_POST["pw"] ?? "";
if (!is_string($pw)) $pw = "";

$storedHash = hash('sha256', $secret);
$inputHash = hash("sha256", $pw);

echo hash_equals($storedHash, $inputHash) ? "ok" : "fail";
exit;