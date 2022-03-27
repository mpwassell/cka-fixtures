<?php

   date_default_timezone_set('Europe/London');
   $entityBody = file_get_contents('php://input');
   $returnObj = new stdClass();

   if (isset($_GET['action'])) {
      $action = $_GET["action"];

      if(isset($_GET['sendto'])) $sendTo=$_GET["sendto"];
      else $sendTo="";

      if(isset($_GET['othersendto'])) $othersendTo= "," . $_GET["othersendto"];
      else $othersendTo="";

      if ($action=="pending") {
         $subject="Pending Change Notification";
      } elseif ($action=="agreed") {
         $subject="Agreed Change Notification";
      }

      if( filter_var( $sendTo , FILTER_VALIDATE_EMAIL )) {
        $entityBody = "If you have received this email in error please contact mpew2@cam.ac.uk.\n" . $entityBody;
        $entityBody = $entityBody . "A copy of this email has been sent to the following: " . $sendTo . $othersendTo;
        # Use Papercut to run local SMTP to debug.
        #mail("mpwassell@gmail.com," . $sendTo . $othersendTo , $subject, $entityBody );
        mail("results@cambskorfball.co.uk," . $sendTo , $subject, $entityBody );
      } else {
        $entityBody = "Email Address provided '" . $sendTo . "' is invalid.\n";
        $sendTo="";
        $returnObj->errorMsg=$entityBody;
      }
  } else {
      $returnObj->xml='';
      $returnObj->msg="Missing or Invalid Action Specified";
  }
  echo json_encode($returnObj);
?>
