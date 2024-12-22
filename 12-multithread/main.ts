const numbers = [43];

numbers.forEach((n) => {
  /**
   * Como primer argumento recibe una URL al archivo JS que contiene el código del worker.
   * se especifica el tipo como módulo
   *
   * Diferencia entre módulo y clásico??
   */
  const worker = new Worker(
    new URL("./worker.ts", import.meta.url).href,
    {
      type: "module",
    },
  );

  worker.postMessage({ n });

  worker.onmessage = (e) => {
    console.log(`Main Thread (n=${n}):`, e.data);
    worker.terminate();
  };
});
