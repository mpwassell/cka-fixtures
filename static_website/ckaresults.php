<?php

   
   date_default_timezone_set('Europe/London');
   $entityBody = file_get_contents('php://input');
   $returnObj = new stdClass();

   if (isset($_GET['action'])) {
      $action = $_GET["action"];

      if($action=="scorecard") {
         if( isset( $_SERVER['HTTP_ORIGIN'] )) {
              header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
         }

         $xml = simplexml_load_string($entityBody);
         $sendTo = $xml->SubmittedEmail;

         $returnObj->msg = "The scorecard you have submitted has been sent to the results officer. A copy has also been sent to your email address that you entered on the form (" . $sendTo . "). If you have not received a copy of the scorecard, please check your email spam folder. If the email is not there, contact the results officer. You may want to copy and save the following data:";
         $subject = "CKA League: Fixture Scorecard " . $xml->FixtureCode;
         $returnObj->xml = $entityBody;
      } elseif ($action=="pending") {
         $subject="Pending Change Notification";
         if(isset($_GET['sendto'])) $sendTo=$_GET["sendto"];
         else $sendTo="";
         if(isset($_GET['othersendto'])) $othersendTo= "," . $_GET["othersendto"];
         else $othersendTo="";

      } elseif ($action=="agreed") {
         $subject="Agreed Change Notification";
         if(isset($_GET['sendto'])) $sendTo=$_GET["sendto"];
         else $sendTo="";
      }

      if( filter_var( $sendTo , FILTER_VALIDATE_EMAIL )) {
      } else {
           $entityBody = "Ref's Email Address provided '" . $sendTo . "' is invalid.\n" . $entityBody;
        $sendTo="";
      }

      $entityBody = "If you have received this email in error please contact mpew2@cam.ac.uk.\n" . $entityBody;
      # Use Papercut to run local SMTP to debug.
      mail("mpwassell@gmail.com," . $sendTo . $othersendTo , $subject, $entityBody );
  } else {
      $returnObj->xml='';
      $returnObj->msg="Missing or Invalid Action Specified";
  }
  echo json_encode($returnObj);
?>
