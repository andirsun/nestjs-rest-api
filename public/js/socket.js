var socket = io();
socket.on("connect", function() {
  console.log("CONECTADO");
});
socket.on("disconnect", function() {
  console.log("perdimos conexion");
});
//send info
socket.emit(
  "enviarMensaje",
  {
    usuario: "ander",
    mensaje: "hola-mundo"
  },
  function(res) {
    console.log("res sserver", res);
  }
);
//listen info from server
socket.on("enviarMensaje", function(message) {
  console.log(message);
});
