$(document).ready(function() {
var galleta = readCookie('globalmaxclub');
var tar = "";
var pin = "";
if(galleta == null){
window.history.go(-1);
}else{
var arr = galleta.split("-");
tar = arr[0];
pin = arr[1];
}
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}

 //Local;
 //var ip = '127.0.0.1';
 //Produccion
 var ip = '192.185.36.179';
 $('#progress').hide();
 $('#divError').hide();
 $('.multiselect').multiselect();
 $('.datepicker').datepicker({
 	endDate: '+0m'
 }); 
 $("#input-1").fileinput({
		showUpload: false,
		maxFilesNum: 1
 });
 $("#input-2").fileinput({
		showUpload: false
 });
 $("#id_pais").empty();
 $.getJSON('http://'+ip+'/services/?BC=globalmx_pais',function(data){
		if(data.success){
			if(data.message.length < 1){
			$("#id_pais").append('<option value="0">No tiene países</option>');
			}else{
			$("#id_pais").append('<option value="">Seleccione un país</option>');
			$.each(data.message, function(k,v){
			$("#id_pais").append("<option value=\""+v.countryid+"\">"+v.country+"</option>");
			});
			$("#id_pais").removeAttr("disabled");
     		}
		}else{
		}
 });

$("#id_pais").change(function() {
    $("#id_ciudad").attr("disabled", "disabled");
    $("#id_ciudad").empty();
    $("#id_region").empty();
    $.getJSON('http://'+ip+'/services/?BC=globalmx_regionbypais&idPais='+$("#id_pais").val(),function(data){
		if(data.success){
			if(data.message.length < 1){
			$("#id_region").append('<option value="0">No tiene regiones</option>');
			}else{
			$("#id_region").append('<option value="">Seleccione una región</option>');
			$.each(data.message, function(k,v){
			$("#id_region").append("<option value=\""+v.regionid+"\">"+v.region+"</option>");
			});
			$("#id_region").removeAttr("disabled");
     		}
		}else{
		}
    });
});

$("#id_region").change(function() {
    $("#id_ciudad").empty();
    $.getJSON('http://'+ip+'/services/?BC=globalmx_ciudadbyregion&idRegion='+$("#id_region").val(),function(data){
		if(data.success){
			if(data.message.length < 1){
			$("#id_ciudad").append('<option value="47912">No tiene ciudades</option>');
			}else{
			$("#id_ciudad").append('<option value="">Seleccione una ciudad</option>');
			$.each(data.message, function(k,v){
			$("#id_ciudad").append("<option value=\""+v.cityid+"\">"+v.city+"</option>");
			});
			$("#id_ciudad").removeAttr("disabled");
		    }
		}else{
		}
    });
});

$("form").submit(function(){
        var fileSelect = document.getElementById('input-1');
        var fileSelect2 = document.getElementById('input-2');
        var files = fileSelect.files;
        var files2 = fileSelect2.files;
        var formData = new FormData();
        formData.append("loadFileConf", 1);
        var res = files[0].name.split(".");
        formData.append('cedulaIMG', files[0], 'doc' + $('#id_document').val() + '.' + res.pop());
        for (var i = 0; i < files2.length; i++) {
              var file = files2[i];
              var res = file.name.split(".");
              formData.append('photos[]', file, 'oth'+i+ $('#id_document').val() + '.' + res.pop());
        }        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/active.php', true);
        xhr.send(formData);
        var parametros = {
                "tarjeta" : tar,
                "pin" : pin, 
                "id_document" : $('#id_document').val(),
                "id_ciudad" : $('#id_ciudad').val(),
                "id_first_name" : $('#id_first_name').val(),
                "id_first_lastname" : $('#id_first_lastname').val(),
                "id_last_name" : $('#id_last_name').val(),
                "id_last_lastname" : $('#id_last_lastname').val(),
                "id_direccion" : $('#id_direccion').val(),
                "id_barrio" : $('#id_barrio').val(),
                "id_telefono" : $('#id_telefono').val(),
                "id_celular" : $('#id_celular').val(),
                "id_email" : $('#id_email').val(),
                "id_codpostal" : $('#id_codpostal').val(),
                "id_nacimiento" : $('#id_nacimiento').val()
        };
       $.ajax({
                data:  parametros,
                url:   'php/active.php',
                type:  'post',
                beforeSend: function () {
                  $('#progress').show();
                },
                success:  function (response) {
                  $('#progress').hide();
                        if(response == 1){
                              $('#divError').hide();
                              eraseCookie("globalmaxclub");
                              bootbox.dialog({
                              title: '<img src="img/logoletra.png"/><br/>',
                              message: '<div class="titulo">Hola!</div>'+
                              '<div class="mensaje">Te damos la bienvenida a nuestro Club de Compras</br>'+
                              'Tu tarjeta ya se encuentra activada</br>'+
                              'Puedes comenzar tu viaje!.</div>',
                              closeButton: false,
                                buttons: {
                                success: {
                                  label: "Comprar!",
                                  className: "btn-success",
                                  callback: function() {
                                    window.location.replace("http://clubdecomprasusa.com/");
                                  }
                                }
                            }
                            });
                        }else{
                	      $('#divError').show();
                        $("#resultado").html(response);
                        }
                },
                error: function(){
                              eraseCookie("globalmaxclub");
                              $('#progress').hide();
                              $('#divError').hide();
                              bootbox.dialog({
                              title: '<img src="img/logoletra.png"/><br/>',
                              message: '<div class="titulo">Ups!</div>'+
                              '<div class="mensaje">Hola, nuestros servidores están ocupados</br>'+
                              'Puedes intentar mas tarde</br>'+
                              'Podemos hablar por teléfono?, llámame (572)379 8021.</div>',
                              closeButton: false,
                                buttons: {
                                success: {
                                  label: "A mirar!",
                                  className: "btn-success",
                                  callback: function() {
                                    window.location.replace("http://clubdecomprasusa.com/");
                                  }
                                }
                            }
                            });
                }
        });
  });
});