# Fetch and stream data

- Deno provides fetch() and streams() apis.

## Fetch

- Retrieve resource from the web.
- Requires `--allow-net` flag

## Streaming

- Send or receive larger files over the web. Used when file size is unknown.
- Requires `read`, `write` and `net` variants of the `--allow-<>` flag.