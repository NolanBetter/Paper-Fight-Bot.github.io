<!-- The FAQ, one question per heading. The id comment above each
     heading is what the page links to (faq.html#that-id), so keep ids
     stable even when the wording changes. Markdown, same as the wiki. -->

<!-- id: deps -->
## Does it need any other plugins?

No, on anything newer than 3.17.1. It is one jar.

3.17.1 and older ran bots as disguised zombies, so those need [LibsDisguises](https://www.spigotmc.org/resources/libs-disguises-free.81/). That is the version to use if your server is below 1.20.5.

<!-- id: platforms -->
## What can I run it on?

**Paper 1.20.5 or newer**, or a fork like Purpur — that is the ordinary build.

**Spigot and CraftBukkit 26.1 or newer** work too, from 6.0.9, with the separate **FightBot for Spigot** build.
Both come out together with the same features, commands and config, from the same Modrinth page: the Spigot
one's versions end in `-spigot`.

Folia is not supported, and Spigot or CraftBukkit older than 26.1 cannot host bots. FightBot checks at startup
and says so in the console rather than half working — and the Paper build on a Spigot server tells you to
get the other one.

<!-- id: why -->
## Which build do I download?

**Paper, Purpur or another Paper fork:** the ordinary one, whose version is a plain number like
`6.0.11`.

**Spigot or CraftBukkit (26.1 and up):** the one ending in `-spigot`.

Both are on the same Modrinth page and come out together. Pick the wrong one and FightBot says so at startup
instead of half working, and if it is downloading updates for you it swaps in the right build at the next
restart.

Either way bots are **real server-side players**, not mobs in a disguise: real hitboxes, real physics, a place
in the tab list with a realistic ping, and every other plugin on your server sees them as players.

<!-- id: cost -->
## Does it cost anything?

No. It is free on Modrinth.

<!-- id: howmany -->
## How many bots can I run at once?

Up to 200 from one command, with `/fightbot spawn <count>`. Whether your server enjoys 200 is another matter, since they path, fight and place blocks the way players do. Scale up gradually and watch your TPS.

<!-- id: botvbot -->
## Can bots fight each other?

Yes. Put them in groups and use `/fightbot groupfight <group> <target>`, or set two groups on one another. Good for watching what a loadout actually does.

<!-- id: gearmid -->
## Can I change their gear while they are fighting?

No. The bot is moving items between its hands the whole time, so its inventory is closed while it fights. Run `/fightbot stop <bot>` first, then right click it in creative or use **Open gear** in its settings menu.

<!-- id: missing -->
## Can bots do crystal PvP?

Yes, from **6.0.11**, and it is on by default. Give a bot end crystals and obsidian (it uses obsidian or bedrock that is already there too) and within 5 blocks it places, hits and blows them the way a crystal player does — several a second, which suits fast-crystal servers (`crystal.per-second`).

Before each one it works out what the blast would do to its target and to itself, after armour and enchantments, and picks the spot that hurts them most for the least to it. It never sets one off that would kill it without a totem in hand. Give it armour and totems — crystals hurt both sides, and a bot with no armour will not crystal at all.

Roaming and patrols, which were shelved alongside it, came back in 5.17.0.

<!-- id: mace -->
## Does the mace work?

Yes, and from 6.0.0 it is **on by default**. A config from before that is switched on once when it updates; turn it off after that and it stays off (`mace.enabled`, or **Mace** in one bot's settings).

A bot with a mace and wind charges wind-jumps and smashes you on the way down. With an elytra and rockets it takes off, flies over you and dives — and with a Wind Burst mace, every smash throws it back up, the elytra goes on, and it rockets straight back down at you, again and again until it misses. If you dive on a bot, it sidesteps or gets its shield up.

<!-- id: perm -->
## Is there a permission node?

`fightbot.use`, default OP. Grant it to let other people spawn and command bots. `/fightbot help` in game lists everything.

<!-- id: beta -->
## Should I use the beta builds?

Only if you are chasing a specific fix or happy to report bugs. Stick to the newest full release for anything you care about, and back up first.

<!-- id: video -->
## Can I use it in a video?

Go ahead. A link back is appreciated but not required.

<!-- id: bug -->
## How do I report a bug?

Use the [report form](report.html). It takes your debug log and plugin list, and you will see any reply on your reports page. Discord works too.

Run `/fightbot debug on`, make the problem happen, then `/fightbot debug off`, and send the file it names
(in `plugins/FightBot/debug/`). From 6.4.6 that one file has everything we need: your versions, TPS,
plugins, worlds, bots and `config.yml` with keys and passwords hidden at the start and the end, and what
the bots did in between. (`/fightbot debug report` from 6.4.4 and 6.4.5 is now part of it.)

Rather not share your plugin list or TPS? From 6.4.7, `debug.include.plugins: false` and
`debug.include.tps: false` in `config.yml` leave them out, and the log says so at the top.

<!-- id: webeditor -->
## Can I change settings without opening server files?

Yes, two ways. In game, `/fightbot settings` (6.4.3 and newer) shows every setting as screens, each one
explained, with the 18 settings most people change on a **Popular settings** screen first (6.4.4). Click a
switch to flip it, and type numbers and names in a dialog box (1.21.7 and newer) or on a sign: nothing is
typed in chat. It saves to `config.yml` for you and applies straight away.

Or type `/fightbot web` in game and open the link it gives you. It opens the
[editor](editor/) on this site, where you can change any setting, run the bots that are already there — send
them after someone, set them roaming or patrolling, make groups, hand out kits, and flip any one bot's own
switches — upload skins and voice lines, and read the debug logs.

Making bots stays in game on purpose — FightBot refuses spawning, saves, and renaming or cloning from the web.

Skins can be looked at properly: click one in the skins list and it turns into a model you can spin round,
with the second layer on or off. From 6.0.0 there is an **Emotes & models** tab too, for Emotecraft emotes
(upload one, then play it on a bot, a group or every bot) and Customizable Player Models files.

One thing the editor will not do: **the AI key**. It can switch AI chat on and change its settings, but the key
itself is never shown there and cannot be set there — that only ever goes in `config.yml` on your own server.

On a network, `/fbp web` on the proxy gives one link for every server at once: the editor puts a server picker
at the top, and each server's own editor opens from there.

The link is the key, so do not share it. It stops working after 30 minutes unused, after 4 hours, or when you
type `/fightbot web stop`. Nothing on your server has to be opened up, and everything between your server
and the page is encrypted with a key that is only in the link.

<!-- id: voice -->
## Do the bots talk?

With [Simple Voice Chat](https://modrinth.com/plugin/simple-voice-chat) on the server, yes. Bots show up
in voice chat like players, and the ones that "talk" say lines by themselves when they join, start a fight, win
one, get low or die.

FightBot's own lines come in the jar: `hello` and `am_i_muted` as a bot joins, and `grass` when a roaming
bot pulls up grass. More come with updates, and `voice.on-their-own: false` keeps bots quiet unless told.

You can add your own `.mp3` or `.wav` files too. Those are **never** said by a bot on its own — only when
someone types `/fightbot vc <name>` — everyone nearby is told it is a file added by that server and who
played it, and every play is logged.

<!-- id: restart -->
## Do the bots survive a restart?

Yes, from 5.19.6. As the server stops, every bot is written down, and as it starts they come back
where they stood, with the same inventory, skin, health, settings and group. That covers a FightBot
update too, since those need a restart.

They do not pick up what they were doing — fights and routes start afresh — and they come back a few at
a time (`restart.per-second`, 10) so a big army does not hold the start up. `restart.max-bots` caps how many
come back (100, or `0` for all of them), and `restart.keep-bots: false` turns it off.

From 6.4.3 they come back in the world they were in, and a world that a plugin like Multiverse loads a
moment late is waited for (`restart.wait-for-world`, 120 seconds). They're also written down every minute,
so they come back even after a crash.

From 6.4.4 they also stay there when another plugin tries to move them: a world plugin that empties a world
as the server stops, or one that sends new players to spawn (EssentialsX, Multiverse's first spawn, a lobby
plugin). The console names the plugin that tried.

A plugin reload is different: after `/plugman reload FightBot` or `/reload`, bots come back still doing
what they were.

<!-- id: weapons -->
## What can a bot fight with?

Give it the gear and it works out the rest. A sword or axe, a shield, a totem, pearls, cobwebs, a
water bucket, splash potions, a pickaxe for mining and food to heal on.

Newer kit each has its own switch, in the config or in one bot's settings menu:

- **Bow and crossbow** (on by default): it shoots at anyone further off than 8 blocks, or somewhere it
cannot walk to. It allows for the drop and for where you are running, and the game does the shot, so every
enchantment works.
- **Mace** (on from 6.0.0): wind jumps, pearl launches, and elytra dives that come round again after every Wind Burst smash.
- **Spear** (off, 1.21.11 and up): it keeps 2 to 4 blocks off, jabs, and now and then lowers it and charges.
- **Elytra** (off): it flies after anyone who gets far away, and fights in the air.
- **Cart PvP** (on): TNT minecarts, rails, cobwebs and a bow. It webs you where you stand, lays a rail and a
cart beside you, and shoots a burning arrow into it.
- **Crystal PvP** (on from 6.0.11): end crystals and obsidian, placed and set off several times a second.

Gear wears out and breaks like yours, and a bot with Mending gear and bottles o' enchanting mends itself.

<!-- id: aichat -->
## Can I talk to the bots?

From 6.0.0, yes. With [Simple Voice Chat](https://modrinth.com/plugin/simple-voice-chat) on the server,
stand within 8 blocks of a bot, look at it and say something short — it answers out loud in a word or two
("Hi", "Good") and then gets back to fighting. No small talk.

It uses **your own key** with Groq (free plan), Google Gemini or OpenAI, so it costs whatever they charge.
[Setting it up](ai.html) takes about five minutes.

The key goes in `config.yml` on your server and nowhere else — this site will not show it or set it. Players
are told, the first time they are near a bot that answers, that what they say to it goes to that company.
Nothing else they say is used.

<!-- id: looks -->
## Can bots have my own models, emotes and capes?

**Models:** with [Customizable Player Models](https://modrinth.com/plugin/custom-player-models) on the
server, drop `.cpmmodel` files in `plugins/FightBot/models/` (or upload them in the editor) and each new bot
wears one at random.

**Emotes:** with [Emotecraft](https://modrinth.com/plugin/emotecraft), `.json` or `.emotecraft` files go in
`plugins/FightBot/emotes/`, and `/fightbot emote <bot> <name>` plays one. Both are only seen by players who
have that mod.

**Capes:** Minecraft only shows capes Mojang gave an account, so they cannot be made from a picture. Bots wear
capes that come with a borrowed skin — about 30 in 100 do (`identity.capes`).

**Skins:** about 970 come built into 6.0.0, already signed, ready the moment the server starts.

<!-- id: puppet -->
## Can I make a bot do exactly what I want?

From 6.0.11 there are two ways.

**One move at a time.** `/fightbot action <bot> <action>` does the things a player does: `jump`,
`crouch`, `left-click`, `right-click`, `walk [forward|back|left|right] [seconds]`, `sprint`,
`stop` and `turn`. Nothing is automatic: walking is like holding a key down, so it bumps into walls and
walks off ledges exactly as you would. Good for scripted scenes and recordings.

**In formation.** `/fightbot march <bot|--all|--group red> [player] [left|straight|right]` lines bots up in
rows behind you and keeps them there as you walk, with "eyes left" or "eyes right" if you want a parade.
`/fightbot surround` puts them in a ring around you instead. A bot that gets hit fights back, then takes
its place again. The spacing is all in `formation.*`.

<!-- id: joining -->
## Can bots turn up by themselves, like players joining?

Yes, from 6.0.15, and it is **off by default** so nothing changes until you want it. With
`joining.enabled: true`, every so often a bot joins the way a player does — the real "X joined the game"
line — at the world spawn or a spot you pick, and gets on with what it came for: hunt a player, walk to a
point, or both.

`/fightbot join <number>` sends up to 20 in right now. When one is done it wanders about, logs off like a
player, or goes hunting again, and if someone hits it on the way it fights back, ignores them or runs,
whichever you set. The whole thing is the `joining.*` part of the config, and
[the wiki](wiki.html#bots-that-join-by-themselves) walks through it.

Joined bots do not come back after a restart — new ones join instead, which is what a player would do.

<!-- id: onehit -->
## Can I make a bot die in one hit for a video?

The other way round, and yes: put a player's name in `combat.one-hit-players` and **any** hit from a bot
kills them, whatever it is holding. It is meant for a server's own fun, so leave the list empty for real
fights.

For scripted scenes, the two things most people want with it are `/fightbot action`, which gives you one
move at a time, and a save slot, which spawns bots already wearing the gear and settings you set up.

<!-- id: protect -->
## Can bots guard me?

Yes, from 6.0.17. `/fightbot protect --all` turns every bot into a bodyguard: they keep their places
round you the way marchers do — behind you, ahead of you so they meet trouble first, or a line down
each side — and they look where you look rather than at you.

Hurt the player they are guarding and **every one of them goes after whoever did it**, whether it was a
hit, an arrow or a crystal. Falling damage and fire set nothing off, since there is nobody to go after,
and they leave anyone in that player's own group alone. Once the attacker is down, gone, or has left
them alone for ten seconds, they fall back into place.
[The wiki](wiki.html#protecting-a-player) has the settings.

Marching, surrounding and guarding bots also never fight back against the player they follow, so you can
turn round and hit your own column without starting a brawl. Set `formation.ignore-leader: false` if you
would rather they hit back.

<!-- id: readymade -->
## Do I have to gear up every bot myself?

Not any more. Five loadouts come with FightBot from 6.0.17 — `diamond-sword`, `netherite-sword`, `mace`,
`crystal` and `cart` — on the bottom row of the kits and saves screens. Click one in Kits and pick the
bots to give it to, or click one in Saves and a new bot spawns wearing it. `/fightbot kit Bob mace` and
`/fightbot save crystal` work too.

All the armour has Mending and Unbreaking III, every enchantment is at its normal maximum, and none of
them put potion effects on a bot. They cannot be changed or deleted, so the ones you build yourself go
in your own slots — **seven kits and seven saves**, up from five.
[The wiki](wiki.html#ready-made-loadouts) lists what is in each one.

<!-- id: proxy -->
## Does it work on a network with a proxy?

Yes, from 5.18.0. Put the same jar in your Velocity or BungeeCord proxy's `plugins` folder as well, and
the servers link up to it by themselves. Only the servers you want bots on need FightBot.

With the proxy linked up, bots count in the network's player count and hover list, `/fbp <server> <command>`
runs any FightBot command on any server from the proxy, and `/fb send <bot> <server>` walks a bot over to
another server with its gear, health, skin and settings. Kits, saves, skins and voice lines can be shared across
the network, and `/fbp web` gives one web editor link that covers every server.

On Velocity with modern forwarding there is nothing to set up. Otherwise paste the proxy's
`link-secret.txt` into `network.secret` on each server. [The wiki](wiki.html) has the whole setup.

<!-- id: vanish -->
## My bots are invisible, or disappeared.

Update first: before 6.3.2, an invisibility potion on a bot could last until it was removed. A bot that is
really gone was killed, kicked or banned, and FightBot says which in chat.

If you still can't see a bot that is right next to you, another plugin has hidden it (a vanish plugin, say).
From 6.4.3 FightBot notices, and says in the console and to staff which plugin it was.

<!-- id: fps -->
## My game lags near lots of bots.

That's your game drawing them, not the server. Set `performance.max-visible-bots: 150` and `/fightbot reload`:
each player is only sent the bots nearest them. In your own game, turn Entity Distance down and Entity
Shadows off. [The wiki](wiki.html#performance) has the rest.

<!-- id: arena -->
## How do I keep bots inside my arena?

`combat.pearl-away-distance: 8` keeps their escape pearls short, and a pearl never takes a bot through a wall.
With WorldGuard or PvPManager, `combat.avoid-no-pvp: true` keeps fighting bots out of regions with PvP off:
they wait at the edge for their target to come out.

<!-- id: control -->
## Can I play as one of the bots?

Yes: `/fightbot control <bot>`, even in the middle of a fight. You carry its gear and wear its skin, and its hits
are yours. From 6.4.4, with Simple Voice Chat, your voice comes out of the bot too. `/fightbot stop` hands it
back and puts you where you were.

<!-- id: hunt -->
## Can bots hunt players down?

Yes, from 6.4.3: `/fightbot hunt <bot> <player>`, or leave the player out and each bot hunts whoever is nearest.
They track the way a player does with the locator bar, so a player who crouches, wears a carved pumpkin or
drinks invisibility gets away. `/fightbot rtp` sends bots to random safe spots first.

<!-- id: quick -->
## Can I save the commands I use a lot?

Yes, from 6.4.4: `/fightbot quick` opens a screen of quick actions, one click each. An action is a name, an
icon and up to nine commands, run as whoever clicks it with their own permissions. Five come with it to try
(ten mace bots, red against blue, march behind me, stop and remove every bot). Ops can add more: hold an item
for the icon, click **Add an action**, then type a command or click **Add your last command**. `{player}` becomes
whoever clicks, and `wait 20` waits a second. `/fightbot quick run <name>` runs one from a command block.

<!-- id: drops -->
## A bot dropped its mace with drops turned off.

Update to 6.4.4. With a full pack, a bot swapping weapons mid-fight dropped the extra item, even with
`death.drop-items: never`. Now it waits on the bot and goes back in its pack when there's room. For one bot
that drops nothing at all when it dies, turn off **Drops items** in its menu.

<!-- id: bridge -->
## My bots won't bridge across the void.

Two things to check. Bridging is off at first: set `building.bridge: true` and `/fightbot reload`. And a bot
that's been given a kit only builds with blocks it carries, so give it some: from 6.4.7 blocks you hand it
with `/give` count, and bots after someone a long way off also follow a path or bridge that's already
there. Turn on `/fightbot debug on` and the log says why a bot at the edge isn't bridging.

<!-- id: routemarch -->
## Can bots march along a route on their own?

Yes, from 6.4.7: `/fightbot march --all --route <route>` marches them in rows along a route you made with
`/fightbot pointtool`, point to point, with nobody leading. Each row turns where the front turned. Add
`loop` to go round again or `back` to march back, and `left` or `right` for eyes left or right.

<!-- id: points -->
## Can bots walk to a place and stand about, like survivors after a fight?

Yes, from 6.4.8. Stand there and `/fightbot point camp`, then `/fightbot walk --all camp`: each bot walks
its own way and they gather loosely round the point, close but not on top of each other. For rows instead,
`/fightbot march --all --point camp` marches them there and holds. `/fightbot point tool camp` sets a point
with one click.

<!-- id: cannon -->
## Can bots arrive like players pearling in?

Yes, from 6.4.8, with the Player Cannon. `/fightbot cannon` gives you a fishing rod named "Player Cannon"
and lets you pick who comes (new bots in the gear you choose, a group, or every bot) and what they do when
they land. Right-click it: the bots throw real ender pearls from about 35 blocks away and land round you a few
seconds later. It breaks like any rod after one use, and nothing is said in chat.

<!-- id: teleport -->
## My marching bots teleport to me.

Not from 6.4.8: bots in a march, a ring or a bodyguard formation always walk to their place, however far
behind they are. To bring far-off bots back the old way, set `formation.teleport-distance` to a number
(16 or more).

<!-- id: joinfreeze -->
## My server freezes for a second each time a bot spawns.

Every bot is a real player, so every plugin that does something when a player joins does it for every bot
too. If one of them is slow, the server stops for that long each time a bot comes in. From 6.4.9,
`/fightbot debug on` names the plugin behind every freeze, and the console says it once. If the same
freeze happens when a real player joins with no bots on, it's that plugin, for everyone: update it, ask its
author, or take it off while you film.

<!-- id: potions -->
## My bots throw healing potions at full health.

Update to 6.4.9. Before that, FightBot couldn't read what was in a potion on Paper 1.20.5 and newer, so a
healing potion looked like a buff. Now a bot keeps its healing potions until it's below
`potions.health-threshold` (80% of its health), throws a buff only when it hasn't got it on, and never
throws harming, poison, slowness or weakness at its own feet.
