const jsonResonse = await fetch("https://api.github.com/users/denoland");
const jsonData = await jsonResonse.json();
console.log(jsonData, "\n");

const textResponse = await fetch("https://deno.land/");
const textData = await textResponse.text();
console.log(textData, "\n");

try {
    await fetch("https://does.not.exist/");
} catch (error) {
    console.log(error);
}

/**
 *
 * TypeError: error sending request for url (https://does.not.exist/): client error (Connect): dns error: failed to lookup address information: Name or service not known: failed to lookup address information: Name or service not known
    at async mainFetch (ext:deno_fetch/26_fetch.js:170:12)
    at async fetch (ext:deno_fetch/26_fetch.js:392:7)
    at async file:///workspaces/deno/04-tutorial-fetch-stream/fetch_test.ts:10:5
 */
