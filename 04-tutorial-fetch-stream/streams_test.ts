/**
 * Fetch api to retrieve a svg file
 * Deno.open used to create and open a file
 * pipeTo used to send a byte stream to created file
 *
 * POST is done to send stream data on a web request
 */

const fileResponse = await fetch("https://deno.land/logo.svg");

if (fileResponse.body) {
    const file = await Deno.open("./logo.svg", {
        write: true,
        create: true,
    });
    await fileResponse.body.pipeTo(file.writable);
}

const file = await Deno.open("./logo.svg", { read: true });

await fetch("https://example.com", {
    method: "POST",
    body: file.readable,
});
