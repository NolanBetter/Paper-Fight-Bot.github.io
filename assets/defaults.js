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
    a: `**Paper 1.20.5 or newer, or a fork like Purpur.** Nothing else.

Spigot, CraftBukkit and Folia are not supported. FightBot checks at startup and says so in the console rather than half working.` },
  { id: "why", q: "Why Paper and not Spigot?",
    a: `Bots are real server side players now, not mobs wearing a disguise. They have real hitboxes, real physics, and every other plugin on your server sees them as players. They even show in the tab list with a realistic ping. That needs Paper's API.` },
  { id: "cost", q: "Does it cost anything?",
    a: `No. It is free on Modrinth.` },
  { id: "howmany", q: "How many bots can I run at once?",
    a: `Up to 50 from one command, with \`/fightbot spawn <count>\`. Whether your server enjoys 50 is another matter, since they path, fight and place blocks the way players do. Scale up gradually and watch your TPS.` },
  { id: "botvbot", q: "Can bots fight each other?",
    a: `Yes. Put them in groups and use \`/fightbot groupfight <group> <target>\`, or set two groups on one another. Good for watching what a loadout actually does.` },
  { id: "gearmid", q: "Can I change their gear while they are fighting?",
    a: `No. The bot is moving items between its hands the whole time, so its inventory is closed while it fights. Run \`/fightbot stop <bot>\` first, then right click it in creative or use **Open gear** in its settings menu.` },
  { id: "missing", q: "Where did roaming, patrols and crystal PvP go?",
    a: `They are switched off in this version while they are reworked, and come back in a later update.` },
  { id: "mace", q: "Does the mace work?",
    a: `It is there but off by default while it is being finished. Turn it on for every bot with \`mace.enabled\` in the config, or for one bot in its settings menu.` },
  { id: "perm", q: "Is there a permission node?",
    a: `\`fightbot.use\`, default OP. Grant it to let other people spawn and command bots. \`/fightbot help\` in game lists everything.` },
  { id: "beta", q: "Should I use the beta builds?",
    a: `Only if you are chasing a specific fix or happy to report bugs. Stick to the newest full release for anything you care about, and back up first.` },
  { id: "video", q: "Can I use it in a video?",
    a: `Go ahead. A link back is appreciated but not required.` },
  { id: "bug", q: "How do I report a bug?",
    a: `Use the [report form](report.html). It takes your debug log and plugin list, and you will see any reply on your reports page. Discord works too.` }
];

export const DEFAULT_WIKI = [
  { id: "requirements", title: "Requirements", body:
`Which version you need depends on your server.

| FightBot version | Minecraft | Needs |
|---|---|---|
| Newer than 3.17.1 | 1.20.5 and up | Paper, or a fork like Purpur. Nothing else. |
| 3.17.1 and older | 1.16 and up | LibsDisguises |

Newer versions make bots real server-side players, not disguised mobs. They have real hitboxes, real physics, and every other plugin sees them as players. They show up in the tab list alongside everyone else with a realistic ping. Spigot, CraftBukkit and Folia aren't supported, and FightBot tells you why in the console at startup instead of half-working.

3.17.1 and older ran bots as zombies wearing a player disguise, which is why they need LibsDisguises. If your server is below 1.20.5, that's the version to use.` },
  { id: "getting-started", title: "Getting started", body:
`Spawn a bot, give it some gear, and set it on yourself:

\`\`\`
/fightbot spawn
/fightbot settings
/fightbot fight <bot> <you>
\`\`\`

\`/fightbot settings\` opens a screen of every bot's head. Click one to open its menu, then **Open gear** to hand it armour and a weapon. When you're done, \`/fightbot stop\` calls every fight off at once.` },
  { id: "commands", title: "Commands", body:
`Everything runs under \`/fightbot\`, shortened to \`/fb\`. The permission is \`fightbot.use\`, which defaults to OP. Type \`/fightbot help\` in game for the full list.

### Spawning

| Command | What it does |
|---|---|
| \`/fightbot spawn\` | Spawns one bot with a random name where you're standing, facing the way you are. |
| \`/fightbot spawn <count>\` | Spawns up to 50 bots with random names. |
| \`/fightbot spawn <name>\` | Spawns one bot with the name you give it. |

A bot will never take the name of anyone who has played on your server, so nobody's player data can be overwritten. If a real player joins with a bot's name, the bot steps aside.

### Fighting

| Command | What it does |
|---|---|
| \`/fightbot fight <bot> <player...>\` | Sends one bot after one or more players. |
| \`/fightbot fight --all <player...>\` | Sends every bot after those players. |
| \`/fightbot fight --group <group> <player...>\` | Sends a whole group after players. |
| \`/fightbot stop\` | Calls off every fight at once. |
| \`/fightbot stop <bot>\` | Calls off one bot. |

A bot that another bot is actually attacking fights back. A bot that just gets clipped by a teammate's sword sweep doesn't, so a crowd of bots after one target stays focused on it.

### Managing bots

| Command | What it does |
|---|---|
| \`/fightbot list\` | Shows every live bot. |
| \`/fightbot remove <bot\\|--all>\` | Deletes bots. |
| \`/fightbot edit clone <bot> <name\\|--random>\` | Copies a bot, gear and settings included. |
| \`/fightbot edit clone <bot> --random <count>\` | Makes up to 50 copies at once. |
| \`/fightbot edit change <bot> <name\\|--random>\` | Renames a bot. |
| \`/fightbot tp <bot\\|--all\\|--group <group>> <player\\|x y z>\` | Teleports bots. They face the same way you are, which helps for screenshots. |
| \`/fightbot look <bot\\|--all> <player\\|bot\\|stop>\` | Makes bots watch someone and keep watching until you say \`stop\`. |` },
  { id: "bot-settings", title: "Bot settings", body:
`Every bot has its own settings menu. It's where you manage one bot directly, and where you can make one bot behave differently from the rest.

### Opening it

| Command | What it does |
|---|---|
| \`/fightbot settings\` | Shows every bot's head. Click one to open its menu. |
| \`/fightbot settings <bot>\` | Opens that bot's menu straight away. |
| \`/fightbot edit\` or \`/fightbot edit <bot>\` | The same thing. |

\`/fightbot edit clone\` and \`/fightbot edit change\` still work exactly as before.

### The top of the menu

The bot's head sits at the top. Hover over it to see its health, its group, what it's doing right now, and how many of its settings you've changed.

### Things you can do

| Button | What it does |
|---|---|
| **Bring here** | Teleports the bot to you, facing the way you are. |
| **Go to bot** | Teleports you to the bot. |
| **Rename** | Closes the menu and asks you to type the new name in chat. Type \`random\` for a made-up one, or \`cancel\` to leave it. |
| **Clone** | Makes a copy with a random name, the same gear and the same settings. The menu stays open, so you can keep clicking to make more. |
| **Change group** | Shows your groups. Pick one to move the bot there, or pick **No group** to take it out. |
| **Open gear** | Opens the bot's inventory. Not while it's fighting. |
| **Stop fighting** | Calls the bot off, whatever it's doing. |
| **Heal** | Puts the bot back on full health. |
| **Reset settings** | Puts every switch back to the server's settings. |
| **Remove bot** | Deletes the bot. You have to **shift-click** it, so it can't happen by accident. |

Renaming keeps everything about the bot: its skin, gear, health, settings, group and whatever it was fighting. Minecraft doesn't let a player change their name while they're in the world, so behind the scenes the bot is swapped for an identical one under the new name. That's why you'll see the new name "join the game".

### Per-bot switches

The lower part of the menu holds switches. Your \`config.yml\` sets how every bot behaves, and these let one bot differ. You could have a whole group that pearls and one that doesn't, or a single bot that builds while the rest walk.

| Switch | What it controls |
|---|---|
| Ender pearls | Throwing pearls to chase you and to escape. |
| Cobwebs | Placing cobwebs to trap and slow you. |
| Shield breaking | Switching to an axe to break a raised shield. |
| Water bucket | Washing out cobwebs and clutching big falls. |
| Potions | Splashing potions for the buff. |
| Mace combat | Pearling up and diving in with a mace. |
| Fights back | Fighting back when another bot attacks it. |
| Pillaring | Going straight up when you're above it and there's no way to walk up. On by default. |
| Bridging | Crossing gaps and water when there's no way round. Off by default. |
| Mining | Breaking blocks in its way with a pickaxe. |
| Realistic ping | Showing a wandering ping in the tab list. |

How they work:

- **A glowing switch is on.** A plain one is off.
- **Click** a switch to flip it.
- **Right-click** a switch to hand it back to the server. It then follows whatever \`config.yml\` says.
- **Changes happen the moment you click.** There's no save button, so pressing Esc, clicking back, or just walking away all keep what you set.

Every switch starts out **following the server**, and its description tells you the server's setting. Once you change one, it says **changed for this bot**. That matters when you edit your config later: a bot you've set yourself keeps its own choice, while every switch you left alone picks up the new config. If you flip a switch and then flip it back to match the server, it goes back to following the server, rather than quietly holding onto its own copy.

One catch. A bot's settings belong to that bot, so they're gone when it dies or the server restarts. To keep a setup you like, put it in a save. Saves remember settings, so every bot you spawn from it comes out the same way.` },
  { id: "equipment", title: "Equipment", body:
`Right click any bot in creative mode to open its inventory, or use **Open gear** in its settings menu. You can't open it while the bot is fighting, since it's moving items between its hands the whole time.

| Slots | Contents |
|---|---|
| 1 to 4 | Helmet, chestplate, leggings, boots |
| 5 | Offhand, totem or shield |
| 6 | Main hand, its weapon |
| 7 and up | Anything else |

Only armour, the offhand and the weapon have fixed places. Everything else can go anywhere: an axe for breaking shields, food, cobwebs, ender pearls, a water bucket, a mace, wind charges, an elytra, a pickaxe. The bot finds whatever it's carrying and uses it.

Mace combat is off by default while it's being finished, so a mace sits unused until you turn it on, either for every bot with \`mace.enabled\` in the config or for one bot in its settings menu. Roaming, patrolling and crystal PvP are switched off in this version while they're reworked, and will return in a later update.` },
  { id: "saves-and-kits", title: "Saves and kits", body:
`Both keep up to five loadouts, and both survive restarts. The difference is what they do with them.

**Saves spawn a brand new bot** carrying the stored gear **and settings**. Fill a save from a bot and every bot you spawn from it comes out equipped and set up the same way. The new bot gets its own fresh name and skin.

| Command | What it does |
|---|---|
| \`/fightbot saves\` | Opens the saves screen. |
| \`/fightbot savegear <bot> [1-5]\` | Stores a bot's gear and settings in a save slot. |
| \`/fightbot save <1-5> [name\\|--random] [count]\` | Spawns bots from a save. |
| \`/fightbot delsave <1-5>\` | Deletes a save. |

A save only remembers the settings you'd changed on that bot. Anything still following the server keeps following it, so later config changes reach those switches too. Hover over a save's book to see exactly which settings its bots will spawn with.

**Kits re-gear a bot you already have**, replacing what it's carrying. They carry gear only, since the bot already has settings of its own.

| Command | What it does |
|---|---|
| \`/fightbot kits\` (or \`kit\`, \`load\`) | Opens the kits screen. |
| \`/fightbot saveload <bot> [1-5]\` | Stores a bot's gear as a kit. |
| \`/fightbot kit <bot> <1-5>\` (or \`load\`) | Gives a bot a kit. |
| \`/fightbot delload <1-5>\` | Deletes a kit. |

In the screens, a filled slot shows a glowing book with a green delete button underneath. An empty one shows a plain book and grey dye.

- **Click an empty book** to fill it. You'll see every bot's head; pick the one to save from.
- **Click a filled save** to spawn a bot from it. The screen stays open, so keep clicking to spawn more. Each lands a little apart from the last instead of on top of it.
- **Click a filled kit**, then pick which bot gets it.
- **Press Esc** to step back a screen.` },
  { id: "groups", title: "Groups", body:
`Groups let you command several bots at once. A bot can only be in one group at a time.

\`\`\`
/fightbot groupcreate redteam
/fightbot groupadd redteam Kade
/fightbot grouplist redteam
\`\`\`

| Command | What it does |
|---|---|
| \`/fightbot groups\` | Opens the groups screen. |
| \`/fightbot groupcreate <name>\` | Makes a group. |
| \`/fightbot groupadd <group> <bot>\` | Puts a bot in it. |
| \`/fightbot groupremove <group> <bot>\` | Takes a bot out. |
| \`/fightbot groupdel <group>\` | Deletes a group. Its bots are freed. |
| \`/fightbot grouplist [group]\` | Lists groups, or one group's members. |
| \`/fightbot groupcheck <bot>\` | Shows which group a bot is in. |
| \`/fightbot groupchange <group> <new name>\` | Renames a group. |

In the groups screen, click a group to see its members. Click a head to take that bot out, or the green dye to add bots. The add screen only offers bots without a group, and it **stays open** after each one, so you can add a whole squad without going back each time.

A group's count only includes bots that are alive. When a bot dies or is removed, it leaves its group. Groups keep their names across a restart, but start empty, since bots don't survive a restart.

### Group fights

Set two groups on each other and watch:

\`\`\`
/fightbot groupfight redteam blueteam
\`\`\`

It plays out as one-on-one duels. The bots pair off first, and each one sticks with a single opponent until one of them falls, then picks the next. If a bot gets attacked by someone it isn't fighting, it turns to face them, unless it's already locked in a fair one-on-one. Nobody piles onto one target while the rest stand around.

| Command | What it does |
|---|---|
| \`/fightbot groupfight <group> <group>\` | Two groups fight as duels. |
| \`/fightbot groupfight <group> <player\\|bot>\` | A whole group goes after one target. Drop yourself in. |
| \`/fightbot groupstop <group> [group]\` | Stops one group, or both sides of a fight. |` },
  { id: "config", title: "Config", body:
`FightBot keeps its files in \`plugins/FightBot/\`:

| File or folder | What's in it |
|---|---|
| \`config.yml\` | Health, speed, damage, combat, building, mining, skins, names, ping and more. |
| \`botnames.yml\` | The name pool, if you use \`name-source: file\`. |
| \`data.yml\` | Your saves, kits and groups. Keep this one when updating. |
| \`skins/\` | Skin images for bots, and a cache of downloaded skins. |
| \`debug/\` | Debug logs, if you've turned them on. |
| \`old-configs/\` | Backups made when your config was updated. |

Edit the config, then reload without restarting:

\`\`\`
/fightbot reload
\`\`\`

One catch. Some settings, like health and damage, only apply to bots spawned after the reload. Bots already standing there keep the old values, so clear them if you want the new numbers:

\`\`\`
/fightbot remove --all
/fightbot spawn
\`\`\`

Remember that anything you've changed on a single bot in its settings menu takes priority over the config for that bot.

### Updating

You don't need to delete your config when you update. FightBot notices it came from an older version, builds a fresh one with any new options, carries all your settings across, and saves the old file in \`old-configs/\`, named after the version it came from. The console tells you what it kept and what's new.

### Building

Bots can place blocks to reach you, in two separate ways. Each has its own switch in the config, and can also be set for a single bot in its settings menu.

\`\`\`yaml
building:
  pillar: true
  bridge: false
  blocks:
    - COBBLESTONE
\`\`\`

**Pillaring** is on by default. When you're above a bot and there's no way to walk up, it goes straight up: it sizes you up once, then crouches, looks down, jumps and places a block under its feet, over and over without standing up, until it's level with you. It holds still while it climbs, so it can't drift off its own pillar. A single block is just a jump, so it only pillars for anything higher.

**Bridging** is off by default. When there's a gap or water between a bot and you, and no way round, it crouches and bridges across at its own level, staying crouched until it's over. It never bridges out from partway up a pillar.

Either way, building is a last resort. A bot first looks for a way to walk or swim to you, up stairs, round a gap, along a slope, and only builds if there isn't one. List more than one block and each bot picks one when it spawns and keeps it. Only solid blocks work; anything else is skipped with a warning.

### Mining

A bot carrying a pickaxe can break the block standing between it and its target. It's **off by default**, since, like building, it changes your world.

\`\`\`yaml
mining:
  enabled: false
\`\`\`

### Skins

Set \`identity.skin-source\`:

- \`random\` picks a skin from a pool of accounts built into FightBot, which grows with each update. The bot keeps its own name; only the skin is borrowed. Each skin downloads once and is cached, so right after the first start the very first bots may appear plain for a few seconds.
- \`folder\` drops \`.png\` skin images into \`plugins/FightBot/skins/\`. Minecraft skins have to be signed before a player can see them, so the first time FightBot sees an image it gets signed and cached. Images need to be normal 64×64 skins.
- \`mojang\` borrows the skins of real accounts you list under \`identity.skin-names\`.
- \`none\` uses the default skin.

### Names

Set \`identity.name-source\`:

- \`random\` makes up player style names like \`BlockRunner42\`.
- \`file\` picks from \`botnames.yml\`.
- \`numbers\` makes numbered names from \`identity.number-format\`.

Number patterns use \`%<digits>n\` for one random character from those digits, and you can chain them. \`%01n%01n%01n%01n\` gives names like \`1011\` or \`0000\`. \`Bot%01n%01n\` gives \`Bot01\` or \`Bot10\`. Watch how many names a pattern can make: \`%01n\` only has two, so a third bot has nowhere to go and FightBot will tell you.

### Ping

Each bot shows its own ping in the tab list instead of a giveaway 0ms. It starts somewhere inside the range, then every few seconds it moves up or down a little from where it was, the way a real connection wanders. It never leaves the range.

\`\`\`yaml
ping:
  enabled: true
  min: 15
  max: 140
  step: 12
  change-every-min-seconds: 1
  change-every-max-seconds: 4
\`\`\`

\`step\` is the most it can move in one change, and it always moves by at least a little. How often it changes is picked fresh each time, between the two \`change-every\` values. A freshly spawned bot's ping appears once the tab list next refreshes.` },
  { id: "troubleshooting", title: "Troubleshooting", body:
`### The plugin loads but bots won't spawn

Check the console at startup. FightBot says whether your server can run bots, and why not if it can't. Newer versions need Paper 1.20.5 or newer, or a fork like Purpur. If your server is older, use 3.17.1 with LibsDisguises.

### The server froze for a few seconds every time a bot spawned

That was a bug before 5.12.0, along with a pair of \`Couldn't find profile\` warnings on every spawn. Update to the newest release and spawning is near-instant.

### Everyone got disconnected when a bot spawned

That was a bug in 5.8.0, 5.9.0 and 5.9.1. Update to 5.9.2 or newer.

### Bots look like zombies

You're on 3.17.1 or older without LibsDisguises. Install LibsDisguises, or update to a newer version if your server is on 1.20.5 or above.

### A bot just stands there

It hasn't been told to fight anyone. Run \`/fightbot fight <bot> <you>\`. If it's already fighting and stuck, it probably can't reach you: you're behind blocks, across a gap, or up high. Pillaring is on by default, so it will climb to you if you're above it. If there's a gap or water in the way, turn on bridging, for every bot in the config or for that one in its settings menu.

### A bot's settings went back to normal

Settings belong to the bot, so they're lost when it dies or the server restarts. Put the setup in a save, and every bot you spawn from it keeps those settings.

### Bots move slowly

Update to the newest release. Older betas had a bug where bots hopped through grass instead of running. If it's still slow, check \`max-move-speed\` in the config.

### Skins don't show

Check \`identity.skin-source\` is set. With \`random\` or \`mojang\`, skins download in the background, so give it a few seconds after the first start. With \`folder\`, images must be 64×64 and FightBot needs a few seconds to sign each new one. With \`mojang\`, make sure you've listed names under \`identity.skin-names\`. The console reports how many skins are ready.

### Config changes did nothing

Some settings only apply to newly spawned bots, so remove the existing ones and spawn fresh. Also check the bot's settings menu: a switch you've changed on one bot overrides the config for that bot.

### Something else

Turn on debug logging, make it happen again, then send us the log:

\`\`\`
/fightbot debug on
\`\`\`

The log lands in \`plugins/FightBot/debug/\` and records who each bot fought, where it stood, what it chose and why, including every block it placed or broke and every setting you changed. Include it along with your server version, your FightBot version and anything the console printed.` }
];
