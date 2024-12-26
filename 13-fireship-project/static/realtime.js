/**
 * Esto es código Frontend de Javascript
 *
 * 1. Extrae el shortcode de la URL
 * 2. Crea un nuevo EventSource que vincula a la url de realtime
 */
document.addEventListener("DOMContentLoaded", (_event) => {
  console.log("realtime script loaded");
  const pathParts = globalThis.location.pathname.split("/");
  const shortCode = pathParts[pathParts.length - 1];
  const eventSoure = new EventSource(`/realtime/${shortCode}`);

  // Se puede agregar una estructura a event.data?

  eventSoure.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    document.getElementById("clickCount").innerText = data.clickCount;
  };

  eventSource.onerror = (error) => {
    console.error("eventSource failed: ", error);
    eventSoure.close();
  };
});
