# agentception-browser

This is an [Agentify](https://github.com/mgilangjanuar/agentify) dependency that allows you to run a headless browser agent as a microservice.

## Installation

```bash
bun install
```

## Environment Variables

```[.env]
PORT=4013
SECRET="xxx"
```

## Usage

```bash
bun run index.ts
```

Then, save this service URL and secret to the Agentify variables `BROWSER_URL` and `BROWSER_SECRET`.
