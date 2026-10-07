/* The FAQ and wiki that ship with the site, as data.

   These are what the pages show before anyone edits anything, and what the
   editor starts from. Editing in the browser copies them into Firestore, so
   you are always adding to the real list rather than replacing it.

   The wiki sections are the FightBot wiki for 5.17.0, kept word for word.
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
    a: `Up to 200 from one command, with \`/fightbot spawn <count>\`. Whether your server enjoys 200 is another matter, since they path, fight and place blocks the way players do. Scale up gradually and watch your TPS.` },
  { id: "botvbot", q: "Can bots fight each other?",
    a: `Yes. Put them in groups and use \`/fightbot groupfight <group> <target>\`, or set two groups on one another. Good for watching what a loadout actually does.` },
  { id: "gearmid", q: "Can I change their gear while they are fighting?",
    a: `No. The bot is moving items between its hands the whole time, so its inventory is closed while it fights. Run \`/fightbot stop <bot>\` first, then right click it in creative or use **Open gear** in its settings menu.` },
  { id: "missing", q: "Where did crystal PvP go?",
    a: `It is switched off while it is reworked, and comes back in a later update. Roaming and patrolling are back as of 5.17.0 \u2014 see [the wiki](wiki.html).` },
  { id: "mace", q: "Does the mace work?",
    a: `Yes. It is off by default, so turn it on with \`mace.enabled\` in the config, or for one bot in its settings menu.

A bot with a mace and wind charges wind-jumps and smashes you on the way down. With an elytra and rockets it takes off, flies over you and dives. If you dive on a bot, it sidesteps or gets its shield up.` },
  { id: "perm", q: "Is there a permission node?",
    a: `\`fightbot.use\`, default OP. Grant it to let other people spawn and command bots. \`/fightbot help\` in game lists everything.` },
  { id: "beta", q: "Should I use the beta builds?",
    a: `Only if you are chasing a specific fix or happy to report bugs. Stick to the newest full release for anything you care about, and back up first.` },
  { id: "video", q: "Can I use it in a video?",
    a: `Go ahead. A link back is appreciated but not required.` },
  { id: "bug", q: "How do I report a bug?",
    a: `Use the [report form](report.html). It takes your debug log and plugin list, and you will see any reply on your reports page. Discord works too.` },
  { id: "webeditor", q: "Can I change settings without opening server files?",
    a: `Yes, from 5.17.0. Type \`/fightbot web\` in game and open the link it gives you. It opens the
[editor](editor/) on this site, where you can change any setting, run the bots \u2014 spawn them, send them after
someone, set them roaming or patrolling, make groups, hand out kits, and flip any one bot's own switches \u2014
upload skins and voice lines, and read the debug logs.

The link is the key, so do not share it. It stops working after 30 minutes unused, after 4 hours, or when you
type \`/fightbot web stop\`. Nothing on your server has to be opened up, and everything between your server
and the page is encrypted with a key that is only in the link.` },
  { id: "voice", q: "Do the bots talk?",
    a: `With [Simple Voice Chat](https://modrinth.com/plugin/simple-voice-chat) on the server, yes. Bots show up
in voice chat like players, and the ones that "talk" say lines by themselves when they join, start a fight, win
one, get low or die.

FightBot's own lines come in the jar: \`hello\` and \`am_i_muted\` as a bot joins, and \`grass\` when a roaming
bot pulls up grass. More come with updates, and \`voice.on-their-own: false\` keeps bots quiet unless told.

You can add your own \`.mp3\` or \`.wav\` files too. Those are **never** said by a bot on its own \u2014 only when
someone types \`/fightbot vc <name>\` \u2014 everyone nearby is told it is a file added by that server and who
played it, and every play is logged.` },
];

export const DEFAULT_WIKI = [
  { id: "requirements", title: "Requirements", body:
`FightBot adds PvP bots to your Paper server. Each bot is a real server-side player: it has a real hitbox, real physics and a spot in the tab list, and every other plugin sees it as a player. Bots fight with swords, axes, shields, totems, pearls, cobwebs, water buckets and potions. They can also walk routes, patrol an area and fight in teams.

> **New here? In game, type \`/fb guide\`.** It walks you through everything below, one short step at a time.

| FightBot version | Minecraft | Needs |
|---|---|---|
| Newer than 3.17.1 | 1.20.5 and up | Paper, or a fork like Purpur. Nothing else. |
| 3.17.1 and older | 1.16 and up | LibsDisguises |

Optional: **Simple Voice Chat**, for bots that talk (5.17.0 and up). See Voice lines.

Spigot, CraftBukkit and Folia aren't supported. If one of those is your server, FightBot says so in the console at startup instead of half-working. If your server is older than 1.20.5, use 3.17.1 with LibsDisguises.` },
  { id: "quick-start", title: "Quick start", body:
`1. Put the jar in \`plugins/\` and start the server.
2. In game, type \`/fb spawn\`. A bot appears where you're standing.
3. Hit it. It fights back. Or send it after someone with \`/fb fight <bot> <player>\`.
4. Right-click it in creative mode to give it armour and a weapon.
5. \`/fb stop\` calls every bot off, and \`/fb remove <bot>\` gets rid of one.

Every command works as \`/fightbot\` or \`/fb\`. The permission is \`fightbot.use\`, which only OPs have by default. Two more, also OPs only: \`fightbot.web\` for the web editor, and \`fightbot.voice.custom\` for playing sound files added to the server.

Rather click than type? \`/fb web\` gives you a link to change FightBot from your browser. See The web editor.

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
| \`/fb remove <bot\\|--all>\` | Removes bots. \`/kick\` and \`/ban\` work too. |
| \`/fb edit clone <bot> <name>\` | Copies a bot, gear and settings included. |
| \`/fb edit clone <bot> --random [count]\` | Up to 200 copies at once, with random names. |
| \`/fb edit change <bot> <name\\|--random>\` | Renames a bot. |
| \`/fb tp <bot\\|--all\\|--group <group>> <player\\|x y z>\` | Teleports bots. Sent to a player, they face the way that player faces. Sent to x y z, they face south. |
| \`/fb look <bot\\|--all> <player\\|bot\\|stop>\` | Bots watch someone until you say \`stop\`, or until that player leaves or dies. A busy bot won't watch, so stop it first. |

A bot never takes a name that belongs to someone else:

- nobody who has played on your server (unless \`identity.protect-real-names\` is off)
- no AuthMe account
- no banned name

Player data is safe either way, because bots have IDs of their own. If a real player joins using a bot's name, the bot steps aside.

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
- **Hit them straight away.** A bot can be hit the moment it joins, teleports, pearls or changes world, like a player.

## Mace

Turn mace combat on with \`mace.enabled: true\` (or for one bot, with **Mace** in its settings menu). The bot uses the game's own mace, wind charges, elytra and fireworks, so damage, Density, Breach and Wind Burst all work as they do for you.

- **Wind jump** (mace + wind charges): close in, it throws a wind charge at its feet, flies up and smashes you on the way down. With Wind Burst it can bounce up and smash again (\`mace.wind-chain-max\`).
- **Elytra dive** (mace + elytra + firework rockets): from further away, it takes off, climbs and flies over you, swaps the elytra for its chestplate and drops onto you from about \`mace.dive-height\` blocks.
- **After a miss** it saves itself the way you would: a wind charge just before it lands, a water bucket, or the elytra again.
- **Against you:** if you dive on a bot with a mace, it sidesteps, or raises its shield in time.

\`mace.wind-jump\` and \`mace.elytra\` turn each move off, and \`mace.cooldown-seconds\` is the least time between mace attacks.

## Fighting back

Bots fight back:

- **Players:** when a player hits a bot, it hits back. This works whether the bot is standing about, roaming or patrolling. It never chases players in creative or spectator.
- **Bots:** when another bot hits it **on purpose**, it hits back. A stray sword sweep meant for someone else doesn't count, so a crowd of bots stays on its target.

Once that fight is over, the bot goes back to what it was doing. Turn either kind off in the config (\`combat.fight-back.players\` and \`combat.fight-back.bots\`), or for one bot in its settings menu. For practice dummies that just take hits, turn off \`players\`.

A bot does one job at a time: fighting, roaming or patrolling. To give a busy bot a new job, or to open its gear, stop it first. FightBot tells you when, and what it's busy with, for example "Rd1 is fighting Blu".

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
| Shield | Raising a shield when you are about to swing. |
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

- **Glowing means on.** Click to flip a switch.
- **Right-click** hands a switch back to the server, so it follows \`config.yml\` again.
- Changes apply the moment you click. There's no save button.

A bot's settings belong to that bot. They're gone when it dies or the server restarts. To keep a setup, put it in a save.` },
  { id: "equipment", title: "Equipment", body:
`Right-click a bot **in creative mode**, or use **Open gear** in its menu.

| Slots | Contents |
|---|---|
| 1 to 4 | Helmet, chestplate, leggings, boots |
| 5 | Offhand: a totem or shield |
| 6 | Main hand: its weapon |
| 7 and up | Anything else |

Only armour, the offhand and the weapon have fixed slots. Everything else can go **anywhere**, and the bot finds and uses what it carries:

- an axe
- food
- cobwebs
- ender pearls
- a water bucket
- a mace and wind charges
- an elytra
- a pickaxe` },
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

A save only remembers the settings you changed on that bot, so later config changes still reach everything else. Hover over a save to see which settings its bots spawn with.` },
  { id: "groups", title: "Groups", body:
`A bot can be in one group at a time.

| Command | What it does |
|---|---|
| \`/fb groups\` | Opens the groups screen. |
| \`/fb groupcreate <name>\` | Makes a group. |
| \`/fb groupadd <group> <bot>\` | Puts a bot in it. |
| \`/fb groupremove <group> <bot>\` | Takes a bot out. |
| \`/fb groupdel <group>\` | Deletes a group. Its bots are freed. |
| \`/fb grouplist [group]\` | Lists groups, or one group's members. In game, this opens the screen. |
| \`/fb groupcheck <bot>\` | Which group a bot is in. |
| \`/fb groupchange <group> <new name>\` | Renames a group. |

Groups keep their names across restarts, but they start empty, because bots don't survive a restart.

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

A patrol walks a route and goes after **that route's targets**, and only those. After the fight it goes back to its route.

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
| \`random\` | Skins from a list of accounts built into FightBot, downloaded from Mojang, so the server needs internet. There's nothing else to do. The bot keeps its own name. |
| \`folder\` | Your own skin images. Put skin \`.png\` files (64×64, or old-style 64×32) in \`plugins/FightBot/skins/\`. |
| \`mojang\` | The skins of real accounts. List their usernames under \`identity.skin-names\`. |
| \`none\` | Plain Steve and Alex. This is the default. |

**Type \`/fb skins\` in game at any time.** It shows your current setting, how many skins are ready, what's still in progress, and anything that went wrong.

## About signing (the "wait" messages)

Minecraft only shows a skin that Mojang has signed. In \`folder\` mode, FightBot sends each image to a free signing service (MineSkin) the first time it sees it. It keeps the result, so each image is only ever signed once.

The free service takes a few images at a time. **When the console says the service asked FightBot to wait, that's normal.** Nothing is broken and there's nothing to do. FightBot waits for as long as it's asked, then carries on by itself until every image is signed, with a line like \`Signed skin 4 of 12\` for each one. If the service stays busy for a very long time, FightBot takes a break and signs the rest on the next restart or \`/fb reload\`.

- Until the first image is signed, new bots look like Steve or Alex. After that, each new bot wears one of the images signed so far.
- A bot keeps the skin it spawned with.
- Want it faster? Get a free API key at [mineskin.org](https://mineskin.org) and put it in \`identity.skin-api-key\`.
- If an image can't be signed, FightBot names it and says why. The usual reason is that it isn't a real 64×64 skin. Fix or remove the image, then \`/fb reload\`.
- Added images while the server is running? Run \`/fb reload\`.

Already have signed skin data? Save it as a small \`.yml\` file in the skins folder, with a \`value:\` line and a \`signature:\` line. The \`README.txt\` in that folder explains how.

\`mojang\` and \`random\` mode download skins in the background the same way. The first bots after a fresh start may look plain for a moment. Mojang also asks for a short wait sometimes, and that's normal too.` },
  { id: "names", title: "Names", body:
`Choose how \`--random\` names are made with \`identity.name-source\`:

| Setting | Names |
|---|---|
| \`random\` | Made-up, player-style names, like \`BlockRunner42\`. This is the default. |
| \`file\` | Picked from \`botnames.yml\`. |
| \`numbers\` | Numbered names, from \`identity.number-format\`. |

Number patterns use \`%<digits>n\` for one random character from those digits, and you can chain them. For example, \`Bot%01n%01n\` gives \`Bot00\`, \`Bot01\`, \`Bot10\` or \`Bot11\`. Watch how many names a pattern can make: \`%01n\` only has two, so a third bot gets a made-up name instead, and FightBot tells you why. The older style also works: \`%03d\` gives a random number padded to three digits, like \`042\` or \`517\`.

With \`file\`, if \`botnames.yml\` is empty or every name in it is taken, bots get made-up names, and FightBot says so in chat.

\`identity.protect-real-names\` (on by default) stops bots taking the name of anyone who has played on your server. Turn it off to let bots use those names too, for example on a scripted server. Online players, AuthMe accounts and banned names are still off-limits.` },
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
- **Other login plugins** (nLogin, LoginSecurity, and others): these hold players who haven't logged in, and bots can't log in. If bots won't fight, that's why.
- **PacketEvents** (on its own or inside GrimAC): it tries to kick players whose connection it can't hook, and bots have none. FightBot stops that kick, for bots only.
- **ViaVersion:** its "Could not find UserConnection" warning when a bot joins is harmless.
- **ProtocolLib:** plugins built on it expect every player to have a network connection. Bots don't, so if one logs errors naming a bot, that's why.
- **Anticheats:** they judge players by what their game sends, and bots have no game. If one kicks a bot, FightBot says why.
- **PvP turned off** in a world: FightBot warns at startup and when a bot's hits don't land.
- **Simple Voice Chat:** bots can talk. See Voice lines.
- **PlugManX** and \`/reload\`: see Reloading FightBot.

## LuckPerms

With LuckPerms on the server, each bot gets its LuckPerms data as it joins, just like a player:

- **Groups, permissions, prefix and suffix.** Tab list, name tag and chat plugins show a bot's prefix like anyone else's.
- **Permission checks.** LuckPerms answers every permission check on a bot. If a bot isn't allowed to do something, it can't do it.
- **\`/lp user <bot>\` works.** Give a bot a rank with \`/lp user <bot> parent add vip\`, and every bot with that name has it from then on.

Settings:

- \`luckperms.group\` puts every bot in a LuckPerms group while it's here, on top of its own groups. Use it for a \`[Bot]\` prefix, or for permissions only bots should have. Make the group first with \`/lp creategroup bot\`. It's kept in memory only, never saved.
- \`luckperms.enabled: false\` turns all of this off.

If a bot is spawned with the name of someone LuckPerms already knows, \`/lp user <name>\` still means that player, not the bot.` },
  { id: "voice-lines", title: "Voice lines", body:
`With the **Simple Voice Chat** plugin on the server, bots show up in voice chat like players, and they talk. Players hear them with the voice chat mod, coming from the bot, and can turn bots up or down with the **FightBot** slider in voice chat's volume settings. Without Simple Voice Chat, nothing changes. \`/fb vc\` shows whether it's working.

**How bots show up.** Each bot gets one of these when it joins, like real players (\`voice.presence\` sets the chances):

| | In voice chat | Says lines? |
|---|---|---|
| \`talks\` | Connected | Yes |
| \`muted\` | Voice chat turned off (the crossed-out icon) | No |
| \`no-mod\` | Doesn't have the mod (the disconnected icon) | No |

Change one bot with \`/fb vc presence <bot> <talks\\|muted\\|no-mod>\`. A bot with voice chat turned off, or without the mod, stays quiet like a player would, even when you tell it to say something.

**FightBot's own lines.** These come in the jar, and bots say them by themselves. Anyone can also play one with \`/fb vc <name>\`:

| Line | When a bot says it by itself |
|---|---|
| \`hello\` | As it joins: 1 in 50 bots |
| \`am_i_muted\` | As it joins, the rare one: 1 in 200 |
| \`grass\` | When it pulls up grass while roaming: 1 in 100 times |

More come with updates. Each bot speaks in one voice, so it always sounds like the same person. \`voice.triggers\` sets how often (a percentage of those odds) and a cooldown for each moment, and \`voice.min-gap-seconds\` and \`voice.max-talking\` stop bots talking over each other. Rather they only talked when you say so? \`voice.on-their-own: false\`.

**Your own lines.** Put \`.mp3\` or \`.wav\` files in \`plugins/FightBot/voice/\`, then \`/fb vc reload\`. The file's name is the line's name: \`plotvoiceline.mp3\` is \`/fb vc plotvoiceline\`. Lines are cut off after \`voice.custom.max-seconds\` (15 by default). You can also add them in the web editor, which converts other kinds of sound file, like a phone's \`.m4a\`, for you.

**Nobody can pass off a file as FightBot's.** A file added to a server is **never** said by a bot on its own, only when someone types \`/fb vc <name>\` (that needs \`fightbot.voice.custom\`, which ops have). Everyone near the bot sees a note in chat that it's *a sound file added by this server*, and who played it. Every play, and every file added through the web editor, is written to \`voice/plays.log\` with the file's fingerprint (SHA-256).

| Setting | Default | What it does |
|---|---|---|
| \`voice.enabled\` | \`true\` | Bots in voice chat at all. |
| \`voice.on-their-own\` | \`true\` | Bots say FightBot's lines by themselves. \`false\`: only when played with \`/fb vc\`. |
| \`voice.presence.talks\` / \`muted\` / \`no-mod\` | \`50\` / \`20\` / \`30\` | How bots show up, as chances. |
| \`voice.distance\` | \`0\` | How far away bots are heard, in blocks. 0 is voice chat's own distance. |
| \`voice.volume\` | \`1.0\` | How loud bots are (0.5 is half, 2.0 twice). Every line is evened out to the same loudness first, so a loud recording does not blare. Players also get a FightBot slider in voice chat. |
| \`voice.triggers.<what>\` | | \`enabled\`, \`chance\` (a percentage of each line's own odds: 100 is as set, 200 twice as often) and \`cooldown\` (seconds) for each moment a bot talks about. |
| \`voice.custom.enabled\` | \`true\` | Whether files added to the server can be played at all. |` },
  { id: "the-web-editor", title: "The web editor", body:
`Change FightBot from your browser instead of the server files. Type \`/fb web\` in game (or the console) and click the link — it takes about 5 seconds to make, up to 30 on a slow connection. The editor at [fightmc.xyz](editor/) lets you:

- **change any setting**, with each one explained, saved and reloaded for you. Every true-or-false one is a switch you flip
- **see the bots that are on**, with their health, what they're doing, their group and where, and stop or remove them
- **run the bots**: spawn them, send them after someone, set them roaming or patrolling, make groups and set two on each other, hand out kits, and flip any one bot's own switches
- **upload skins** and **voice lines**
- **read the debug logs**, follow one live, or download it

| Command | What it does |
|---|---|
| \`/fb web\` | A link to the editor. Clicking it in chat opens it. |
| \`/fb web new\` | A fresh link. The old one stops working. |
| \`/fb web stop\` | Closes it now. |

How it stays safe:

- **The link is the key.** Anyone with it can change FightBot on your server, so don't share it. It stops working after \`web.idle-minutes\` unused (30), after \`web.max-hours\` (4), or when you type \`/fb web stop\`.
- **Nothing to open up on your server.** Your server and the page both connect out to a relay, and everything between them is encrypted with a key that's only in your link. The relay can't read any of it.
- **Only FightBot's own things.** The editor can't run commands or touch other files, and every change is checked like a config edit. Everyone with \`fightbot.use\` is told in chat what was changed from the web, and by whose link.
- \`web.read-only: true\` lets the editor look at everything but change nothing. \`web.enabled: false\` turns it off. It needs the \`fightbot.web\` permission (ops have it).` },
  { id: "reloading-fightbot", title: "Reloading FightBot", body:
`You can reload FightBot while the server keeps running, with PlugManX (\`/plugman reload FightBot\`) or \`/reload\`. Turning it off and on again with \`/plugman disable\` and \`/plugman enable\` works too.

- Every bot is written down first and comes straight back afterwards, in the same place, with the same skin, gear, health, settings and group.
- Bots carry on with what they were doing: roaming, patrolling, fighting and group fights.
- Any bot body an older copy of FightBot left behind is removed first, so its name is free again.
- \`reload.keep-bots: false\` removes the bots on a reload instead.

A server restart still starts with no bots, as always.` },
  { id: "updates", title: "Updates", body:
`When the server starts, and twice a day after, FightBot looks on Modrinth for the newest release made for your Minecraft version.

- A newer one is downloaded into the server's update folder (\`plugins/update\`). FightBot checks it against Modrinth's checksum and makes sure it really is FightBot.
- It goes in by itself the next time the server starts, or when FightBot is reloaded. Nothing changes while the server is running.
- Admins (anyone with \`fightbot.use\`) are told in chat when they join, and the console says so too.
- \`/fb update\` looks right away.
- A release that's taken back down on Modrinth is removed from the update folder again, if FightBot downloaded it.

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
| \`messages.staff-notices\` | \`true\` | FightBot tells staff in chat when something happens by itself (a bot kicked, an update out). \`false\`: console only, for scripted or recorded servers. |
| \`combat.miss-chance\` | \`0.08\` | How often a swing misses, mostly at the edge of reach. |
| \`combat.reaction.min-ticks\` / \`max-ticks\` | \`3\` / \`7\` | How long a bot takes to react to someone stepping into reach. |
| \`mace.enabled\` | \`false\` | Mace combat: wind jumps and elytra dives. |
| \`death.drop-items\` | \`auto\` | What a bot drops when it dies: \`auto\` (like a player), \`always\` or \`never\`. |
| \`voice.enabled\` | \`true\` | Bots in voice chat, when Simple Voice Chat is on the server. |
| \`web.enabled\` | \`true\` | The web editor (\`/fb web\`). |
| \`building.pillar\` | \`true\` | Pillaring up to reach you. |
| \`building.bridge\` | \`false\` | Bridging gaps and water. |
| \`mining.enabled\` | \`false\` | Breaking blocks in the way with a pickaxe. |
| \`head-movement.natural\` | \`false\` | \`true\` turns the head at a person's pace, with a little aim drift. |
| \`ping.enabled\` | \`true\` | A realistic, wandering ping in the tab list. |
| \`death.leave-message\` / \`sound\` | \`true\` | The "left the game" line and the death boom. |
| \`reload.keep-bots\` | \`true\` | Bots come back after a plugin reload, doing what they were. |
| \`luckperms.enabled\` / \`group\` | \`true\` / \`""\` | LuckPerms data for bots, and a group for every bot. |
| \`updates.check\` / \`download\` / \`betas\` | \`true\` / \`true\` / \`false\` | Update checks, as above. |

## Building

Building is always a last resort. A bot looks for stairs, slopes and ways round first.

- **Pillaring** (on by default): when you're above it and there's no way up, it crouches, jumps and places blocks under itself until it's level with you.
- **Bridging** (off by default): when there's a gap or water in the way and no way round, it bridges across.

\`building.blocks\` lists what they build with. Each bot picks one when it spawns.` },
  { id: "troubleshooting", title: "Troubleshooting", body:
`**The skin signing service is "busy", or asked FightBot to wait.**
That's normal. FightBot waits and carries on by itself. \`/fb skins\` shows progress.

**Bots look like Steve.**
Type \`/fb skins\`. It tells you what's missing. The usual causes:

- \`skin-source\` is still \`none\`
- the skins folder is empty
- \`skin-names\` is empty
- the skins are still signing

**A command block stopped spawning bots.**
FightBot stopped it for spawning too many bots too fast. Ops were told which one. Run \`/fb reload\` to let it spawn again.

**I can't hit a bot right after it teleports or pearls.**
Fixed in 5.17.0: bots can be hit the moment they arrive, like players.

**Bots crit me while walking, or hit me the instant I'm in reach.**
Fixed in 5.17.0: bots only crit when they jump and fall, like you, and take a moment to react.

**A dead bot didn't drop its armour.**
Fixed in 5.17.0: bots drop everything they had, like a player, unless the world keeps inventories (\`death.drop-items\` changes that).

**Bots don't talk.**
Type \`/fb vc\`. Simple Voice Chat has to be on the server, and only bots that "talk" say anything. FightBot's own lines come with updates; your own files only play when someone types \`/fb vc <name>\`.

**Bots won't hurt anyone.**
FightBot tells you why in chat, and how to fix it on your version. Usually PvP is off, you're in creative, or a plugin such as WorldGuard blocks PvP there.

**"X left the game" shows twice (or more) when a bot dies.**
Fixed in 5.16.8: a bot that dies shows one "left the game" line, or none with \`death.leave-message: false\`.

**Bots stop at a river.**
Fixed in 5.16.8: bots going after someone swim across. Free roamers stay on dry land on purpose.

**After a plugin reload, bots stood about doing nothing, or "name is already taken".**
Fixed in 5.16.8: see Reloading FightBot.

**A bot disappeared.**
It was killed, kicked or banned, and FightBot says which in chat. A name banned with \`/ban\` can't be spawned until \`/pardon <name>\`.

**"'Name' is banned on this server."**
That name was banned, perhaps by a death-ban plugin. Run \`/pardon <name>\`, or use another name.

**The plugin loads, but bots won't spawn.**
Check the console at startup. FightBot says whether your server can run bots and, if not, why. You need Paper 1.20.5 or newer.

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

You can also read and download the logs in the web editor, and attach one to a [bug report](report.html) on this site.` }
];
