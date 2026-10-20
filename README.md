# fightmc.xyz

Static site for Paper Fight Bot. No build step, no framework — plain HTML, one
stylesheet, ES modules.

    index.html      home
    install.html    installation and first fight
    ai.html         setting up AI voice chat with Groq
    wiki.html       the FightBot wiki, 6.0.0
    faq.html        common questions
    report.html     bug report form
    reports.html    your reports, and the reply threads
    admin.html      owner only, edits the FAQ and wiki in Markdown
    account.html    sign in and register
    404.html        GitHub Pages 404
    CNAME           custom domain
    .nojekyll       stops Pages ignoring files starting with _

    editor/         the in-game web editor, opened by /fightbot web
      index.html    the page itself
      editor.js     its seven tabs
      editor.css    its styles, on top of assets/style.css
      skin3d.js     a skin as a model you can turn round, in plain CSS
      relay.json    where the relay is, read by both the page and the plugin

    assets/
      style.css          all shared styling
      site.js            CONFIG + shared page wiring
      firebase.js        project config and the auth/firestore handles
      defaults.js        the FAQ and wiki the site ships with, as data
      md.js              the Markdown renderer
      app.js             accounts, nav, reports, threads, content editing
      fightbot-web.js    talks to a Minecraft server for editor/ — leave as is
      logo.png           the square mark
      wordmark.png       the wide Paper Fight Bot lockup
      banner.png         1200x630, used for Discord and social embeds
      favicon.png

    FIREBASE-SETUP.md           turning sign in, reports, editing and the editor on
    firestore.rules             paste into Firebase console -> Firestore -> Rules
    realtime-database.rules.json  paste into Realtime Database -> Rules

## Changing things

Everything that goes stale lives in `CONFIG` at the top of `assets/site.js`:

    version    shown on the home page and the wiki banner
    downloads  the number in the stat strip
    minecraft  the Minecraft versions it runs on
    modrinth   project link
    discord    invite link
    libs       LibsDisguises link, for the pre-3.17.1 note

Every page reads from it, so you edit one file and the whole site follows.

The FAQ and wiki live in `assets/defaults.js`. Editing them on the **Edit** page
copies them into Firestore, and Firestore wins from then on — so after changing
`defaults.js` you either start fresh or press **Restore built in text** on the
Edit page to pull the new copy in. The static text inside `faq.html` and
`wiki.html` is generated from that same file, so the two cannot drift; it is
what people see if Firebase is blocked or slow.

## The editor at /editor/

`/fightbot web` on a server running FightBot 5.17.2 hands out a one-off link to
this page. The link's `#k=…` is the key to that server, so the page runs nothing
else: no analytics, no widgets, and none of the site's own scripts. It has its
own strict Content-Security-Policy and `noindex`. Keep it that way.

`/fbp web` on a Velocity or BungeeCord proxy (5.18.1) hands out one link for a
whole network. That link's session holds only a `state/network` snapshot listing
each server and its own link, so the page shows a picker first and connects to
the server you pick. Nothing listens to the list's inbox, so the page never
writes to it — `ListSession` in `editor/editor.js` reads it and nothing more.

**The AI key is the one setting this site will not touch.** `OFF_LIMITS` in
`editor/editor.js` holds the keys the editor refuses to show or set, and
`ai.api-key` is in it: FightBot would accept a new one from the web, but a
link in a chat log is enough to spend somebody's Groq or OpenAI account, so
that key only ever goes in `config.yml` on their own server. The editor shows
whether one is set and nothing more.

`assets/fightbot-web.js` does all the talking and is tested against the real
plugin — change the page, not the library. Section 4 of FIREBASE-SETUP.md has
the one-time database setup.

## Locking the site

**Edit pages -> Lock the site** puts a curtain over the whole site while
something is being changed — a FightBot release the pages have to catch up
with, say. It is one document, `content/lock`:

    { on: true, message: "...", by: "...", at: <when> }

The rules already make `content/*` public to read and owner only to write, so
there was nothing to add in the Firebase console for it. `app.js` follows the
document live (`onSnapshot`), so the curtain goes up and comes down on every
open tab the moment the switch is flipped.

- The owner keeps seeing the whole site, with a gold band as a reminder.
- `account.html` is never curtained, or signing in to unlock it would be a
  chicken and egg.
- The editor reads the same document with one plain `fetch` of the Firestore
  REST API — no sign in and no SDK on that page, which is why
  `firestore.googleapis.com` is in its `connect-src`. Signing in on the site
  leaves `pfbOwner` in `localStorage`, and the editor lets that browser
  through.
- **If the answer never arrives, the site and the editor open as normal.** A
  lock is a courtesy to visitors, not a guard: someone who sets that flag by
  hand gets in, and a server owner is never shut out of their own bots.

## Deploying on GitHub Pages

1. Push this folder to a repo. Everything must sit at the **root**, not inside
   a subfolder.
2. Settings -> Pages -> Source: deploy from branch, `main`, `/ (root)`.
3. Settings -> Pages -> Custom domain: `fightmc.xyz`. The CNAME file is already
   here so it sticks.
4. At your DNS host:

       A     @   185.199.108.153
       A     @   185.199.109.153
       A     @   185.199.110.153
       A     @   185.199.111.153
       CNAME www <your-username>.github.io

5. Tick "Enforce HTTPS" once the certificate is issued.
