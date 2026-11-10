# PAYLOAD//SEND: browser-only payload sender for the PS5 elfldr

Live at **https://sendpayload.pages.dev**

![PAYLOAD//SEND](og/og.jpg)

No relay and nothing to install. The page talks straight to the
[ps5-payload-dev elfldr](https://github.com/ps5-payload-dev/elfldr), which besides raw ELF over TCP also accepts
`GET http://<ps5>:9021/?uri=<url>[&args=..][&pipe=0]` and **downloads the payload itself**. With the default `pipe=1`,
the payload's stdout streams back over the same HTTP response and shows up in the page console.

- **From URL**: the URL goes to the console as-is (e.g. a GitHub release `.elf`). The PS5 must be able to reach it.
- **Local file**: uploaded to `POST /api/stash` (Pages Function + R2 bucket `sendpayload-stash`) and served once from
  `/p/<id>/<name>` (deleted after the first download, or after 15 min; the bucket lifecycle also wipes anything older than 1 day).
  Only ELF/SELF magic is accepted, up to 48 MiB.
- Chrome/Edge: the HTTPS page reaching a LAN IP triggers the *Local Network Access* permission prompt (the page passes
  `targetAddressSpace: 'local'`). Other browsers block that mixed content, so the page offers **OPEN IN NEW TAB**: a top-level
  navigation to the same `http://<ps5>:9021/?uri=...` URL, which works everywhere.
- **Quick send**: one-click buttons for popular payloads (FTP Server, PKG Manager, Payload Manager, Elf Arsenal, ProsperoMgr, …), see `QUICK` in `public/index.html`.
- **PROBE** sends `GET /__payloadsend_probe__`; elfldr answers with an `[elfldr.elf] Error ...` line, which shows it is listening.
- Limitations: needs the ps5-payload-dev elfldr (raw-only loaders such as a 9020 bin loader don't speak HTTP), and the PS5 needs internet access for local files.

Build and deploy (Cloudflare Pages project `sendpayload`):

    ./build.sh
    wrangler pages deploy dist --project-name sendpayload --branch main

Local dev: `wrangler pages dev dist` (uses the R2 binding from `wrangler.jsonc`).

The social preview image is `og/og.html`, rendered to `og/og.jpg`/`og.png` (1200×630) with `node og/shot.mjs <abs path to og.html> <out>` (needs playwright-core and Chromium).
