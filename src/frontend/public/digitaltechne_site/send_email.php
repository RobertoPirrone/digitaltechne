<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST['name'];
  $email = $_POST['email'];
  $message = $_POST['message'];

  $to = 'info@digitaltechne.it';  // Replace with the recipient's email address
  // $to = 'robi@most.it';  // Replace with the recipient's email address
  $subject = 'New Message from Website';
  $headers = "From: $name <$email>\r\n";
  $headers .= "Cc:robi@most.it\r\n";
  $headers .= "Reply-To: $email\r\n";

  // Send the email
  mail($to, $subject, $message, $headers);

  // Redirect the user to a thank you page
  header('Location: thank_you.html');
  exit;
}
?>
