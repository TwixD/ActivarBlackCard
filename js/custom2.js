$(document).ready(function() {
eraseCookie('globalmaxclub');
$( "#tarjeta" ).keypress(function(tecla) {
  if($("#tarjeta").val().length>18) return false;
  if($("#tarjeta").val().length === 4 || $("#tarjeta").val().length === 9 || $("#tarjeta").val().length === 14){
     $("#tarjeta").val($("#tarjeta").val()+"-");
  }
  if(tecla.charCode < 48 || tecla.charCode > 57) return false;
});

$( "#tarjeta" ).keydown(function(tecla) {
    if(tecla.keyCode === 8)$("#tarjeta").val("");
});

$( "#pin" ).keypress(function(tecla) {
  if($("#pin").val().length>3) return false;
  if(tecla.charCode < 48 || tecla.charCode > 57) return false;
});

$( "#pin" ).keydown(function(tecla) {
    if(tecla.keyCode === 8)$("#pin").val("");
});

$("form").submit(function(){
  var tarjeta = $("#tarjeta").val().split("-");
  var pin = $("#pin").val();
  var decTarjeta = "";
  for (var i = 0; i < tarjeta.length; i++) {
    decTarjeta += tarjeta[i];
  };
  if(decTarjeta.length != 16){
      bootbox.dialog({
      title: '<img src="img/logoletra.png"/><br/>',
      message: '<div class="titulo">Ups!</div>'+
      '<div class="mensaje">El número de tarjeta no es válido</br>'+
      'XXXX-XXXX-XXXX-XXXX</br>'+
      'Vuelve a intentarlo!</div>',
      closeButton: false,
        buttons: {
        success: {
          label: "Continuar",
          className: "btn-success"
        }
    }
    });
  }else{
    if(pin.length != 4){
      bootbox.dialog({
      title: '<img src="img/logoletra.png"/><br/>',
      message: '<div class="titulo">Ups!</div>'+
      '<div class="mensaje">El número de Pin no es válido</br>'+
      'XXXX</br>'+
      'Vuelve a intentarlo!</div>',
      closeButton: false,
        buttons: {
        success: {
          label: "Continuar",
          className: "btn-success"
        }
    }
    });
    }else{
        var parametros = {
                "numTarjeta" : decTarjeta,
                "numPin" : $("#pin").val()
        };
       $.ajax({
                data:  parametros,
                url:   'php/ingreso.php',
                type:  'post',
                success:  function (response) {
                        if(response == 1){
                          createCookie('globalmaxclub',decTarjeta+"-"+$("#pin").val(),1);
                          window.location.replace("formulario.html");
                        }else{
                              bootbox.dialog({
                              title: '<img src="img/logoletra.png"/><br/>',
                              message: '<div class="titulo">:(</div>'+
                              '<div class="mensaje">'+response+'</br>'+
                              'Ya compraste la tarjeta?</br>'+
                              'llámame (572)379 8021.</div>',
                              closeButton: false,
                                buttons: {
                                success: {
                                  label: "Continuar",
                                  className: "btn-success"
                                }
                              }
                              });
                        }
                },
                error: function(){
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
    }
  }
});
});
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

