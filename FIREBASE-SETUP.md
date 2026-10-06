# Turning the account side on

Your project is already wired in. `assets/firebase.js` has the real config for
**pfbwebsite-45ce2**, so there is nothing to paste.

What is left is three things in the Firebase console. Fifteen minutes, and the
site works without any of it — the docs, FAQ and wiki all render on their own.

---

## 1. Sign in methods

1. Firebase console -> **Authentication** -> **Get started**.
2. **Sign-in method** -> **Email/Password** -> enable -> **Save**.
   Leave "Email link" off, it is not used.
3. Still on **Sign-in method** -> **Google** -> enable -> pick a support email
   -> **Save**.
4. **Settings** -> **Authorized domains** -> **Add domain** -> `fightmc.xyz`.

`localhost` is usually there already, which is what lets you test locally.

Both methods land in the same place. Someone who signs up with Google has no
Minecraft name yet, so the account page nudges them to add one.

**Discord is still not here.** It needs OpenID Connect, which Firebase only
offers on Identity Platform, and that is the paid tier.

---

## 2. Firestore, and the rules

1. Firebase console -> **Firestore Database** -> **Create database**.
2. Choose **Production mode**. The rules in the next step replace whatever it
   starts with.
3. Pick a region near you. You cannot change it later.
4. **Rules** tab. Delete what is there, paste the whole of `firestore.rules`
   from this repo, and click **Publish**.

Read `firestore.rules` if you want to know exactly what it allows. The summary:

- The FAQ and wiki are readable by anyone, writable only by the owner.
- Signed in people can file reports and reply on their own.
- Only the owner can read every report, change a status, or edit pages.
- **Nobody can make themselves the owner.** The rules require your role to stay
  exactly as it was on every update, so the only way in is step 3.

---

## 3. Make yourself the owner

This is the one manual step, and it is deliberately manual.

1. Open the site and go to **Account**.
2. **Create an account** with your email and a password.
3. Firebase console -> **Firestore Database** -> **Data**.
4. Open the **users** collection. There is one document, named with your user
   id. Open it.
5. Find the **role** field. It says `user`. Click it, change it to `owner`,
   and save.
6. Reload the site. The nav now shows **Reports** and **Edit**.

From then on:

- **Reports** shows every report from everyone, not just yours.
- **Edit** lets you rewrite the FAQ and wiki.

To make someone else staff, change their role the same way. To take it away,
set it back to `user`.

---

## 4. The Realtime Database, for the in-game editor

This is the one that makes `/fightbot web` work. Without it the rest of the
site is fine — only `/editor/` stops working.

It is a **different database** from Firestore, in the same project. Firestore
and sign in are untouched by this step.

1. Firebase console -> project **pfbwebsite-45ce2** -> **Build** ->
   **Realtime Database** -> **Create database**.
2. Location: **United States (us-central1)**.
3. Start in **locked mode**. The rules below replace that straight away.
4. **Rules** tab -> select everything -> paste the contents of
   **`realtime-database.rules.json`** (next to this file) -> **Publish**.

That is it. `editor/relay.json` already names the us-central1 database. If you
pick a different location, the console shows a different URL — put that one in
`relay.json` instead, and the plugin and the page both follow it.

**Test it:** on a server running FightBot 5.17.0 or newer, type `/fightbot web`
and open the link. The page should say **Connected** and show your server's
version within a second or two.

### What is actually stored there

Nothing readable. Your server and the editor page agree on a key that only
exists in the link, and everything between them is encrypted with it. The
database only ever holds scrambled bytes and a timestamp saying when the
session runs out. Sessions cannot be listed either — you have to already know
a session's id, which comes from the secret in the link.

This is why nobody has to sign in to use the editor, and why the Minecraft
server does not need a single port opened.

### What it costs

Nothing, on the free plan. One limit worth knowing: the free plan allows **100
database connections at once**, and each open editor uses two (the page and the
server). That is 50 editors open at the same moment across every server running
FightBot. If that ever becomes a problem, the Blaze plan lifts it to 200,000
and costs pennies at this size.

---

## How the pieces behave

### Reports

Someone signs in, fills in the form, and it lands in the **reports**
collection. You see it under Reports, open it, and reply. They see your reply
on their own Reports page, and can reply back. Replying as the owner marks the
report **answered** automatically, and you can set open, answered or closed by
hand.

A reporter can only ever see their own reports. That is enforced by the rules,
not by the page hiding things.

**Debug logs and plugin lists** come in with the report. The log is read in the
browser and stored as text on the report document, not in Cloud Storage, which
would need a billing account. A Firestore document holds 1MB, so the log is
capped at 150KB and the **last** 150KB is kept when a file is longer than that,
since the end is normally the useful part.

**Asking for more.** Open a report and tick what you need: a debug log, steps
to reproduce, a plugin list, or versions. That marks the report **needs info**,
posts the request into the thread, and gives the reporter boxes for exactly
those things on their own copy. When they send it back the report goes to
**open** again.

The rules let a reporter change only the fields you might ask them for. They
cannot rewrite what they originally said went wrong, or move a report to
somebody else.

### Editing the FAQ and wiki

**Edit** gives you a list of entries with Edit, Delete and up/down arrows on
each, and an Add button underneath. Every change saves as you make it.

**FAQ** entries are a question and an answer. Headings are switched off inside
an answer, because the question is already the heading.

**Wiki** entries are a section title and its text. Headings are on, so `#`
gives you sub headings inside a section, and each section title becomes its own
button in the sidebar. The order you put them in is the order they appear.

Markdown in both: `**bold**`, `*italic*`, `` `code` ``, fenced code blocks,
links, images, bullet and numbered lists, tables, `> quotes` and `---` rules.

**Delete everything on a page and the built in text comes back**, so you can
experiment without losing anything.

Stored in **content/faq** as an `items` array, and **content/wiki** as a
`sections` array. If you had already saved a page with the older single box,
it is brought in as one entry the first time you open the editor, so nothing
you wrote is lost.

### Minecraft names

A linked name shows your head in the corner of every page and makes replies
read properly. It is stored on your user document, so it follows you to any
device you sign in on.

It is a **claim, not proof** — anyone can type any username. If that ever
matters, the usual fix is having the plugin print a short code in game that the
player types on the site.

---

## If something does not work

- **Sign in does nothing, no error.** Email/Password is still disabled in step 1.
- **`auth/unauthorized-domain`.** `fightmc.xyz` is missing from Authentication
  -> Settings -> Authorized domains.
- **"You are not allowed to do that" when saving a page.** Your role is still
  `user`. Step 3.
- **Reports list is empty but you filed one.** You are signed in as a different
  account than the one that filed it. Check the email in the nav.
- **"Missing or insufficient permissions".** The rules were not published, or
  only partly pasted. Redo step 2.4 with the whole file.
- **Nothing signed-in works at all and the console mentions gstatic.** An ad
  blocker or network is blocking the Firebase SDK. The docs still work, which
  is why the pages are written to stand on their own.

## What it costs

Nothing, at this scale. The Spark free plan covers 50,000 document reads a day
and unlimited email sign ins. A busy bug tracker for one plugin will not come
close.
