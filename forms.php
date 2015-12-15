<?php
    $to = "fisunovartem@gmail.com";
    $subject = "New order";
    $txt = "Name: " . $_POST["name"] . " \n" .  "Phone: " . $_POST["phone"] ;

    mail($to,$subject,$txt);
?>