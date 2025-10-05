<?php
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// --- MESSAGE CONTENT ---
$title = "New Message from Asmita's Portfolio"; // Used for the sender name
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

$subject = "PORTFOLIO CONTACT: Message from $name"; // Dynamic subject line
$body = "
    <h2>Portfolio Contact Form Submission</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Reply-to Email:</strong> $email</p>
    <p><strong>Message:</strong></p>
    <p>$message</p>
"; // HTML body for better formatting

$mail = new PHPMailer\PHPMailer\PHPMailer();

try {
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth  = true;

    // --- GMAIL CONFIGURATION (SENDER: asmitachhabra04@gmail.com) ---
    $mail->Host      = 'smtp.gmail.com'; 
    $mail->Username  = 'asmitachhabra04@gmail.com'; 
    $mail->Password  = 'mizz xyzi kytc rawp'; // Your Gmail App Password
    $mail->SMTPSecure = 'ssl';
    $mail->Port      = 465;

    // --- RECIPIENT AND SENDER SETTINGS ---
    // The address the message will be SENT FROM (must match the $mail->Username)
    $mail->setFrom('asmitachhabra04@gmail.com', "Asmita Chhabra Portfolio");
    
    // The address that will RECEIVE the email (Asmita's professional email)
    $mail->addAddress('asmita.chhabra@flame.edu.in');
    
    // Add a reply-to address so you can reply directly to the sender
    $mail->addReplyTo($email, $name); 

    $mail->isHTML(true); // Set to true to display the HTML body content
    $mail->Subject = $subject;
    $mail->Body = $body;

    $mail->send();
    http_response_code(200);
    echo "Message sent successfully! Thank you for reaching out.";

} catch (Exception $e) {
    http_response_code(500);
    echo "Failed to send the message. Please try again or contact Asmita directly.";
}