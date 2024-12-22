/**
 * Se utiliza esta función porque tarda bastante en retornar
 */

function fibonacci(num) {
  if (num <= 1) return num;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

/**
 * Los workers inician cuando reciben un mensaje con datos del main thread.
 * Este worker debe escuchar mensajes para saber cuando empezar
 *
 * onmessage recibe un callback
 * El mensaje debe contener datos, de hecho creo que sería bueno agregar un
 * tipo de dato específico
 *
 * Luego se postea el mensaje en el thread principal
 * Luego se cierra el worker
 */

self.onmessage = (e) => {
  const { n } = e.data;
  const result = fibonacci(n);

  self.postMessage(result);
  self.close();
};
