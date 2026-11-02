/* The FAQ and wiki that ship with the site, as data.

   These are what the pages show before anyone edits anything, and what the
   editor starts from. Editing in the browser copies them into Firestore, so
   you are always adding to the real list rather than replacing it.

   The wiki sections are the FightBot wiki, kept word for word.
   "Restore built in text" in the editor puts these back. */

export const DEFAULT_FAQ = [
  { id: "deps", q: "Does it need any other plugins?",
    a: `No, on anything newer than 3.17.1. It is one jar.

3.17.1 and older ran bots as disguised zombies, so those need [LibsDisguises](https://www.spigotmc.org/resources/libs-disguises-free.81/). That is the version to use if your server is below 1.20.5.` },
  { id: "platforms", q: "What can I run it on?",
    a: `**Paper 1.20.5 or newer**, or a fork like Purpur \u2014 that is the ordinary build.

**Spigot and CraftBukkit 26.1 or newer** work too, from 6.0.9, with the separate **FightBot for Spigot** build.
Both come out together with the same features, commands and config, from the same Modrinth page: the Spigot
one's versions end in \`-spigot\`.

Folia is not supported, and Spigot or CraftBukkit older than 26.1 cannot host bots. FightBot checks at startup
and says so in the console rather than half working \u2014 and the Paper build on a Spigot server tells you to
get the other one.` },
  { id: "why", q: "Which build do I download?",
    a: `**Paper, Purpur or another Paper fork:** the ordinary one, whose version is a plain number like
\`6.0.11\`.

**Spigot or CraftBukkit (26.1 and up):** the one ending in \`-spigot\`.

Both are on the same Modrinth page and come out together. Pick the wrong one and FightBot says so at startup
instead of half working, and if it is downloading updates for you it swaps in the right build at the next
restart.

Either way bots are **real server-side players**, not mobs in a disguise: real hitboxes, real physics, a place
in the tab list with a realistic ping, and every other plugin on your server sees them as players.` },
  { id: "cost", q: "Does it cost anything?",
    a: `No. It is free on Modrinth.` },
  { id: "howmany", q: "How many bots can I run at once?",
    a: `Up to 200 from one command, with \`/fightbot spawn <count>\`. Whether your server enjoys 200 is another matter, since they path, fight and place blocks the way players do. Scale up gradually and watch your TPS.` },
  { id: "botvbot", q: "Can bots fight each other?",
    a: `Yes. Put them in groups and use \`/fightbot groupfight <group> <target>\`, or set two groups on one another. Good for watching what a loadout actually does.` },
  { id: "gearmid", q: "Can I change their gear while they are fighting?",
    a: `No. The bot is moving items between its hands the whole time, so its inventory is closed while it fights. Run \`/fightbot stop <bot>\` first, then right click it in creative or use **Open gear** in its settings menu.` },
  { id: "missing", q: "Can bots do crystal PvP?",
    a: `Yes, from **6.0.11**, and it is on by default. Give a bot end crystals and obsidian (it uses obsidian or bedrock that is already there too) and within 5 blocks it places, hits and blows them the way a crystal player does \u2014 several a second, which suits fast-crystal servers (\`crystal.per-second\`).\n\nBefore each one it works out what the blast would do to its target and to itself, after armour and enchantments, and picks the spot that hurts them most for the least to it. It never sets one off that would kill it without a totem in hand. Give it armour and totems \u2014 crystals hurt both sides, and a bot with no armour will not crystal at all.\n\nRoaming and patrols, which were shelved alongside it, came back in 5.17.0.` },
  { id: "mace", q: "Does the mace work?",
    a: `Yes, and from 6.0.0 it is **on by default**. A config from before that is switched on once when it updates; turn it off after that and it stays off (\`mace.enabled\`, or **Mace** in one bot's settings).

A bot with a mace and wind charges wind-jumps and smashes you on the way down. With an elytra and rockets it takes off, flies over you and dives \u2014 and with a Wind Burst mace, every smash throws it back up, the elytra goes on, and it rockets straight back down at you, again and again until it misses. If you dive on a bot, it sidesteps or gets its shield up.` },
  { id: "perm", q: "Is there a permission node?",
    a: `\`fightbot.use\`, default OP. Grant it to let other people spawn and command bots. \`/fightbot help\` in game lists everything.` },
  { id: "beta", q: "Should I use the beta builds?",
    a: `Only if you are chasing a specific fix or happy to report bugs. Stick to the newest full release for anything you care about, and back up first.` },
  { id: "video", q: "Can I use it in a video?",
    a: `Go ahead. A link back is appreciated but not required.` },
  { id: "bug", q: "How do I report a bug?",
    a: `Use the [report form](report.html). It takes your debug log and plugin list, and you will see any reply on your reports page. Discord works too.` },
  { id: "webeditor", q: "Can I change settings without opening server files?",
    a: `Yes. Type \`/fightbot web\` in game and open the link it gives you. It opens the
[editor](editor/) on this site, where you can change any setting, run the bots that are already there — send
them after someone, set them roaming or patrolling, make groups, hand out kits, and flip any one bot's own
switches — upload skins and voice lines, and read the debug logs.

Making bots stays in game on purpose — FightBot refuses spawning, saves, and renaming or cloning from the web.

Skins can be looked at properly: click one in the skins list and it turns into a model you can spin round,
with the second layer on or off. From 6.0.0 there is an **Emotes & models** tab too, for Emotecraft emotes
(upload one, then play it on a bot, a group or every bot) and Customizable Player Models files.

One thing the editor will not do: **the AI key**. It can switch AI chat on and change its settings, but the key
itself is never shown there and cannot be set there — that only ever goes in \`config.yml\` on your own server.

On a network, \`/fbp web\` on the proxy gives one link for every server at once: the editor puts a server picker
at the top, and each server's own editor opens from there.

The link is the key, so do not share it. It stops working after 30 minutes unused, after 4 hours, or when you
type \`/fightbot web stop\`. Nothing on your server has to be opened up, and everything between your server
and the page is encrypted with a key that is only in the link.` },
  { id: "voice", q: "Do the bots talk?",
    a: `With [Simple Voice Chat](https://modrinth.com/plugin/simple-voice-chat) on the server, yes. Bots show up
in voice chat like players, and the ones that "talk" say lines by themselves when they join, start a fight, win
one, get low or die.

FightBot's own lines come in the jar: \`hello\` and \`am_i_muted\` as a bot joins, and \`grass\` when a roaming
bot pulls up grass. More come with updates, and \`voice.on-their-own: false\` keeps bots quiet unless told.

You can add your own \`.mp3\` or \`.wav\` files too. Those are **never** said by a bot on its own — only when
someone types \`/fightbot vc <name>\` — everyone nearby is told it is a file added by that server and who
played it, and every play is logged.` },
  { id: "restart", q: "Do the bots survive a restart?",
    a: `Yes, from 5.19.6. As the server stops, every bot is written down, and as it starts they come back
where they stood, with the same inventory, skin, health, settings and group. That covers a FightBot
update too, since those need a restart.

They do not pick up what they were doing — fights and routes start afresh — and they come back a few at
a time (\`restart.per-second\`, 10) so a big army does not hold the start up. \`restart.max-bots\` caps how many
come back (100, or \`0\` for all of them), and \`restart.keep-bots: false\` turns it off.

A plugin reload is different: after \`/plugman reload FightBot\` or \`/reload\`, bots come back still doing
what they were.` },
  { id: "weapons", q: "What can a bot fight with?",
    a: `Give it the gear and it works out the rest. A sword or axe, a shield, a totem, pearls, cobwebs, a
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

Gear wears out and breaks like yours, and a bot with Mending gear and bottles o' enchanting mends itself.` },
  { id: "aichat", q: "Can I talk to the bots?",
    a: `From 6.0.0, yes. With [Simple Voice Chat](https://modrinth.com/plugin/simple-voice-chat) on the server,
stand within 8 blocks of a bot, look at it and say something short — it answers out loud in a word or two
("Hi", "Good") and then gets back to fighting. No small talk.

It uses **your own key** with Groq (free plan), Google Gemini or OpenAI, so it costs whatever they charge.
[Setting it up](ai.html) takes about five minutes.

The key goes in \`config.yml\` on your server and nowhere else — this site will not show it or set it. Players
are told, the first time they are near a bot that answers, that what they say to it goes to that company.
Nothing else they say is used.` },
  { id: "looks", q: "Can bots have my own models, emotes and capes?",
    a: `**Models:** with [Customizable Player Models](https://modrinth.com/plugin/custom-player-models) on the
server, drop \`.cpmmodel\` files in \`plugins/FightBot/models/\` (or upload them in the editor) and each new bot
wears one at random.

**Emotes:** with [Emotecraft](https://modrinth.com/plugin/emotecraft), \`.json\` or \`.emotecraft\` files go in
\`plugins/FightBot/emotes/\`, and \`/fightbot emote <bot> <name>\` plays one. Both are only seen by players who
have that mod.

**Capes:** Minecraft only shows capes Mojang gave an account, so they cannot be made from a picture. Bots wear
capes that come with a borrowed skin — about 30 in 100 do (\`identity.capes\`).

**Skins:** about 970 come built into 6.0.0, already signed, ready the moment the server starts.` },
  { id: "puppet", q: "Can I make a bot do exactly what I want?",
    a: `From 6.0.11 there are two ways.

**One move at a time.** \`/fightbot action <bot> <action>\` does the things a player does: \`jump\`,
\`crouch\`, \`left-click\`, \`right-click\`, \`walk [forward|back|left|right] [seconds]\`, \`sprint\`,
\`stop\` and \`turn\`. Nothing is automatic: walking is like holding a key down, so it bumps into walls and
walks off ledges exactly as you would. Good for scripted scenes and recordings.

**In formation.** \`/fightbot march <bot|--all|--group red> [player] [left|straight|right]\` lines bots up in
rows behind you and keeps them there as you walk, with "eyes left" or "eyes right" if you want a parade.
\`/fightbot surround\` puts them in a ring around you instead. A bot that gets hit fights back, then takes
its place again. The spacing is all in \`formation.*\`.` },
  { id: "proxy", q: "Does it work on a network with a proxy?",
    a: `Yes, from 5.18.0. Put the same jar in your Velocity or BungeeCord proxy's \`plugins\` folder as well, and
the servers link up to it by themselves. Only the servers you want bots on need FightBot.

With the proxy linked up, bots count in the network's player count and hover list, \`/fbp <server> <command>\`
runs any FightBot command on any server from the proxy, and \`/fb send <bot> <server>\` walks a bot over to
another server with its gear, health, skin and settings. Kits, saves, skins and voice lines can be shared across
the network, and \`/fbp web\` gives one web editor link that covers every server.

On Velocity with modern forwarding there is nothing to set up. Otherwise paste the proxy's
\`link-secret.txt\` into \`network.secret\` on each server. [The wiki](wiki.html) has the whole setup.` },
];

export const DEFAULT_WIKI = [
  { id: "requirements", title: "Requirements", body:
`FightBot adds PvP bots to your Paper or Spigot server. Each bot is a real server-side player: it has a real hitbox, real physics and a spot in the tab list, and every other plugin sees it as a player. Bots fight with swords, axes, shields, totems, pearls, cobwebs, water buckets, potions, bows, TNT minecarts and end crystals. They can also walk routes, patrol an area and fight in teams.

> **New here? In game, type \`/fb guide\`.** It walks you through everything below, one short step at a time.

| FightBot build | Minecraft | Needs |
|---|---|---|
| FightBot (the Paper build), newer than 3.17.1 | 1.20.5 and up | Paper, or a fork like Purpur. Nothing else. |
| FightBot for Spigot (\`-spigot\` versions, 6.0.9 and up) | 26.1 and up | Spigot or CraftBukkit. Nothing else. |
| 3.17.1 and older | 1.16 and up | LibsDisguises |

Both builds come out together, with the same features, commands and config. They're published on the same Modrinth page: the Spigot build's versions end in \`-spigot\`. Each release is tested on every supported version.

Optional: **Simple Voice Chat**, for bots that talk (5.17.2 and up) and answer you with AI (6.0.0). See [Voice lines](#voice-lines-simple-voice-chat) and [AI voice chat](#ai-voice-chat).

Optional: **Emotecraft** and **Customizable Player Models**, for emotes and models on bots (6.0.0). See [Emotes and player models](#emotes-and-player-models).

Optional: a **Velocity or BungeeCord proxy** (5.18.0 and up). The Paper build's jar goes on the proxy too. See [Networks](#networks-velocity-and-bungeecord).

Folia isn't supported, and Spigot or CraftBukkit older than 26.1 can't host bots (their internal names are scrambled). The Paper build on a Spigot server says to use FightBot for Spigot instead. Whatever the reason, FightBot says so in the console at startup instead of half-working. If your server is older than 1.20.5, use 3.17.1 with LibsDisguises.` },
  { id: "quick-start", title: "Quick start", body:
`1. Put the jar in \`plugins/\` and start the server.
2. In game, type \`/fb spawn\`. A bot appears where you're standing.
3. Hit it. It fights back. Or send it after someone with \`/fb fight <bot> <player>\`.
4. Right-click it in creative mode to give it armour and a weapon.
5. \`/fb stop\` calls every bot off, and \`/fb remove <bot>\` gets rid of one.

Every command works as \`/fightbot\` or \`/fb\`. The permission is \`fightbot.use\`, which only OPs have by default.

Rather click than type? \`/fb web\` gives you a link to change FightBot from your browser. See [The web editor](#the-web-editor).

## Help inside the game

| Command | What it shows |
|---|---|
| \`/fb guide\` | A short walkthrough. Pick a topic: \`start\`, \`skins\`, \`names\`, \`gear\`, \`groups\`, \`routes\`, \`voice\`, \`web\` or \`problems\`. |
| \`/fb skins\` | Where your skins stand right now, and how to set them up. |
| \`/fb help\` | Every command. |

\`/fb start\` jumps straight to the getting-started page. On a brand-new server, anyone who can use FightBot gets a one-time "type /fb guide" message when they join, until the first bot is spawned.` },
  { id: "spawning-and-managing-bots", title: "Spawning and managing bots", body:
`| Command | What it does |
|---|---|
| \`/fb spawn\` | One bot with a random name, where you stand, facing the way you face. |
| \`/fb spawn <count>\` | Up to 200 bots with random names, spread out a little. More than 20 arrive over a few ticks, 20 a tick, so the server keeps up. |
| \`/fb spawn <name>\` | One bot with the name you give it. |
| \`/fb spawn --random [count]\` | The long way of writing \`/fb spawn <count>\`. |
| \`/fb spawn [name\\|count] --location <x> <y> <z> [world] [yaw pitch]\` | Spawns them somewhere else. See Spawning somewhere else. |
| \`/fb list\` | Every bot's head. Click one to open its menu. |
| \`/fb remove <bot\\|--all>\` | Removes bots. \`/kick\` and \`/ban\` work too (see [Kicks and bans](#kicks-and-bans)). |
| \`/fb edit clone <bot> <name>\` | Copies a bot, gear and settings included. |
| \`/fb edit clone <bot> --random [count]\` | Up to 200 copies at once, with random names. |
| \`/fb edit change <bot> <name\\|--random>\` | Renames a bot. |
| \`/fb tp <bot\\|--all\\|--group <group>> <player\\|x y z>\` | Teleports bots. Sent to a player, they face the way that player faces. Sent to x y z, they face south. |
| \`/fb look <bot\\|--all> <player\\|bot\\|--stop>\` | Bots watch someone until you say \`--stop\`, or until that player leaves or dies. Busy bots watch too: roaming, marching, standing guard. Given another order, such as a fight, it looks at who it's fighting, then goes back to watching. \`/fb stop\` ends watching too. |
| \`/fb action <bot\\|--all\\|--group <group>> <action>\` | The bot does what a player does with their keys and mouse. See Actions. |

A bot never takes a name that belongs to someone else:

- nobody who has played on your server (unless \`identity.protect-real-names\` is off)
- no AuthMe or nLogin account
- no banned name

Player data is safe either way, because bots have IDs of their own. If a real player joins using a bot's name, the bot steps aside.

## Actions

\`/fb action <bot|--all|--group <group>> <action>\` makes bots do one thing a player does:

| Action | What it does |
|---|---|
| \`jump\` | Jumps. |
| \`crouch\` | Crouches. Again to stand up. |
| \`left-click\` | A swing, hitting whatever it's looking at in reach. |
| \`right-click\` | Uses the block it's looking at (a door, button, lever or chest), or else the item in its hand: a pearl or snowball thrown, food eaten, a bow drawn and shot, a shield raised. |
| \`walk [forward\\|back\\|left\\|right] [seconds]\` | Walks that way, relative to where it faces (forward if you don't say), until \`stop\`, or for that many seconds. |
| \`sprint [seconds]\` | Sprints forward. Sprinting only goes forward, as for a player; other directions walk. |
| \`stop\` | Stops walking or sprinting. |
| \`turn <left\\|right\\|around\\|degrees>\` | Turns it. Positive degrees turn right. |

Walking and sprinting work like holding a key down: **nothing is automatic**. The bot doesn't step up blocks, stop at edges or go round anything. It bumps into walls and walks off ledges like a player would. Make it jump with \`/fb action <bot> jump\` while it moves, and a sprint plus a jump is a sprint-jump. Crouched, it crouch-walks; drawing a bow or eating slows it, like you. Speeds match a player's: about 4.3 blocks a second walking, 5.6 sprinting. \`/fb look\` or \`turn\` points it first, and \`/fb stop\` ends it.

## Marching and surrounding

| Command | What it does |
|---|---|
| \`/fb march <bot\\|--all\\|--group <group>> [player] [left\\|straight\\|right]\` | Bots march in rows behind you, or the player you name. Add \`left\` or \`right\` for "eyes left" or "eyes right". |
| \`/fb surround <bot\\|--all\\|--group <group>> [player]\` | Bots stand in a ring round you, or the player you name. |
| \`/fb march <…> --stop\` / \`/fb surround <…> --stop\` | Ends it. \`/fb stop\` does too. |

**Marching:** behind you, the way you're walking, there's a gap (1 block), then the first row: one bot in the middle, one to its left and one to its right, shoulder to shoulder. The next row is straight behind it, and so on, so 7 bots make two full rows and one in the middle of a third. In a straight line the rows stay tight; when you turn, they swing round to their new places. Sprinting, the back rows trail a little (a bot can't go faster than you) and close up when you stop.

**Where they look:** marching bots look at you (\`straight\`, the default). Add \`left\` or \`right\` and they turn their heads that way and a little up, like a parade's "eyes left", while they march straight on behind you: \`/fb march --all Nolan left\`. With no player named, you lead: \`/fb march --all right\`. Bots in a ring always look at you.

**Surrounding:** an evenly spaced ring round you that follows you. With the radius left at \`0\`, the ring grows with the number of bots: 7 bots make a 2-block ring, 20 about 3 blocks.

- A bot further than \`formation.teleport-distance\` (48 blocks) from its place, or in another world, is brought there.
- It's a job, like roaming: a busy bot has to be stopped first (unless \`orders.must-stop-first\` is off). Bots already marching or surrounding can be switched straight to another formation, player or direction. A bot that's hit fights back, then takes its place again. If the player leaves, the bots wait where they are.

| Setting | Default | What it does |
|---|---|---|
| \`formation.march.width\` | \`3\` | Bots side by side in each row (1 to 9). |
| \`formation.march.gap\` | \`1\` | Empty blocks between you and the first row. |
| \`formation.march.side-gap\` | \`0\` | Empty blocks between bots in a row. \`0\` is shoulder to shoulder. |
| \`formation.march.row-gap\` | \`0\` | Empty blocks between one row and the next. |
| \`formation.march.look-angle\` | \`45\` | Marching \`left\` or \`right\`: how far they turn their heads, in degrees (0 to 120). |
| \`formation.march.look-up\` | \`10\` | Marching \`left\` or \`right\`: how far up they look, in degrees (-45 to 45). |
| \`formation.surround.radius\` | \`0\` | \`0\`: the ring grows with the number of bots. Or a fixed radius, in blocks. |
| \`formation.surround.spacing\` | \`1.0\` | Blocks from one bot to the next round the ring (radius \`0\`). |
| \`formation.surround.min-radius\` | \`2.0\` | The smallest the ring gets (radius \`0\`). |
| \`formation.teleport-distance\` | \`48\` | Further than this from its place, a bot is brought there. |

## Spawning somewhere else

Add \`--location\` to the end of a spawn command. It works the way \`/tp\` does:

| You type | Where the bot goes |
|---|---|
| \`--location 100 64 -20\` | Exactly there. A whole number puts it in the middle of the block, so this is 100.5 64 -19.5. |
| \`--location ~ ~ ~5\` | Where you are, 5 blocks further along z. \`~\` on its own means "the same as mine", and \`~-2\` means 2 less. |
| \`--location ^ ^ ^3\` | 3 blocks straight ahead of where you're looking. The three numbers are left, up and forward. |
| \`--location 0 70 0 world_nether\` | In another world. |
| \`--location ~ ~ ~ 90 0\` | Facing a direction: yaw, then pitch, like \`/tp\`. \`~\` keeps your own. |

The world, yaw and pitch are optional. \`--location\` always goes last, for example \`/fb spawn 10 --location ~ ~ ~10\` or \`/fb save 2 --random 5 --location 0 64 0\`. From the console, use plain numbers, or \`~\` counts from the main world's spawn.

## Command blocks

Command blocks and command minecarts can run FightBot commands, \`/fb spawn\` included (menus need a player). \`~\` counts from the command block itself.

To keep a server safe, FightBot stops a command block when it:

- spawns more than 200 bots within 20 ticks (one second), or
- would have more than 200 of its bots in the game at once.

A stopped command block can't spawn bots again until \`/fb reload\`. Ops are told which one it was and where it is.` },
  { id: "fighting", title: "Fighting", body:
`| Command | What it does |
|---|---|
| \`/fb fight <bot> <player...>\` | One bot goes after one or more players. |
| \`/fb fight --all <player...>\` | Every bot goes after them. |
| \`/fb fight --group <group> <player...>\` | A whole group goes after them. Several groups work too: \`--group red blue <player...>\`. |
| \`/fb fight --group <group> <group>\` | Two groups fight each other, as one-on-one duels. |
| \`/fb stop\` (or \`/fb stop --all\`) | Every bot stops, whether it's fighting, roaming or patrolling. |
| \`/fb stop <bot>\` | One bot stops, whatever it's doing. |

## How bots swing

Bots fight like a person, not a machine:

- **A moment to react.** Someone stepping into reach gets hit after a few ticks, not the very tick they arrive (\`combat.reaction.min-ticks\` and \`max-ticks\`).
- **Not like clockwork.** Swings come a little early or late (\`combat.swing-jitter-ticks\`), and now and then one misses, mostly at the edge of reach (\`combat.miss-chance\`).
- **Real critical hits only.** A bot jumps and swings on the way down, and the game decides if it's a crit. It never crits walking along, and its reach is a player's, whatever weapon you hold.
- **A charged swing.** It waits for its weapon to charge up (the attack bar a player sees) before it swings, and times its crit jumps to come down just as it fills (\`combat.wait-for-charge\`). That matters most for slow weapons: a half-charged axe hit does far less.
- **Hit them straight away.** A bot can be hit the moment it joins, teleports, pearls or changes world, like a player.

## Moving like a player

- **Sprint-jumping** (\`movement.sprint-jump\`): chasing someone on open, level ground, a bot sprint-jumps like a player, which is faster than running. Coming down from a jump, it lands critical hits.
- **Gaps** (\`movement.jump-gaps\`): it jumps gaps up to 3 blocks wide, onto the same level or one block up, instead of placing blocks.
- **A single missing block** in otherwise solid ground is walked round, not jumped. Trenches across its path are still jumped.
- **Wider gaps** (\`movement.gap-blocks\`): chasing someone (or on a route that allows building), a bot crosses gaps of 4 to 12 blocks by placing blocks. Over 4, it sprint-jumps and puts a block down at the far end mid-jump to land on. Like a player, now and then it misses. On anything wider, it bridges out one block at a time until 3 are left, then jumps the rest. A bot roaming with no target never places blocks over gaps.

## Mace

Mace combat is **on by default** from 6.0.0 (\`mace.enabled\`). A config from before 6.0.0 is switched on once, when it updates; turn it off after that and it stays off. One bot can be changed with **Mace** in its settings menu. The bot uses the game's own mace, wind charges, elytra and fireworks, so damage, Density, Breach and Wind Burst all work as they do for you.

- **Wind jump** (mace + wind charges): close in, it throws a wind charge at its feet, flies up and smashes you on the way down. With Wind Burst it can bounce up and smash again (\`mace.wind-chain-max\`).
- **Elytra dive** (mace + elytra + firework rockets): from further away (up to 72 blocks), it takes off, climbs and flies over you, swaps the elytra for its chestplate and drops onto you from about \`mace.dive-height\` blocks. It aims for where you'll be when it gets there, not where you were.
- **Elytra combo** (the dive, with a **Wind Burst** mace): the first hit is the full flight - up, round and down. After every smash that lands, Wind Burst throws it up; at the top it puts the elytra on and fires a rocket **straight back down** at you, swapping to its chestplate at the last moment to smash again. That repeats until one misses. After a miss, it does the full flight again, until the rockets run out. \`mace.elytra-combo: false\` turns this off.
- **Pearl launch** (mace + ender pearls + wind charges): from further off than a wind jump (about 7 to 22 blocks), it throws a pearl that lands right next to you, then wind-jumps from there and smashes down. Nothing but the game's own moves: the pearl takes it where it lands, like yours does. Turn it off with \`mace.pearl-launch: false\`.
- **After a miss** with no rockets left, it saves itself the way you would: a wind charge just before it lands, a water bucket, or the elytra again.
- **Against you** (\`combat.mace-defence\`, on by default): when you come down on a bot with a mace (a wind jump, a dive, a pearl in), it does something about it, but not every time, like a person. It gets its shield up in time, sprints out from under you and stays clear until you land (then comes for you), or pearls away. Now and then it doesn't react at all. It sees a mace on your hotbar too, so swapping to it at the last moment doesn't hide it.

\`mace.wind-jump\`, \`mace.elytra\`, \`mace.elytra-combo\` and \`mace.pearl-launch\` turn each move off, and \`mace.cooldown-seconds\` is the least time between mace attacks. \`mace.how-often\` sets how keen bots are on these moves: \`100\` is normal, \`50\` half as often, \`200\` twice as often (10 to 400). Normal pearl throws go by \`combat.pearl-cooldown-seconds\` instead.

## Cart PvP

Give a bot **TNT minecarts, rails, cobwebs, arrows and a bow or crossbow**, plus **flint and steel** unless the bow has Flame (a crossbow can't have Flame, so it always needs flint and steel). Any rail works: plain, powered, detector or activator. Put them in the bot's **inventory**, not its hand. Close to its target (about 3 to 5 blocks), it does what a cart player does, quickly:

1. A **cobweb** on them, so they're stuck.
2. A **rail** right beside them, on its side, and a **TNT minecart** on the rail.
3. With no Flame, **fire** on the ground just before the cart.
4. A step back, then a **burning arrow** into the cart: a Flame bow lights its own arrow, otherwise the arrow catches fire going through the fire. The cart goes off.

- A **crossbow** is kept loaded. It loads as the fight starts and again straight after each shot, so firing is a single click.
- Every step is the game's own: the rail, cart and fire are placed by using the item on the block, the arrow comes from the real bow, and the game's explosion does the damage. A cart blast is big, for the bot too, so give it **totems** and good armour.
- **Up close:** with its target right next to it, it cobwebs them where they stand, steps back to about 3 to 4 blocks, and goes from there. With no cobwebs it can't hold them, so it waits for a gap.
- **Rain** puts a burning arrow out, as for anyone, so bots don't try carts in the rain.
- It misses now and then, like a player, and has another go with a bow while the cart's still there.
- \`cart.enabled\` turns it off, \`cart.cooldown\` (\`3\`) is the least time between carts in seconds, and **Cart PvP** in a bot's settings switches it for one bot.

## Crystal PvP

Give a bot **end crystals** and **obsidian** (it uses obsidian or bedrock that's already there too). Within \`crystal.range\` (5 blocks) of its target, it fights the way a crystal player does:

- It puts obsidian down beside its target, places a crystal on top and hits it. Then the next one, several times a second.
- Everything is the game's own: real placements, real hits and the game's real explosion, so armour, Blast Protection and totems all count.
- Before each crystal it works out, the way the game does, how hard the blast would hit its target and itself: how far, and how much of each body the blast can see, after armour and enchantments. It picks the spot that hurts its target most for the least to itself.
- It never sets one off that would kill it without a totem in its hand, or that would cost it more than \`crystal.max-self-damage\` health (unless that would finish its target). Low on health itself, it only takes crystals that cost it little, and eats a golden apple when it can.
- It only places a crystal where it can also hit it (a player can place further than they can hit). If two in a row can't be set off, say because its target was knocked up out of the blast, it stops placing for a second instead of filling the ground with crystals.
- Made for **fast-crystal servers**, where a crystal can be hit the moment it's placed: a place and a hit take two ticks. \`crystal.per-second\` (\`8\`) sets how fast it goes (1 to 20).
- Give it **armour and totems**. Crystals hurt both sides, and a bot with no armour won't crystal at all, as nothing it could place would be worth it.
- \`crystal.enabled\` turns it off, and **Crystal PvP** in a bot's settings switches it for one bot. A config from before 6.0.11 had crystals switched off while they were reworked; it's switched on once, when it updates.

## Fighting back

Bots fight back:

- **Players:** when a player hits a bot, it hits back. This works whether the bot is standing about, roaming or patrolling. It never chases players in creative or spectator.
- **Bots:** when another bot hits it **on purpose**, it hits back. A stray sword sweep meant for someone else doesn't count, so a crowd of bots stays on its target.

**Caught off guard** (\`combat.first-hit-cap\`, \`50\`): a bot that isn't fighting anyone, and hasn't been hit for 15 seconds, can't lose more than half its health to the hit that starts a fight, a mace smash from the sky included. So it lives to fight back. Every hit after that is normal. Set the % it may lose (1 to 100); \`100\` turns this off.

**One-hit players** (\`combat.one-hit-players\`, empty): player names listed here are killed by any hit from a bot, whatever the weapon. A bit of fun for a server's own players. Leave it empty for normal fights.

Once that fight is over, the bot goes back to what it was doing. Turn either kind off in the config (\`combat.fight-back.players\` and \`combat.fight-back.bots\`), or for one bot in its settings menu. For practice dummies that just take hits, turn off \`players\`.

A bot does one job at a time: fighting, roaming or patrolling. To give a busy bot a new job, or to open its gear, stop it first. FightBot tells you when, and what it's busy with, for example "Rd1 is fighting Blu".

Rather have new orders just take over? Set \`orders.must-stop-first: false\`. Then a busy bot drops what it was doing and starts the new job. (Opening its gear still needs it stopped.)

## When a fight ends

A fight is over when there's nobody left in it, and the bot is free again straight away:

- In a group fight, a bot moves on to the next opponent until the other side is beaten.
- A target who dies, leaves the server or is removed is dropped.
- A target who goes to another world, through a portal say, gets 30 seconds to come back. After that the bot gives up on them.

## When hits don't land

If a bot keeps swinging but can't hurt anyone, FightBot tells you why, in chat and in the console:

- **PvP is off in that world.** On 1.21.9 and newer, run \`/gamerule pvp true\` in that world. On older versions, set \`pvp=true\` in \`server.properties\` and restart. FightBot's message tells you which.
- **The target is in creative or spectator.**
- **Another plugin is blocking the hits**, such as a no-PvP area, spawn protection or a login plugin. FightBot names the plugin it suspects.
- **Something else**, such as a scoreboard team with friendly fire off, god mode, spawn protection, or AuthMe holding a player who hasn't logged in.

It says so once, then waits longer and longer before repeating itself, so chat doesn't fill up.

## Shields

A bot with a shield in its offhand raises it when you're close, facing it and ready to swing, or falling on it with a mace. Once you've swung, it drops the shield to hit back.

The shield works exactly like a player's:
- It only blocks from the front.
- It only blocks once it's been up for a quarter of a second.
- An axe knocks it out for 5 seconds, so axes and stun slams work on bots.

Like a person, it reacts a moment late, and now and then it misses one. While it holds the shield up, it moves slowly and can't attack.

It gets the shield up **in time**: about half a second before your swing is charged, since a shield takes a quarter of a second to start working. It drops it the moment its own swing is ready, and can jump for a crit with the shield still up.

## Axe fighting

- **Your shield goes up:** after a moment, the bot gets out its axe (from anywhere in its inventory, if it isn't already holding one) and hits your shield. That knocks it out for 5 seconds.
- **Then it punishes:** its sword comes back out for fast hits while your shield is down. A bot whose weapon is an axe gets a sword out of its inventory for this, if it has one (\`combat.axe.punish-with-sword\`). When your shield is back, the axe goes away again.
- **Crits with an axe:** axe players crit nearly every hit, because there's time to jump while the axe charges. Bots do too (\`combat.axe.crit-chance\`, 0.80).
- **Its own shield knocked out:** most of the time it backs off until it's back, still facing you, and hits you if you come after it (\`combat.axe.back-off\`).
- \`combat.use-axe-swap\` (or **Shield breaking** in a bot's settings) turns shield breaking on or off.

## Spears

**Off for now:** turn it on with \`spear.enabled: true\` (or for one bot, with **Spear fighting** in its settings). Then a bot holding a **spear** (1.21.11 and up) fights like a spear player:

- It keeps **2 to 4 blocks** off and **jabs**, since a spear can't hit anything closer than 2 blocks. Too close, and it steps back.
- A spear never crits, so it doesn't jump for them.
- Now and then, with you a few blocks off, it **lowers the spear and charges**. The faster you're closing when the tip meets you, the harder it hits.
- The jab, the charge and **Lunge** are all the game's own, so every spear and enchantment works as it does for you.
- \`spear.charge: false\` turns charging off, and keeps the jabs.

**Spear charges from the elytra.** With an **elytra and firework rockets** too, and elytra flying switched on, a spear bot charges from the air:

- **You're on the ground:** it takes off, flies out and turns, then comes back in low and fast with the spear lowered. Then it pulls up and comes round for another pass, until its rockets run out (\`elytra.max-rockets\`), and lands beside you.
- **You're flying:** it goes straight at you in the air with the spear lowered.
- The damage comes from how fast it's going when the tip reaches you, so at elytra speed one hit can **pop a totem**, even through armour.
- A bot with a **mace** dives with that instead. \`spear.elytra-charge: false\` turns spear charges from the elytra off.

## Elytra: chasing and air fights

**Off for now:** turn it on with \`elytra.enabled: true\` (or for one bot, with **Elytra flying** in its settings). Then give a bot an **elytra and firework rockets** (anywhere in its inventory):

- **Someone gets far away** (more than 24 blocks): it puts the elytra on, takes off, crosses to them on rockets, and glides down to land beside them. Its chestplate goes back on, and it fights on foot.
- **Someone flies off on an elytra:** it goes after them in the air, leading where they're going, and hits them mid-flight with its weapon. A bot with a spear charges them with it. See Spears.
- It levels off before the ground, so it lands without fall damage.
- **Won the fight in the air** (or told to stop)? It glides back down to where the fight was, circling down round the spot, and lands there with its chestplate back on, instead of drifting off. Stuck against a tree or a wall, it drops out of the glide and lands.
- A **mace** bot dives on you from the elytra instead. See Mace. A **spear** bot makes spear runs at you. See Spears.

| Setting | Default | What it does |
|---|---|---|
| \`elytra.enabled\` | \`false\` | Elytra flying at all. Also **Elytra flying** in a bot's settings. |
| \`elytra.chase\` | \`true\` | Flying after players who get far away. |
| \`elytra.chase-distance\` | \`24\` | How far off someone has to be before it flies (12 to 200). |
| \`elytra.air-fights\` | \`true\` | Chasing and hitting players who are flying. |
| \`elytra.max-rockets\` | \`8\` | Rockets it may use on one flight. |

## Bows and crossbows

Give a bot a **bow or crossbow and some arrows** (anywhere in its inventory). It shoots at players it can't hit with its weapon: further off than 8 blocks, or somewhere it can't walk to.

- It **draws**, then **aims ahead** of someone running and **high enough** for the arrow's drop, and lets go. The game does the shot, so Power, Punch, Flame, Infinity, Piercing, Multishot, Quick Charge and tipped or spectral arrows all work.
- A **crossbow** loads first, then fires when it has a clear shot. It keeps a loaded crossbow loaded for next time.
- It moves slowly while it draws, like you. When you come close, its weapon comes back out.
- Its aim isn't perfect: it misjudges your speed a little and its hand isn't quite steady (\`ranged.aim-error\`).
- Arrows it walks over go back in its inventory.
- A bot carrying a cart PvP kit keeps its bow or crossbow for the carts.

| Setting | Default | What it does |
|---|---|---|
| \`ranged.enabled\` | \`true\` | Bows and crossbows. Also **Bow & crossbow** in a bot's settings. |
| \`ranged.min-distance\` | \`8\` | Closer than this, it fights hand to hand. |
| \`ranged.max-distance\` | \`40\` | Further than this, it doesn't shoot. |
| \`ranged.aim-error\` | \`1.0\` | How unsteady its aim is, in degrees. \`0\` never misses a still target. |

## Cobwebs

Bots handle cobwebs like players do:

- **Stuck in one**, a bot creeps at a quarter of its pace and can't jump out. Its water bucket washes out a web at its feet.
- **No hitting through a cobweb.** A player's swing stops at the first block outline in the way: a cobweb, even one round your own head. Bots are the same. With a web in the way it **cuts it first**: about half a second with a sword or shears (it gets one out of its inventory if it has one), much longer by hand. Then it hits.
- **Using them in a fight.** Give a bot cobwebs and it uses them now and then, like a good player (raise \`cobwebs.how-often\` for more):
  - **Feet trap:** someone close (1 to 4 blocks) gets a cobweb at their feet. Stuck, they're slow and easy to hit.
  - **Head trap:** straight after, one on top, round their head. They can't hit back until they cut it.
  - **Ahead of runners:** one in the path of someone running off.
  - **While healing:** one on someone chasing it while it backs off to heal.
  - **Cutting itself free:** stuck in a cobweb with its target out of reach, it cuts its way out with a sword or shears.

| Setting | Default | What it does |
|---|---|---|
| \`cobwebs.how-often\` | \`100\` | How keen bots are on cobwebs (10 to 400). \`100\` is now and then, \`50\` half as often. Above \`100\` a bot doesn't hold on to its webs: at \`200\` someone close gets webbed within about 2 seconds. |
| \`cobwebs.cooldown-seconds\` | \`2\` | The least time between one cobweb and the next, at \`how-often: 100\`. |
| \`cobwebs.trap-feet\` | \`true\` | Cobwebs at the feet of someone close. |
| \`cobwebs.trap-head\` | \`true\` | Then one on their head. |
| \`cobwebs.ahead-of-runners\` | \`true\` | Cobwebs in the way of someone running off. |
| \`cobwebs.while-healing\` | \`true\` | Cobwebs on someone chasing it while it heals. |
| \`cobwebs.cut-own\` | \`true\` | Cutting its way out of a cobweb it's stuck in. |

The **Cobwebs** switch in each bot's settings turns all of this off for that bot.

## Knockback

Bots take knockback exactly like players. They fly the same distance, and sprint hits, Knockback enchantments and knockback resistance (netherite armour) all count. A bot knocked into the air can only steer a little, just like you.

## Water and rivers

Bots swim. A bot going after someone across a river swims over and climbs out on the far side.

- Like a player, a swimming bot can only climb out where the land is level with the water. It swims along the bank to a place where it can.
- A path, a bridge or a low spot a few blocks along beats a long swim, so bots take it.
- Shallow water is waded through.
- A drop into water is only jumped when the water is deep enough to land in safely. A shallow stream at the bottom of a drop is treated like any other drop.
- A target right beside the water, close enough to hit, is fought from the bank.
- Free roamers stay on dry land. One that ends up in the water anyway, knocked in say, swims to the nearest place it can get out.
- With building on, a bot may put a block down to climb out of a river with steep banks. It only does this when it's after a target, or on a route it's allowed to build along.` },
  { id: "the-bot-settings-menu", title: "The bot settings menu", body:
`Every bot has its own menu. Open it with \`/fb settings\` (then pick a head), \`/fb settings <bot>\`, or \`/fb edit <bot>\`.

Hover over the head at the top to see the bot's health, group, what it's doing and how many settings you've changed.

| Button | What it does |
|---|---|
| **Bring here** | Teleports the bot to you, facing the way you are. |
| **Go to bot** | Teleports you to the bot. |
| **Rename** | You type the new name in chat. Type \`random\` for a made-up one, or \`cancel\`. |
| **Clone** | A copy with a random name, the same gear and the same settings. Stays open, so you can keep clicking. |
| **Change group** | Moves it to another group, or **No group**. |
| **Open gear** | Its inventory. Stop it first if it's busy. |
| **Stop** | Stops whatever it's doing. |
| **Heal** | Back to full health. |
| **Roam** / **Patrol** | Sets it roaming or patrolling. |
| **Reset settings** | Every switch goes back to the server's settings. |
| **Remove bot** | **Shift-click** to remove it, so it can't happen by accident. |

Renaming keeps everything: skin, gear, health, settings, group and fight. Minecraft doesn't let a player change their name while they're in the world, so behind the scenes the bot is swapped for an identical one with the new name. That's why you see it "join the game".

## Per-bot switches

Your \`config.yml\` sets how every bot behaves. These switches let one bot be different from the rest.

| Switch | What it controls |
|---|---|
| Ender pearls | Throwing pearls to chase and to escape. |
| Cobwebs | Placing cobwebs to trap and slow players. |
| Shield | Raising its shield to block hits. |
| Shield breaking | Switching to an axe to break a raised shield. |
| Water bucket | Washing out cobwebs and clutching big falls. |
| Potions | Splashing potions for the buff. |
| Mace combat | Pearling up and diving in with a mace. |
| Fights back: players | Hitting back when a player hits it. |
| Fights back: bots | Hitting back when another bot hits it on purpose. |
| Pillaring | Going straight up when you're above it. |
| Bridging | Crossing gaps and water when there's no way round. |
| Mining | Breaking blocks in its way with a pickaxe. |
| Realistic ping | A wandering ping in the tab list. |
| Bow & crossbow | Shooting players out of reach. |
| Spear fighting | Jabbing and charging with a spear. |
| Elytra flying | Flying after far-off players, and fighting in the air. |
| Cart PvP | Cobwebbing players and blowing them up with a TNT minecart. |
| Crystal PvP | Placing end crystals by players and setting them off. |

- **Glowing means on.** Click to flip a switch.
- **Right-click** hands a switch back to the server, so it follows \`config.yml\` again.
- Changes apply the moment you click. There's no save button.

A bot's settings belong to that bot. They're gone when it dies or the server restarts. To keep a setup, put it in a **save** (below).` },
  { id: "equipment", title: "Equipment", body:
`Right-click a bot **in creative mode**, or use **Open gear** in its menu.

It's laid out like your own inventory:

| Where | What |
|---|---|
| Top row, slots 1 to 4 | Helmet, chestplate, leggings, boots |
| Top row, slot 6 | Offhand: a totem or shield |
| Top row, slot 8 | Main hand: its weapon |
| Second row | Panes, between its armour and what it carries |
| Rows 3 to 6 | Anything else (row 3 is where a player's hotbar would be) |

**Shift-click** things from your own inventory and they go where they belong: armour on, a shield or totem in the offhand, a weapon in its hand, the rest below. Armour slots only take the armour worn there. Saves and kits made before 5.17.3 are moved into this layout by themselves.

Only armour, the offhand and the weapon have fixed slots. Everything else can go **anywhere**, and the bot finds and uses what it carries:

- an axe
- food: eaten like a player eats it. Food fills its hunger, and the health comes back from that (fast while it's full up), so a hurt bot that isn't hungry heals by itself. In a fight it eats a golden apple first, for its effects; standing about, it saves them and eats ordinary food when it's hungry.
- cobwebs
- ender pearls
- a water bucket
- a mace and wind charges
- an elytra, and firework rockets
- a pickaxe
- bottles o' enchanting, to mend Mending gear
- a bow or crossbow, and arrows
- a spear (it can be the weapon too)
- TNT minecarts, rails and flint and steel, for cart PvP
- end crystals and obsidian, for crystal PvP

## Wear and mending

Bot gear wears out and breaks like yours. A bot wearing **Mending** gear, with **bottles o' enchanting** anywhere in its inventory, mends like a player: it throws the bottles down in front of itself and picks up the XP. The repair is the game's own, so a worn-out netherite set takes over a hundred bottles.

- \`gear.mending-throw-speed\` (\`0.5\`): how hard it throws each bottle.
- \`gear.mending-throw-angle\` (\`45\`): how far down it throws. \`0\` is straight ahead, \`90\` is at its feet.
- \`gear.repair-after-fight-seconds\` (\`30\`): a bot standing about gets its gear back to full this long after its last fight. A bot that never fought, like a practice dummy, always has full gear.

A bot mends until its Mending gear is back above 60%, or it runs out of bottles (20 seconds at most), backing off from you while it does. Hurt, it eats a gapple first, then goes back to the bottles. Bottles come in bursts with a short pause (\`gear.mending-burst\`).` },
  { id: "kits-and-saves", title: "Kits and saves", body:
`\`/fb kits\` (or \`/fb saves\`) opens one screen, with **Kits** on one side and **Saves** on the other. Both hold up to five loadouts and survive restarts.

## Kits: re-gear bots you already have

| Command | What it does |
|---|---|
| \`/fb saveload <bot> [1-5]\` | Stores a bot's gear as a kit. Leave out the number to use the first free slot. |
| \`/fb kit <bot> <1-5>\` (or \`load\`) | Gives one bot the kit, replacing what it carries. |
| \`/fb kit --all <1-5>\` | Gives every bot the kit. Busy bots are skipped, and FightBot tells you how many. |
| \`/fb kit --group <group> <1-5>\` | Gives a whole group the kit. |
| \`/fb delload <1-5>\` | Deletes a kit. |

In the screen, click a kit, then click as many bots as you like. Each one drops off the list once it has the kit. Close the screen when you're finished.

## Saves: spawn new bots already set up

| Command | What it does |
|---|---|
| \`/fb savegear <bot> [1-5]\` | Stores a bot's gear **and settings**. Leave out the number to use the first free slot. |
| \`/fb save <1-5> [name\\|--random] [count]\` | Spawns bots from a save. |
| \`/fb delsave <1-5>\` | Deletes a save. |

A save only remembers the settings you changed on that bot, so later config changes still reach everything else. Hover over a save to see which settings its bots spawn with.

**Potion effects:** saves and kits keep the bot's potion effects too, so a bot saved while invisible comes out invisible. Give the effect first, then save: \`/effect give <bot> invisibility infinite 0 true\` (\`true\` hides the particles), then \`/fb savegear <bot> 1\`. Effects keep their level and time left (or last forever, given with \`infinite\`). Bots also keep their effects over a restart or reload.` },
  { id: "groups", title: "Groups", body:
`Bots **and players** can be in a group, one group at a time; adding one that's in another group moves it.

**Teams.** Players in a group are on the team with its bots. In a group fight, the other side goes after them too, so 3 against 300 works: all 300 go after the 3. With \`groups.friendly-fire: false\` (the default), a bot never fights back against someone in its own group, player or bot. \`true\` lets teammates fight back.

**Adding a bot to a group that's busy:** a free bot joins in with whatever the group is doing together: roaming, patrolling or a fight. A busy bot keeps at its own job and goes with the group's next order once it's free. With \`orders.must-stop-first: false\` it drops its job and joins in straight away. A bot can't join a group that the route it patrols is hunting.

| Command | What it does |
|---|---|
| \`/fb groups\` | Opens the groups screen. |
| \`/fb groupcreate <name>\` | Makes a group. |
| \`/fb groupadd <group> <bot\\|player>\` | Puts a bot, or an online player, in it. |
| \`/fb groupadd <group> --all\` | Puts every bot in it. |
| \`/fb groupremove <group> <bot\\|player>\` | Takes a bot or a player out. |
| \`/fb groupdel <group>\` | Deletes a group. Its bots are freed. |
| \`/fb grouplist [group]\` | Lists groups, or one group's members. In game, this opens the screen. |
| \`/fb groupcheck <bot>\` | Which group a bot is in. |
| \`/fb groupchange <group> <new name>\` | Renames a group. |

Groups keep their names across restarts. Bots that come back after a restart are back in their group; players have to be added again.

## Group fights

| Command | What it does |
|---|---|
| \`/fb groupfight <group> <group>\` | Two groups fight as one-on-one duels. Each bot takes one opponent until one falls, then picks the next. |
| \`/fb groupfight <group> <player\\|bot>\` | The whole group goes after one target. |
| \`/fb groupstop <group> [group]\` | Stops one group, or both sides of a fight. |` },
  { id: "roaming-and-patrolling", title: "Roaming and patrolling", body:
`Bots can walk a **route**, or wander about **freely**, when they aren't fighting. Routes are shared between roaming and patrolling. The route and point commands work with either prefix (\`roaming…\` or \`patrolling…\`).

## Making a route

1. \`/fb roamingroutecreate park\` makes a route called \`park\`.
2. Stand on each spot and run \`/fb roamingpointset park\`. Each run adds the next point.
3. To move a point to where you're standing, use \`/fb roamingpointset park <number>\`. To delete one, use \`/fb roamingpointdel park <number>\`.

\`/fb roaming\` or \`/fb patrolling\` opens the same things as screens.

## Roaming

| Command | What it does |
|---|---|
| \`/fb roamingstart <bot\\|--all\\|--group <group>> <route> [loop\\|back\\|stop]\` | Walks the route. At the end it loops, walks back, or stops. |
| \`/fb roamingfree <bot\\|--all\\|--group <group>>\` | Wanders about near where it is, pausing now and then. |
| \`/fb roamingstop <bot\\|--all\\|--group <group>>\` | Stops roaming. |

A group sent on a route walks it together, as a squad. If a roaming bot is attacked, it fights back, then goes back to its walk.

Free roamers now and then stop to look at a bit of grass. With Mining on, they sometimes pull it up. They don't go swimming. In the config:
- \`roaming.free-radius\` sets how far a free roamer strays.
- \`pause-min-seconds\` and \`pause-max-seconds\` set how long it stands about between strolls.
- \`point-pause-seconds\` sets how long a route walker waits at each point.

## Patrolling

A patrol walks a route and goes after **that route's targets**, and only those. After the fight it goes back to its route. Targets who are gone (logged off, removed, or a group that was deleted or emptied) come off the route once nobody is patrolling it. While a patrol runs, it keeps them, and goes after them again when they're back.

| Command | What it does |
|---|---|
| \`/fb patrollingtargetadd <route> <player\\|bot\\|group>\` | Gives the route's patrols a target. |
| \`/fb patrollingtargetdel <route> <name>\` | Removes a target. |
| \`/fb patrollingtargetlist <route>\` | Who the route's patrols hunt. |
| \`/fb patrollingstart <bot\\|--all\\|--group <group>> <route> [loop\\|back\\|stop]\` | Patrols the route. |
| \`/fb patrollingstop <bot\\|--all\\|--group <group>>\` | Stops patrolling. |

\`patrolling.spot-range\` sets how close, and in sight, a target has to be before it's spotted. \`patrolling.give-up-seconds\` sets how long a target can stay out of reach before the patrol goes back to its route.` },
  { id: "skins", title: "Skins", body:
`Choose where skins come from with \`identity.skin-source\` in \`config.yml\`, then run \`/fb reload\`:

| Setting | What bots wear |
|---|---|
| \`random\` | **The default.** FightBot's own skins: about 970 that come in the jar already signed (ready at once, nothing to download), a few looked up from Mojang, and real names with their own skins that it finds by itself. There's nothing else to do. See Names with their own skins. |
| \`folder\` | Your own skin images. Put skin \`.png\` files (64×64, or old-style 64×32) in \`plugins/FightBot/skins/\`. |
| \`mojang\` | The skins of real accounts. List their usernames under \`identity.skin-names\`. |
| \`none\` | Plain Steve and Alex. |

\`random\` is the default from 6.0.1. A config still on \`none\`, the old default, is switched to \`random\` once when it updates. Set it back to \`none\` and it stays.

**Type \`/fb skins\` in game at any time.** It shows your current setting, how many skins are ready, what's still in progress, and anything that went wrong.

Skins work the same on both builds. On Spigot and CraftBukkit, the bot heads in the menus show each bot's skin too.

## About signing (the "wait" messages)

Minecraft only shows a skin that Mojang has signed. In \`folder\` mode, FightBot sends each image to a free signing service (MineSkin) the first time it sees it. It keeps the result, so each image is only ever signed once.

The free service takes a few images at a time. **When the console says the service asked FightBot to wait, that's normal.** Nothing is broken and there's nothing to do. FightBot waits for as long as it's asked, then carries on by itself until every image is signed, with a line like \`Signed skin 4 of 12\` for each one. If the service stays busy for a very long time, FightBot takes a break and signs the rest on the next restart or \`/fb reload\`.

- Until the first image is signed, new bots look like Steve or Alex. After that, each new bot wears one of the images signed so far.
- A bot keeps the skin it spawned with. One that comes back after a restart gets a new skin if its old one isn't from the current \`skin-source\`.
- Want it faster? Get a free API key at [mineskin.org](https://mineskin.org) and put it in \`identity.skin-api-key\`.
- If an image can't be signed, FightBot names it and says why. The usual reason is that it isn't a real 64×64 skin. Fix or remove the image, then \`/fb reload\`.
- Added images while the server is running? Run \`/fb reload\`.

Already have signed skin data? Save it as a small \`.yml\` file in the skins folder, with a \`value:\` line and a \`signature:\` line. The \`README.txt\` in that folder explains how.

## Names with their own skins

With \`skin-source: random\`, FightBot finds more skins by itself. **While nobody is on your server** (bots don't count), every 10 seconds it:

1. Makes up a few names, the same way it makes up bot names (\`jake2011\`, \`SleepyPanda\`...).
2. Asks Mojang which of them are real accounts, and what they wear.
3. **No account, no skin, or one of the game's default skins** (Steve, Alex and the other seven)? It skips the name. A skin worn by lots of accounts is skipped too.
4. **A skin of its own?** It keeps the name and its skin.

Then, with \`name-source: random\` (the default), **new bots get those names, each wearing its own skin**. Bots named another way (from \`botnames.yml\`, numbered, or \`/fb spawn Name\`) keep their names and wear one of the skins instead.

- It keeps at most one name each time, so up to 360 an hour. Fewer when the names it tries have no skin of their own.
- Everything it finds is kept in \`skins/cache/names.txt\`, so no name is checked twice. Delete the file to start over.
- Until some are found, new bots get a made-up name and one of the built-in skins.
- Names found by 5.20.3 and older came from the old Minecraft-themed made-up names (\`BlockBuddy22\`, \`CreeperKidYT\`). Bots don't get those names any more, but their skins are still worn. They don't count towards \`max\`, and they make room for new ones once it's reached.
- **The console says when it finds some:** the first one straight away, then one line every 10 minutes at most (*"Found 8 more names with their own skin (42 in all)."*).
- \`/fb skins\` shows how many it has found, how many are new since the server started, and what it's doing. If it's waiting for players to leave, it says who's on.
- These are real people's names and skins. If the real owner joins your server, the bot steps aside, the same as with any other name.
- Rather not see a certain skin? Add it to \`identity.skip-skins\`: the long code at the end of its \`textures.minecraft.net\` address, or the whole address.
- **\`/fb skins names\`** lists every name it found, with a click-to-copy button (Paper build), and saves them all to \`skins/found-names.txt\`.

| Setting | Default | What it does |
|---|---|---|
| \`identity.find-skins.enabled\` | \`true\` | Finding more skins. |
| \`identity.find-skins.every-seconds\` | \`10\` | How often it looks (5 to 3600). |
| \`identity.find-skins.only-when-empty\` | \`true\` | Only while nobody's on. \`false\`: it keeps looking while players are on too. |
| \`identity.find-skins.max\` | \`5000\` | It stops once it has found this many (up to 50000). |

\`skin-source: name\` from 5.18.0 is now part of \`random\`. An old config is switched over by itself, and the names it found are kept.

## Capes

Minecraft only shows real capes, ones Mojang gave an account, so a cape can't be made from a picture. Bots wear capes that **come with a borrowed skin**: built-in skins, found names (\`random\`) and \`skin-names\` accounts (\`mojang\`) that had a cape on.

- \`identity.capes.enabled\` (\`true\`): capes at all.
- \`identity.capes.chance\` (\`30\`): how many bots in 100 wear one, as near as the skins it has allow.
- \`/fb skins\` shows how many found names have a cape.

\`mojang\` and \`random\` mode download skins in the background the same way. The first bots after a fresh start may look plain for a moment. Mojang also asks for a short wait sometimes, and that's normal too.` },
  { id: "names", title: "Names", body:
`Choose how \`--random\` names are made with \`identity.name-source\`:

| Setting | Names |
|---|---|
| \`random\` | Made-up names that look like real players' names, like \`jake2011\`, \`SleepyPanda\`, \`itz_ava\` or \`NoahPlays\`. Never a short "rare" name. This is the default. |
| \`file\` | Picked from \`botnames.yml\`. |
| \`numbers\` | Numbered names, from \`identity.number-format\`. |

Number patterns use \`%<digits>n\` for one random character from those digits, and you can chain them. For example, \`Bot%01n%01n\` gives \`Bot00\`, \`Bot01\`, \`Bot10\` or \`Bot11\`. Watch how many names a pattern can make: \`%01n\` only has two, so a third bot gets a made-up name instead, and FightBot tells you why. The older style also works: \`%03d\` gives a random number padded to three digits, like \`042\` or \`517\`.

With \`file\`, if \`botnames.yml\` is empty or every name in it is taken, bots get made-up names, and FightBot says so in chat.

\`identity.protect-real-names\` (on by default) stops bots taking the name of anyone who has played on your server. Turn it off to let bots use those names too, for example on a scripted server. Online players, AuthMe and nLogin accounts, and banned names are still off-limits.` },
  { id: "kicks-and-bans", title: "Kicks and bans", body:
`Bots are players, so they can be kicked and banned like players.

- **\`/kick <bot>\`** removes the bot, the same as \`/fb remove\`.
- **\`/ban <bot>\`** removes it, and the name can't be spawned again until you run **\`/pardon <bot>\`**. FightBot tells you this if you try.
- Bans from plugins that keep their own ban list, like LiteBans, still remove the bot. Only the server's own list stops the name being spawned again.
- **Ban plugins** work too. This includes death-ban plugins like the Unstable SMP ones, which kick and then ban a player who dies. The bot is removed, and its name stays banned until it's pardoned.
- Random names skip banned names.

Some kicks are ignored for bots, because they can only be about a real player's game:

- flying, lag and odd packets
- idling
- turning down the resource pack
- the whitelist (bots skip it)
- IP bans (every bot shares one address, so one IP ban would take them all)

FightBot notes this in the console the first time it happens.` },
  { id: "other-plugins", title: "Other plugins", body:
`FightBot checks what's installed at startup and says, in the console, anything that affects bots.

- **AuthMe:** bots can't type a password, so FightBot logs its own bots in as they join. It only does this for bots, and no AuthMe accounts are made. A name that has an AuthMe account belongs to a real player, so it can't be used for a bot.
- **nLogin:** nLogin sets each player up while they connect, and a bot never connects the way a player does, so nLogin can't log it in. Instead, as each bot joins, FightBot puts its name on nLogin's list of names that skip the login (\`limbo.unrestricted.nicknames\`, which nLogin has for plugins that make players). The name is only in nLogin's memory, never written to its config, and it comes off the list when the bot leaves. Nothing goes into nLogin's accounts. A name that already has an nLogin account belongs to a real player, so it's never used for a bot. Tested with nLogin 2.0.24.
- **SimpleLogin:** bots can't type a password, so FightBot marks its own bots logged in as they join, and takes off the blindness and frozen walking speed SimpleLogin puts on new players. Nothing goes into SimpleLogin's accounts. SimpleLogin keeps accounts by player ID, and a bot's ID is FightBot's own, so a bot can never use a real player's account.
- **Other login plugins** (LoginSecurity, LibreLogin and others): these hold players who haven't logged in, and bots can't log in. If bots won't fight, that's why.
- **PacketEvents** (on its own or inside GrimAC): it tries to kick players whose connection it can't hook, and bots have none. FightBot stops that kick, for bots only.
- **ViaVersion:** its "Could not find UserConnection" warning when a bot joins is harmless.
- **ProtocolLib:** plugins built on it expect every player to have a network connection. Bots don't, so if one logs errors naming a bot, that's why.
- **Anticheats:** they judge players by what their game sends, and bots have no game. If one kicks a bot, FightBot says why.
- **PvP turned off** in a world: FightBot warns at startup and when a bot's hits don't land.
- **LuckPerms:** see LuckPerms below.
- **Simple Voice Chat:** bots can talk, and answer you with AI. See [Voice lines](#voice-lines-simple-voice-chat) and [AI voice chat](#ai-voice-chat).
- **Emotecraft** and **Customizable Player Models:** emotes and models on bots. See [Emotes and player models](#emotes-and-player-models).
- **PlugManX** and \`/reload\`: see [Reloading FightBot](#reloading-fightbot-plugmanx-reload) below.

## LuckPerms

With LuckPerms on the server, each bot gets its LuckPerms data as it joins, just like a player:

- **Groups, permissions, prefix and suffix.** Tab list, name tag and chat plugins show a bot's prefix like anyone else's.
- **Permission checks.** LuckPerms answers every permission check on a bot. If a bot isn't allowed to do something, it can't do it.
- **\`/lp user <bot>\` works.** Give a bot a rank with \`/lp user <bot> parent add vip\`, and every bot with that name has it from then on.

Settings:

- \`luckperms.group\` puts every bot in a LuckPerms group while it's here, on top of its own groups. Use it for a \`[Bot]\` prefix, or for permissions only bots should have. Make the group first with \`/lp creategroup bot\`. It's kept in memory only, never saved.
- \`luckperms.enabled: false\` turns all of this off.

If a bot is spawned with the name of someone LuckPerms already knows, \`/lp user <name>\` still means that player, not the bot.

**Selling longer AI chats:** chats with bots have no limit by default. Give \`fightbot.ai.limited\` to the players who should get \`ai.limited-replies\` answers (2), and take it off a rank you sell:

\`\`\`
/lp group default permission set fightbot.ai.limited true
/lp group vip permission set fightbot.ai.limited false
\`\`\`` },
  { id: "voice-lines-simple-voice-chat", title: "Voice lines (Simple Voice Chat)", body:
`With the **Simple Voice Chat** plugin on the server, bots show up in voice chat like players, and they talk. Players hear them with the voice chat mod, coming from the bot, and can turn bots up or down with the **FightBot** slider in voice chat's volume settings. Without Simple Voice Chat, nothing changes. \`/fb vc\` shows whether it's working.

**How bots show up.** Each bot gets one of these when it joins, like real players (\`voice.presence\` sets the chances):

| | In voice chat | Says lines? |
|---|---|---|
| \`talks\` | Connected | Yes |
| \`deafened\` | Voice chat turned off (the crossed-out speaker) | No |
| \`no-mod\` | Doesn't have the mod (the disconnected icon) | No |

Change one bot with \`/fb vc presence <bot> <talks|deafened|no-mod>\`. A deafened bot, or one without the mod, stays quiet like a player would, even when you tell it to say something. (Voice Chat has no muted-microphone icon it can show above other players, so a quiet bot shows as deafened.) A bot wearing a CPM model always shows as connected and stays quiet - see Player models.

**FightBot's own lines.** These come in the jar, and bots say them by themselves. Anyone can also play them with \`/fb vc <name>\`:

| Line | When a bot says it by itself |
|---|---|
| \`hello\` | As it joins: 1 in 50 bots |
| \`am_i_muted\` | As it joins, the rare one: 1 in 200 |
| \`grass\` | When it pulls up grass while roaming: 1 in 100 times |

More come with updates. Each bot speaks in one voice, so it always sounds like the same person. \`voice.triggers\` sets how often (a % of those odds) and a cooldown for each moment, and \`voice.min-gap-seconds\` and \`voice.max-talking\` stop bots talking over each other. Rather bots only talk when you say so? \`voice.on-their-own: false\`.

**Your own lines.** Put \`.mp3\` or \`.wav\` files in \`plugins/FightBot/voice/\`, then \`/fb vc reload\`. The file's name is the line's name: \`plotvoiceline.mp3\` is \`/fb vc plotvoiceline\`. Lines are cut off after \`voice.custom.max-seconds\` (15 by default). You can also add them in the [web editor](#the-web-editor), which converts other kinds of sound file, like a phone's \`.m4a\`, for you.

**Nobody can pass off a file as FightBot's.** A file added to a server is **never** said by a bot on its own, only when someone types \`/fb vc <name>\` (that needs \`fightbot.voice.custom\`, which ops have). Everyone near the bot sees a note in chat that it's *a sound file added by this server*, and who played it. Every play, and every file added through the web editor, is written to \`voice/plays.log\` with the file's fingerprint (SHA-256).

| Setting | Default | What it does |
|---|---|---|
| \`voice.enabled\` | \`true\` | Bots in voice chat at all. |
| \`voice.on-their-own\` | \`true\` | Bots say FightBot's lines by themselves. \`false\`: only when played with \`/fb vc\`. |
| \`voice.presence.talks\` / \`deafened\` / \`no-mod\` | \`50\` / \`20\` / \`30\` | How bots show up, as chances. (\`muted\` from 6.0.0's test builds moves over by itself.) |
| \`voice.distance\` | \`0\` | How far away bots are heard, in blocks. 0 is voice chat's own distance. |
| \`voice.volume\` | \`1.0\` | How loud bots are (0.5 = half, 2.0 = twice). Every line is evened out to the same loudness first, so loud recordings don't blare. Players also get a FightBot slider in voice chat. |
| \`voice.triggers.<what>\` | | \`enabled\`, \`chance\` (a % of each line's own odds: 100 = as set, 200 = twice as often) and \`cooldown\` (seconds) for each moment a bot talks about. |
| \`voice.custom.enabled\` | \`true\` | Whether files added to the server can be played at all. |` },
  { id: "ai-voice-chat", title: "AI voice chat", body:
`Talk to a bot in Simple Voice Chat and it answers out loud, in a word or two ("Hi", "Good"), then gets back to fighting. It only answers greetings and short questions - no small talk. It uses your own key with an AI company: **Groq** (the default - it has a free plan), **Google Gemini** or **OpenAI**.

**Setting it up (Groq):**

1. Make a key at **console.groq.com** (API Keys > Create API Key).
2. In \`config.yml\`: \`ai.enabled: true\`, \`ai.provider: groq\`, and the key in \`ai.api-key\`. The web editor can switch AI chat on, but it never shows or sets the key: that only ever goes in the file on your own server.
3. \`/fb reload\`, then \`/fb ai\`: it should say **listening**.

**Talking to a bot:** stand within 8 blocks (\`ai.range\`), look at it and say something short. Only bots that talk in voice chat answer (\`/fb vc presence <bot> talks\`). With CPM on the server, bots stay quiet and don't answer (see Player models). The first time a player is near one, they're told that what they say to it goes to the AI company. Nothing else they say is used.

| Setting | Default | What it does |
|---|---|---|
| \`ai.enabled\` | \`false\` | AI chat at all. |
| \`ai.provider\` | \`groq\` | \`groq\`, \`gemini\` or \`openai\`. |
| \`ai.api-key\` | | Your key from that company. Never shown or set from the web editor - put it in \`config.yml\` yourself. |
| \`ai.model\`, \`ai.listen-model\`, \`ai.speak-model\`, \`ai.voice\` | blank | Blank: FightBot's defaults. Groq: \`openai/gpt-oss-20b\` thinks, \`whisper-large-v3-turbo\` listens, \`canopylabs/orpheus-v1-english\` talks in the voice \`autumn\`. |
| \`ai.range\` | \`8\` | How close you stand, facing the bot (2-32 blocks). |
| \`ai.replies\` | \`0\` | Answers per chat. \`0\`: no limit. |
| \`ai.limited-replies\` | \`2\` | For players with \`fightbot.ai.limited\` (see LuckPerms). |
| \`ai.words\` | \`3\` | Longest answer, in words (1-12). |
| \`ai.chat-again-minutes\` | \`5\` | After this long, a new chat can start. |
| \`ai.max-per-hour\` | \`120\` | Answers a server gives an hour at most (\`0\`: no limit). |

When the key hits its limit, bots just stop answering and fight; FightBot pauses and tries again later. **\`/fb ai\`** shows whether it's listening, which bots can answer, the last thing it heard and the last answer. **\`/fb ai watch\`** shows each step live in your chat while you test - *hearing you*, what the AI heard, what the bot says, or why nothing happened. With debug on, every step goes in the debug log too.` },
  { id: "emotes-and-player-models", title: "Emotes and player models", body:
`Two mods that change how players look. Each needs its plugin on the server **and** the mod in the player's game - players without the mod see an ordinary bot.

## Emotes

With **Emotecraft** on the server, bots play emotes when you tell them to:

| Command | What it does |
|---|---|
| \`/fb emote\` | Every emote bots can play. |
| \`/fb emote <bot\\|--all\\|--group <group>> <emote>\` | Plays an emote. |
| \`/fb emote <bot\\|--all\\|--group <group>> --stop\` | Stops it. |

Put emote files (\`.json\` or \`.emotecraft\`) in \`plugins/FightBot/emotes/\` and \`/fb reload\`, or upload them in the web editor. An emote is named after its file. A bot told to fight stops its emote. \`emotes.enabled: false\` turns this off.

## Player models

With **Customizable Player Models** (CPM) on the server, each new bot wears one of the models in \`plugins/FightBot/models/\` at random. Put \`.cpmmodel\` files there and \`/fb reload\`, or upload them in the web editor.

- \`identity.models.enabled\` (\`true\`) and \`identity.models.chance\` (\`100\`, how many bots in 100 wear one).
- **A \`.cpmproject\` isn't a model.** It's the CPM editor's save file, which is how a lot of models are shared. Open it in the CPM editor (in game: **Open Skin Editor**), then File > Export with **Export mode: Model**, and use the \`.cpmmodel\` it makes.
- **With CPM on the server, bots show no voice chat icon and stay quiet, by themselves.** Right now the Simple Voice Chat and CPM mods crash some players' games (Minecraft 26.3) when Voice Chat draws an icon above someone: any bot, wearing a model or not. So while CPM is on the server, every bot shows as connected to voice chat (no icon) and never speaks: no voice lines and no AI answers. \`/fb vc\` and \`/fb ai\` say so. Once both mods have fixed it, \`identity.models.voice-safe: false\` turns this off; each bot's own voice chat setting was kept for then.
- Turning models off with \`/fb reload\` takes them off the bots already wearing one.` },
  { id: "the-web-editor", title: "The web editor", body:
`Change FightBot from your browser instead of the server files. Type \`/fb web\` in game (or the console) and click the link - it takes about 5 seconds to make (up to 30 on a slow connection). The editor at fightmc.xyz lets you:

- **change any setting**, with each one explained, and saves and reloads it for you
- **see the bots that are on**, with their health, what they're doing, their group and where, and stop or remove them
- **run the bots**: make them fight, roam or patrol, groups, kits, and each bot's own settings (new bots are only spawned in game)
- **upload skins**, **voice lines**, **emotes** and **player models**, and play emotes on bots
- put bots **and players** in groups, or every bot at once
- **read the debug logs**, follow one live, or download it

**On a network** (Velocity or BungeeCord), each server still has its own editor with \`/fb web\`. Or type **\`/fbp web\` on the proxy** for one link that covers every server: the editor shows a server picker at the top, and each server's own editor opens from there. Anyone with that link can change FightBot on every server, so it's only given to people with \`fightbot.proxy\`. \`/fbp web stop\` closes all of it.

How it stays safe:

- **The link is the key.** Anyone with it can change FightBot on your server, so don't share it. It stops working after \`web.idle-minutes\` unused (30), after \`web.max-hours\` (4), or when you type \`/fb web stop\`. \`/fb web new\` makes a fresh one.
- **Nothing to open up on your server.** Your server and the page both connect out to a relay, and everything between them is encrypted with a key that's only in your link. The relay can't read any of it.
- **Only FightBot's own things.** The editor can't run commands or touch other files, and every change is checked like a config edit. Everyone with \`fightbot.use\` is told in chat what was changed from the web, and by whose link.
- **Slow from far away?** When the link opens, FightBot times the relay. Over 700 ms a message, it tells you in game, and the console always says how fast it was.
- \`web.read-only: true\` lets the editor look at everything but change nothing. \`web.enabled: false\` turns it off. It needs the \`fightbot.web\` permission (ops have it).` },
  { id: "networks-velocity-and-bungeecord", title: "Networks: Velocity and BungeeCord", body:
`## New to proxies?

A proxy (Velocity or BungeeCord) is the **front door** of a network. Players connect to it, and it sends them on to the servers behind it, like a lobby and an arena. The proxy has no worlds and no bots of its own. The bots live on the servers.

- **Which servers need FightBot?** Only the ones where you want bots. Servers without it just show as "not linked" in \`/fbp list\`, and nothing breaks. Bots can only be sent to servers that have FightBot.
- **Two kinds of config.** The proxy has its own (\`velocity.toml\` on Velocity, \`config.yml\` on BungeeCord) for your server list and forwarding. FightBot on the proxy has a small \`config.yml\` of its own in its folder (see the proxy's settings). Each server keeps its full FightBot \`config.yml\`, same as without a proxy.

## What it does

Got a proxy in front of your servers? **Put the FightBot jar (the Paper build) in the proxy's \`plugins\` folder too.** It works on Velocity and BungeeCord, and their forks (like Waterfall). The servers link up to it by themselves. Then:

- **Bots count as players** in the server list's player count, and show up in its hover list of names, alongside real players.
- **Tab list** (Velocity only): bots on the other servers can show in everyone's tab list. Turn this on with \`tab-list: true\` in the proxy's FightBot config, if your network shows everyone in tab.
- **\`/fbp\` on the proxy** runs FightBot commands on any server. See below.
- **Bots can move between servers.** \`/fb send <bot> <server>\` takes a bot to another server with its gear, health, skin and settings, like a player switching servers. It arrives at that server's spawn, or next to a player you name.
- **Kits and saves can be shared.** Turn on \`network.share-kits\` and \`network.share-saves\` on the servers that should share them. A kit saved on one is the same on all of them, and deleting one deletes it everywhere. Whatever a server had before is kept in its \`old-kits/\` folder first.
- **Skins and voice lines can be shared.** Turn on \`network.share-skins\` and \`network.share-voice\`. A skin image or voice line added on one server goes to all the others that share them, and a deleted one goes from all of them. Each server checks what arrives the same way as a web editor upload (skins must be real 64×64 skins, voice lines must play), and keeps anything replaced or deleted in its \`old-files/\` folder. A skin is only ever signed once: the signed copy is shared too.
- **One web editor link for the whole network.** \`/fbp web\` on the proxy gives you one link with a server picker at the top. See [The web editor](#the-web-editor).

\`/fb network\` on a server shows whether it's linked, and the bots on every server.

**Updating:** the proxy updates itself too (5.18.1 and up). It looks on Modrinth when it starts and twice a day, downloads a new version, checks it, and puts it in place when the proxy stops, so the next start runs it. \`/fbp update\` looks right away. On Windows the running jar can't be replaced, so FightBot leaves the new one in its \`update\` folder and says to copy it in. If your proxy has 5.18.0, copy 5.18.1 in yourself once.

## Proxy commands

On the proxy, with the \`fightbot.proxy\` permission (or from the proxy console):

| Command | What it does |
|---|---|
| \`/fbp list\` | Every server, whether it's linked, and its bots. |
| \`/fbp <server> <command>\` | Runs a FightBot command on that server, like \`/fbp arena spawn 5 --random --location 0 64 0\`. The answer comes back to you. |
| \`/fbp all <command>\` | Runs it on every linked server. |
| \`/fbp send <bot> <server> [player]\` | Moves a bot to another server. |
| \`/fbp web\` | One web editor link for every server, with a server picker. \`/fbp web stop\` closes it. |
| \`/fbp update\` | Looks for a newer FightBot for the proxy now. |
| \`/fbp status\` | How the link is doing, and whether an update is waiting. |

## Setting it up

**Velocity with modern forwarding:** nothing to do. The servers already share Velocity's forwarding secret, and FightBot uses it.

**BungeeCord, or Velocity without modern forwarding:** start the proxy once, open \`plugins/FightBot/link-secret.txt\` on it (\`plugins/fightbot/\` on Velocity), and paste what's inside into \`network.secret\` in each server's FightBot \`config.yml\`. Then \`/fb reload\` on each server.

The link is encrypted, and both ends prove they know the secret before anything is sent. The servers connect out to the proxy on port **25599**, so nothing new is opened on the servers.

**Servers on another machine, or in containers** (like a hosting panel): set \`network.proxy\` on each server to the proxy's address and port, like \`"10.0.0.5:25599"\`, and make sure that port is open to them. Once a player has joined a server through the proxy, the proxy tells it its address too.

The proxy's own settings are in \`config.yml\` in its FightBot folder:

| Setting | Default | What it does |
|---|---|---|
| \`link-port\` | \`25599\` | The port the servers connect to. |
| \`link-bind\` | \`0.0.0.0\` | Which address to listen on. \`127.0.0.1\` if every server is on the same machine. |
| \`count-bots\` | \`true\` | Bots count in the player count. |
| \`hover-list\` | \`true\` | Bots show in the server list's hover list. |
| \`tab-list\` | \`false\` | Velocity only: bots on other servers show in the tab list. |
| \`update-check\` / \`update-download\` / \`update-betas\` | \`true\` / \`true\` / \`false\` | The proxy's own updates, as above. |` },
  { id: "reloading-fightbot-plugmanx-reload", title: "Reloading FightBot (PlugManX, /reload)", body:
`You can reload FightBot while the server keeps running, with PlugManX (\`/plugman reload FightBot\`) or \`/reload\`. Turning it off and on again with \`/plugman disable\` and \`/plugman enable\` works too.

- Every bot is written down first and comes straight back afterwards, in the same place, with the same skin, gear, health, settings and group.
- Bots carry on with what they were doing: roaming, patrolling, fighting and group fights.
- Any bot body an older copy of FightBot left behind is removed first, so its name is free again.
- \`reload.keep-bots: false\` removes the bots on a reload instead.

## Server restarts

Bots come back after a server restart too, and after a FightBot update, since that needs a restart.

- As the server stops, every bot is written down. As it starts, they come back where they stood, with the same inventory, skin, health, settings and group.
- They **don't** carry on with what they were doing. Fights and routes start afresh.
- They come back **a few at a time** (\`restart.per-second\`, 10), so a big army doesn't hold the startup up.
- At most **\`restart.max-bots\`** come back (100; \`0\` means all of them). Lower it if your server struggles with lots of bots.
- **Crash-safe:** if the server goes down while bringing them back, the next start doesn't try again. It says so, and keeps them in \`restart-bots-failed.yml\`.
- \`restart.keep-bots: false\` starts every restart with no bots, as before.` },
  { id: "updates", title: "Updates", body:
`When the server starts, and twice a day after, FightBot looks on Modrinth for the newest release made for your Minecraft version.

- A newer one is downloaded into the server's update folder (\`plugins/update\`). FightBot checks it against Modrinth's checksum and makes sure it really is FightBot.
- **It picks the right build for your server:** the Paper build on Paper and Purpur, FightBot for Spigot on Spigot and CraftBukkit. If the wrong build is installed, the right one is downloaded and swapped in at the next restart.
- It goes in by itself the next time the server starts, or when FightBot is reloaded. Nothing changes while the server is running.
- Admins (anyone with \`fightbot.use\`) are told in chat when they join, and the console says so too.
- \`/fb update\` looks right away.
- A release that's taken back down on Modrinth is removed from the update folder again, if FightBot downloaded it.

Settings:

| Setting | Default | What it does |
|---|---|---|
| \`updates.check\` | \`true\` | \`false\`: FightBot never looks by itself. \`/fb update\` still looks when you ask. |
| \`updates.download\` | \`true\` | \`false\`: only tell admins, and download it yourself. |
| \`updates.betas\` | \`false\` | \`true\`: beta versions count as updates too. |` },
  { id: "the-config", title: "The config", body:
`FightBot keeps its files in \`plugins/FightBot/\`:

| File or folder | What's in it |
|---|---|
| \`config.yml\` | Everything you can change: health, speed, damage, combat, building, mining, skins, names, ping and more. Every option is explained inside. |
| \`botnames.yml\` | The name list, for \`name-source: file\`. |
| \`data.yml\` | Your saves, kits, groups and routes. Keep it when you update. |
| \`skins/\` | Your skin images, and a cache of signed and downloaded skins. |
| \`voice/\` | Your own voice lines (\`.mp3\`, \`.wav\`), and \`plays.log\`. |
| \`debug/\` | Debug logs, if you turn them on. |
| \`reload-bots.yml\` | The bots, written down during a plugin reload. It's gone again once they're all back. |
| \`old-configs/\` | Backups made when your config was updated. |

Edit the config, then run \`/fb reload\`. Health, speed and damage only apply to bots spawned after the reload. A switch you've changed on one bot in its menu beats the config for that bot.

## Updating

Don't delete your config when you update. FightBot notices it came from an older version and builds a fresh one with any new options. It carries across every setting that still exists, and keeps the old file in \`old-configs/\`. The console says how many settings it kept, and lists new options and any it left out.

## Handy settings

| Setting | Default | What it does |
|---|---|---|
| \`max-health\` | \`20.0\` | Bot health in HP. 20 is a real player's 10 hearts. |
| \`max-move-speed\` | \`0.28\` | Top speed. |
| \`crit-chance\` | \`0.30\` | Chance of a critical hit. |
| \`combat.fight-back.players\` / \`.bots\` | \`true\` | Fighting back, as above. |
| \`combat.use-pearls\`, \`use-cobwebs\`, \`use-shield\`, \`use-axe-swap\`, \`use-water-bucket\` | \`true\` | Which tricks bots use. Each is also a switch in a bot's own settings. |
| \`messages.staff-notices\` | \`true\` | FightBot tells staff in chat when something happens by itself (a bot kicked, an update out...). \`false\`: console only, for scripted or recorded servers. |
| \`combat.wait-for-charge\` | \`true\` | Bots wait for their weapon to charge before they swing. |
| \`combat.axe.crit-chance\` | \`0.80\` | How often a bot jumps for a crit with an axe. |
| \`combat.miss-chance\` | \`0.08\` | How often a swing misses, mostly at the edge of reach. |
| \`combat.reaction.min-ticks\` / \`max-ticks\` | \`3\` / \`7\` | How long a bot takes to react to someone stepping into reach. |
| \`mace.enabled\` | \`true\` | Mace combat: wind jumps, pearl launches and elytra dives. See Mace. |
| \`combat.first-hit-cap\` | \`50\` | The hit that starts a fight takes at most this % of a bot's health. \`100\`: off. See Fighting back. |
| \`combat.one-hit-players\` | \`[]\` | Player names any bot kills in one hit, whatever the weapon. See Fighting back. |
| \`combat.mace-defence\` | \`true\` | Bots do something about a mace coming down on them: a shield, out of the way, or a pearl away. See Mace. |
| \`mace.how-often\` | \`100\` | How keen bots are on the mace moves. \`50\` is half as often, \`200\` twice (10 to 400). |
| \`mace.elytra-combo\` | \`true\` | After a Wind Burst smash: the elytra back on, a rocket, and another dive. See Mace. |
| \`spear.elytra-charge\` | \`true\` | Spear charges from the elytra (needs \`elytra.enabled\` too). See Spears. |
| \`movement.sprint-jump\` | \`true\` | Sprint-jumping after players on open ground, and crits off the jump. See Moving like a player. |
| \`movement.jump-gaps\` | \`true\` | Jumping gaps up to 3 blocks wide instead of placing blocks. |
| \`movement.gap-blocks\` | \`true\` | Crossing gaps of 4 to 12 blocks by placing blocks, while after a target. |
| \`cart.enabled\` / \`cooldown\` | \`true\` / \`3\` | Cart PvP, and the least seconds between carts. See Cart PvP. |
| \`crystal.enabled\` | \`true\` | Crystal PvP. See Crystal PvP. |
| \`crystal.per-second\` | \`8\` | Crystals placed and set off a second (1 to 20). Fast-crystal servers suit 8 and up. |
| \`crystal.range\` | \`5\` | How close its target must be for crystals (3 to 8). |
| \`crystal.max-self-damage\` | \`10\` | The most health one crystal may cost the bot (after armour), unless it would finish its target. |
| \`formation.march.width\` / \`gap\` | \`3\` / \`1\` | Marching rows: bots across, and the gap behind you. See Marching and surrounding. |
| \`formation.surround.radius\` | \`0\` | \`0\`: the ring grows with the bots. Or a fixed radius. |
| \`orders.must-stop-first\` | \`true\` | A busy bot turns down a new order until it's stopped. \`false\`: new orders take over. |
| \`gear.mending-throw-speed\` / \`mending-throw-angle\` | \`0.5\` / \`45\` | How hard and how far down bots throw XP bottles. See Wear and mending. |
| \`gear.repair-after-fight-seconds\` | \`30\` | How long after a fight a bot standing about gets its gear back to full. |
| \`death.drop-items\` | \`auto\` | What a bot drops when it dies: \`auto\` (like a player), \`always\` or \`never\`. |
| \`voice.enabled\` | \`true\` | Bots in voice chat, when Simple Voice Chat is on the server. |
| \`web.enabled\` | \`true\` | The web editor (\`/fb web\`). |
| \`building.pillar\` | \`true\` | Pillaring up to reach you. |
| \`building.bridge\` | \`false\` | Bridging gaps and water. |
| \`building.only-own-blocks\` | \`kit\` | Build only with blocks the bot carries. See Building. |
| \`cobwebs.how-often\` / \`cooldown-seconds\` | \`100\` / \`2\` | How much bots use cobwebs. See Cobwebs. |
| \`formation.march.look-angle\` / \`look-up\` | \`45\` / \`10\` | Marching eyes left or right: how far round and up. |
| \`mining.enabled\` | \`false\` | Breaking blocks in the way with a pickaxe. |
| \`head-movement.natural\` | \`false\` | \`true\` turns the head at a person's pace, with a little aim drift. |
| \`ping.enabled\` | \`true\` | A realistic, wandering ping in the tab list. |
| \`death.leave-message\` / \`sound\` | \`true\` | The "left the game" line when a bot dies (sent like a player's) and the death boom. |
| \`reload.keep-bots\` | \`true\` | Bots come back after a plugin reload, doing what they were. |
| \`restart.keep-bots\` / \`max-bots\` | \`true\` / \`100\` | Bots come back after a server restart, where they stood. See Server restarts. |
| \`luckperms.enabled\` / \`group\` | \`true\` / \`""\` | LuckPerms data for bots, and a group for every bot. |
| \`updates.check\` / \`download\` / \`betas\` | \`true\` / \`true\` / \`false\` | Update checks, as above. |
| \`network.enabled\` | \`auto\` | The link to FightBot on a Velocity or BungeeCord proxy. \`auto\` only runs behind a proxy. See [Networks](#networks-velocity-and-bungeecord). |
| \`network.share-kits\` / \`share-saves\` | \`false\` / \`false\` | The same kits and saves on every server that shares them. |
| \`network.share-skins\` / \`share-voice\` | \`false\` / \`false\` | The same skins and voice lines on every server that shares them. |

## Building

Building is always a last resort. A bot looks for stairs, slopes and ways round first.

- **Pillaring** (on by default): when you're above it and there's no way up, it crouches, jumps and places blocks under itself until it's level with you.
- **Stuck down a pit or below a ledge:** it gets out the way you would. It throws an ender pearl up onto your level (landing on top of a block, not against the side), throws a wind charge under its feet, or walks to the side nearest you and builds up against it.
- **Bridging** (off by default): when there's a gap or water in the way and no way round, it bridges across.
- **Gaps while chasing** (\`movement.gap-blocks\`, on): see Moving like a player.

**Only its own blocks** (\`building.only-own-blocks\`): a player can only build with blocks they're carrying, and bots can be the same. They use up the blocks they carry, and with none, they don't pillar, bridge or build over gaps; they go round or wait. Any full solid block works (not obsidian, TNT, or sand and gravel, which fall).

| Value | What it does |
|---|---|
| \`kit\` (default) | Once a bot has been given anything (a kit, gear), it only builds with blocks it carries. A bot with an empty inventory builds as it always has. |
| \`true\` | Always. A bot carrying nothing builds nothing. |
| \`false\` | Never. Bots build without carrying blocks. |

\`building.blocks\` lists what they build with (or prefer, carrying several). Each bot picks one when it spawns.` },
  { id: "problems-and-answers", title: "Problems and answers", body:
`**My game crashes when a bot is near (with CPM on the server).**
That's the Simple Voice Chat and Customizable Player Models mods together (Minecraft 26.3): Voice Chat crashes drawing its icon above someone. From 6.0.1, with CPM on the server, bots never show an icon and stay quiet (\`identity.models.voice-safe\`), so update FightBot. A real player can still set it off; that's for the mods to fix.

**Bots stopped talking and answering.**
CPM is on your server, so bots stay quiet: that keeps the Voice Chat and CPM mods from crashing players' games. \`/fb vc\` says so. Once both mods have fixed it, set \`identity.models.voice-safe: false\`.

**A bot doesn't answer when I talk to it.**
Type \`/fb ai watch\`, then talk to it again. No *hearing you* at all: voice chat isn't sending your voice, so check your microphone in Voice Chat's settings. Otherwise it says why: not facing a bot that can answer, the bot is deafened, CPM is on the server (bots stay quiet), the chat's over, or an error from the AI company. \`/fb ai\` shows whether it's listening at all.

**The AI says Groq wants the terms accepted.**
On console.groq.com, open the Playground, pick \`canopylabs/orpheus-v1-english\` and accept its terms. FightBot tries again by itself every 2 minutes.

**My \`.cpmproject\` file does nothing.**
It's the CPM editor's save file, not a model. Export it as a model first. See Player models.

**Emotes or models don't show.**
You need the mod in your own game, as well as the plugin on the server. If the console says *"Client doesn't support emotes"* when you join, Emotecraft in your game didn't connect - usually your game is on a different Minecraft version than the server.

**The skin signing service is "busy", or asked FightBot to wait.**
That's normal. FightBot waits and carries on by itself. \`/fb skins\` shows progress. See About signing.

**"Found names" isn't going up, or nothing shows in the console.**
- It only looks **while nobody is on the server** (bots don't count). \`/fb skins\` says who it's waiting for. To keep looking with players on, set \`identity.find-skins.only-when-empty: false\`.
- It's slow on purpose, to stay inside Mojang's limits: at most one name every 10 seconds, so give it a few minutes.
- Hiding the player count in the server list ("???") doesn't affect it.

**Bot names look weird or fake.**
Fixed in 5.20.4: made-up names look like real players' names (\`jake2011\`, \`SleepyPanda\`, \`itz_ava\`). Want your own? Set \`identity.name-source: file\` and list them in \`botnames.yml\`.

**"No skin for 'TongZesu': no Minecraft account has that name."**
Fixed in 5.20.3. TongZesu was one of FightBot's built-in skins, and that account no longer exists. Nothing was wrong with your config.

**Bots look like Steve.**
Type \`/fb skins\`. It tells you what's missing. The usual causes:
- \`skin-source\` is \`none\`
- the skins folder is empty
- \`skin-names\` is empty
- the skins are still signing

**A bot never uses crystals.**
It needs end crystals, obsidian (or obsidian or bedrock nearby) and a target within \`crystal.range\`. It also only places a crystal that hurts its target more than itself: with no armour, every crystal would cost it too much, so it doesn't crystal. Give it armour (Blast Protection helps) and totems. Check **Crystal PvP** in its settings and \`crystal.enabled\`.

**A bot never uses carts.**
It needs TNT minecarts, rails, arrows, and a bow or crossbow, plus flint and steel unless the bow has Flame (cobwebs help). It starts from about 3 to 5 blocks off, with room for a rail beside its target. It doesn't try in the rain, since rain puts burning arrows out. Check **Cart PvP** in its settings and \`cart.enabled\`.

**Bots spawned near the world spawn instead of where I said (1.20.5 to 1.21.x).**
Fixed in 6.0.10: bots appear exactly where they're spawned.

**A server won't link to the proxy.**
Type \`/fb network\` on that server. It says why. The usual causes:
- FightBot isn't in the proxy's \`plugins\` folder yet
- BungeeCord: \`network.secret\` isn't set (see Setting it up)
- the proxy is on another machine: set \`network.proxy\`
- the proxy can't tell which server it is: set \`network.server-name\` to its name in the proxy's config

**A command block stopped spawning bots.**
FightBot stopped it for spawning too many bots too fast. Ops were told which one. Run \`/fb reload\` to let it spawn again. See Command blocks.

**I can't hit a bot right after it teleports or pearls.**
Fixed in 5.17.2: bots can be hit the moment they arrive, like players.

**Bots crit me while walking, or hit me the instant I'm in reach.**
Fixed in 5.17.2: bots only crit when they jump and fall, like you, and take a moment to react. See How bots swing.

**A dead bot didn't drop its armour.**
Fixed in 5.17.2: bots drop everything they had, like a player, unless the world keeps inventories (\`death.drop-items\` changes that).

**A bot fighting me stopped at the edge of a drop.**
Fixed in 5.17.4: when you're on a lower step, past a 3-block drop, the bot jumps down after you. If one still stops, turn on \`/fb debug on\` and send the log from \`plugins/FightBot/debug/\`.

**Bots don't talk.**
Type \`/fb vc\`. Simple Voice Chat has to be on the server, and only bots that "talk" say anything. FightBot's own lines come with updates; your own files only play when someone types \`/fb vc <name>\`.

**Bots won't hurt anyone.**
FightBot tells you why in chat, and how to fix it on your version. Usually PvP is off, you're in creative, or a plugin such as WorldGuard blocks PvP there.

**"X left the game" shows twice (or more) when a bot dies.**
Fixed in 5.20.2: a bot that dies leaves once, the way a player does. You get one "left the game", or none with \`death.leave-message: false\`, and plugins that change or hide leave messages treat it like a player's. This includes servers with a plugin that kicks players when they die.

**Bots stop at a river.**
Fixed in 5.16.8: bots going after someone swim across. Free roamers stay on dry land on purpose.

**After a plugin reload, bots stood about doing nothing, or "name is already taken".**
Fixed in 5.16.8: see [Reloading FightBot](#reloading-fightbot-plugmanx-reload).

**A bot disappeared.**
It was killed, kicked or banned, and FightBot says which in chat. A name banned with \`/ban\` can't be spawned until \`/pardon <name>\`.

**"'Name' is banned on this server."**
That name was banned, perhaps by a death-ban plugin. Run \`/pardon <name>\`, or use another name.

**The plugin loads, but bots won't spawn.**
Check the console at startup. FightBot says whether your server can run bots and, if not, why. You need Paper 1.20.5 or newer with the Paper build, or Spigot or CraftBukkit 26.1 or newer with FightBot for Spigot.

**A bot just stands there.**
It hasn't been told to fight anyone. Try \`/fb fight <bot> <you>\`, or hit it. If it's chasing but stuck, it can't reach you. Pillaring gets it up to you. For gaps and water, turn on bridging.

**Bots fight each other when I don't want them to.**
Set \`combat.fight-back.bots: false\`, or switch **Fights back: bots** off in a bot's menu.

**A bot's settings went back to normal.**
Settings belong to the bot, so they're lost when it dies or the server restarts. Put the setup in a save.

**Config changes did nothing.**
Run \`/fb reload\`. Health, speed and damage only apply to bots spawned after that. Also check the bot's own menu, because a changed switch there beats the config.

## Still stuck? Send a debug log

\`\`\`
/fb debug on
\`\`\`

Make the problem happen, then run \`/fb debug off\`. (\`/fb debug\` on its own shows whether it's on.) The log is in \`plugins/FightBot/debug/\`. It records what each bot saw, chose and did, and why. Send the newest file along with your server version, your FightBot version and anything the console printed.

More at [fightmc.xyz](https://www.fightmc.xyz)` }
];
