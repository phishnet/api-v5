# Phish.net API v5 Examples

## What's This?

Examples of calling version 5 of the [Phish.net API](https://docs.phish.net) from server-side code.

## Authentication

Send your API key in the `X-API-KEY` request header:

```
curl -H "X-API-KEY: $PHISHNET_API_KEY" https://api.phish.net/v5/setlists/showdate/1997-11-22.json
```

Passing the key as an `?apikey=` query-string parameter is deprecated. Query strings end up in server logs, browser history and referrer headers, so the header is the preferred method.

### Keep your key secret

- **Never put your API key in client-side code** (browser JavaScript, mobile apps, public repos). Anyone can read it.
- Call the API from a server, and have your front end talk to your server. The React example shows this with a small proxy.
- Load the key from an environment variable (`PHISHNET_API_KEY`) or a secrets manager, not from source files.
- JSONP can't send custom headers, so it is no longer supported by these examples.

You can request a key at [phish.net/api](https://phish.net/api).

## Examples

Each example fetches the setlist for 1997-11-22 and prints it. Set `PHISHNET_API_KEY` first.

| Language | File | Run |
| --- | --- | --- |
| PHP | [examples/php.php](examples/php.php) | `php examples/php.php` |
| Ruby | [examples/ruby.rb](examples/ruby.rb) | `ruby examples/ruby.rb` |
| Python | [examples/python.py](examples/python.py) | `python examples/python.py` |
| Go | [examples/go.go](examples/go.go) | `go run examples/go.go` |
| C# | [examples/csharp.cs](examples/csharp.cs) | `dotnet run` (in a .NET 6+ project) |

## Example App

[examples/app/](examples/app) is a full React (Vite) app with a setlist browser, jam chart explorer and venue explorer. A small Express server proxies requests and adds the `X-API-KEY` header, so the key stays on the server.

```
cd examples/app
cp .env.example .env     # add your API key
npm install
npm run dev              # http://localhost:5173
```

The proxy only forwards an allowlist of API paths (see `server/index.js`).

## License

This code is free as in beer — use it or modify it as you wish, no attribution required.

## Disclaimer

The Mockingbird Foundation and Phish.net make no warranties about this code and are not responsible for any effects that may come from use of it.
