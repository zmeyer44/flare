# Flare

Flare is a [nostr](<[url](https://github.com/nostr-protocol/nostr)>) video sharing client. Users can post kind 34235 events on Flare or any other compatable nostr client to view, like, zap, or comment on.

## Features

- [x] Kind 35235 Video events support
- [x] Kind 35237 Video views support
- [x] 30005 Video playlists creation and viewing
- [x] Commenting, reactions, and zapping
- [x] View profiles, add to contact list
- [x] Customize your profile
- [x] Purchase upload credits and upload directly via Flare
- [x] Use existing video url to kind 1063 event to create a kind 34235 video event
- [x] NIP 07 Login support
- [x] NIP 46 Bunker login support
- [x] NIP 05 Support

## Learn More

To learn more about Nostr, take a look at the following resources:

- [Nostr NIPs Repo](https://github.com/nostr-protocol/nips) - learn about NIPs, the guidelines for Nostr.

## Run Flare Locally

First, install all dependencies:

```bash
bun install
```

Next, start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prisma commands

dotenv -e .env.development.local -- npx prisma db push
