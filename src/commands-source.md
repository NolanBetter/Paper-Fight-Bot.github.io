## FightBot Commands

Main command: `/fightbot` (alias: `/fb`). Permission: `fightbot.use` (OP by default). Two more, also OP by default: `fightbot.web` for the web editor, and `fightbot.voice.custom` to play sound files added to the server.

> **New? Type `/fb guide` in game.** It walks you through setup one step at a time. `/fb help` lists every command.

### Help
- `/fb guide` — A quick walkthrough. Topics: `start`, `skins`, `names`, `gear`, `groups`, `routes`, `voice`, `web`, `problems`
- `/fb guide <topic>` — One topic, e.g. `/fb guide skins`
- `/fb skins` — Where your skins stand right now, and how to set them up
- `/fb skins names` — Every name FightBot found with its own skin, to copy (click to copy in game; all of them are saved to `skins/found-names.txt`)
- `/fb help` — Every command

### Spawning
- `/fb spawn` — One bot with a random name, where you stand, facing the way you face
- `/fb spawn <count>` — Up to 200 bots with random names (20 a tick, so the server keeps up)
- `/fb spawn <name>` — One bot with the name you choose
- `/fb spawn --random [count]` — The long way of writing `/fb spawn <count>`
- `/fb spawn [name|count] --location <x> <y> <z> [world] [yaw pitch]` — Spawn somewhere else. Works like `/tp`: `~` is where you are (`~5` is 5 more), `^ ^ ^3` is 3 blocks ahead of where you look. `--location` goes last

> **Command blocks** can spawn bots too (`~` counts from the block). A command block that spawns more than 200 bots within 20 ticks, or has more than 200 of its bots in the game at once, is stopped until `/fb reload`, and ops are told where it is.

### Fighting
- `/fb fight <bot> <player...>` — One bot fights one or more players
- `/fb fight --all <player...>` — Every bot fights them
- `/fb fight --group <group> <player...>` — A whole group fights them (several groups work too)
- `/fb fight --group <group> <group>` — Two groups fight each other as one-on-one duels
- `/fb stop` (or `stop --all`) — Every bot stops: fights, roaming and patrolling
- `/fb stop <bot>` — One bot stops, whatever it's doing

### Managing bots
- `/fb list` — Every bot (in game: their heads; click one for its menu)
- `/fb remove <bot|--all>` — Remove bots
- `/kick <bot>` — Removes the bot, like `/fb remove`
- `/ban <bot>` — Removes the bot; its name can't be spawned again until `/pardon <bot>`
- `/fb edit clone <bot> <newName|--random>` — Copy a bot, gear and settings included
- `/fb edit clone <bot> --random <count>` — Up to 200 copies at once
- `/fb edit change <bot> <newName|--random>` — Rename a bot
- `/fb tp <bot|--all|--group <group>> <player|x y z>` — Teleport bots; sent to a player, they face the way that player faces
- `/fb look <bot|--all> <player|bot|--stop>` — Bots watch someone until you say `--stop`, or until they leave or die. Works on busy bots too (roaming, marching…). Given another order, such as a fight, they look at their opponent, then go back to watching

### Actions — make a bot do what a player does
`/fb action <bot|--all|--group <group>> <action>`
- `jump` — Jumps
- `crouch` — Crouches (again to stand up)
- `left-click` — Swings, hitting what it looks at
- `right-click` — Uses the block it looks at (a door, a button…), or else the item in its hand
- `walk [forward|back|left|right] [seconds]` — Walks that way, relative to where it faces (forward if you don't say). It keeps going until `stop`, or for that many seconds
- `sprint [seconds]` — Sprints forward (sprinting only goes forward, as for a player; other directions walk)
- `stop` — Stops walking or sprinting
- `turn <left|right|around|degrees>` — Turns it (positive degrees turn right)

Moving by hand works like holding a key down: **nothing is automatic.** It doesn't step up blocks, stop at edges or go round anything. Make it jump with `/fb action <bot> jump` while it moves, for sprint-jumps too. Crouching while walking makes it crouch-walk. Turn it with `/fb look` or `turn` first. `/fb stop` also ends it.

### Marching and surrounding
- `/fb march <bot|--all|--group <group>> [player] [left|straight|right]` — Bots march in rows behind you (or the player you name): a 1-block gap, then a row of 3 (one in the middle, one either side), then the next row straight behind, and so on. They look at you (`straight`, the default), or add `left` / `right` for a parade's "eyes left" / "eyes right" (e.g. `/fb march --all Nolan left`; with no player, you lead: `/fb march --all left`)
- `/fb surround <bot|--all|--group <group>> [player]` — Bots stand in a ring round you (or the player you name), looking at you. The more bots, the bigger the ring
- `/fb march <bot|--all|--group <group>> --stop` (or `surround … --stop`, or `/fb stop`) — End it
- `/fb protect <bot|--all|--group <group>> [player] [behind|front|side]` — Bodyguards: bots keep close to you (or the player you name), behind, in front or down each side, and go after anyone who hurts them. They look where the player looks. `--stop`, or `/fb stop`, ends it

They keep their places as you walk and run, and get to them round trees, walls and steps. In a straight line the rows stay tight; on a turn they swing round to their new places. Bots far behind (48 blocks, or in another world) are brought to their place. A bot that's hit fights back, then takes its place again, but never against the player it follows (`formation.ignore-leader`). The row width, the gaps, the ring's size and spacing, and the bodyguards' settings are all in the config (`formation.*`).

### Bots that join by themselves (off by default)
- `/fb join <number>` — That many bots join like players ("X joined the game") at `joining.at` (the world spawn by default). What they do is `joining.objective`: go after a player (`hunt`), walk to `joining.point` (`point`), or both. Up to 20 at a time. Needs `joining.enabled: true`; with `joining.on-their-own` they also join by themselves now and then. The rest is in `joining.*` in the config

### Bot settings
- `/fb settings` — Pick a bot, then open its own settings menu
- `/fb settings <bot>` — Open that bot's settings straight away
- `/fb edit` / `/fb edit <bot>` — The same menu

From the menu you can:
- bring the bot to you, or go to it
- rename or clone it
- change its group
- open its gear
- stop it, or heal it
- set it roaming or patrolling

It also has **per-bot switches**, so one bot can behave differently from the rest:
- ender pearls, cobwebs, shield, shield breaking, water bucket, potions
- mace combat, bow & crossbow, spear fighting, elytra flying
- cart PvP, crystal PvP
- fights back: players, and fights back: bots
- pillaring, bridging, mining
- realistic ping

Switches that are on glow. Click one to flip it, or right-click to hand it back to the server's setting. Changes apply as you click.

### Roaming
Bots can walk a route, or wander about freely, when they aren't fighting. Routes are shared with patrolling, and the route and point commands work with either prefix.
- `/fb roaming` (or `roam`) — Open the roaming screens
- `/fb roamingroutecreate <route>` — Create a route
- `/fb roamingroutedel <route>` — Delete a route; any bots on it stop
- `/fb roamingroutechange <route> <newName>` — Rename a route
- `/fb roamingroutelist` — Every route
- `/fb roamingpointset <route>` — Add a point where you're standing
- `/fb roamingpointset <route> <number>` — Move that point to where you're standing
- `/fb roamingpointdel <route> <number>` — Delete a point
- `/fb roamingstart <bot|--all|--group <group>> <route> [loop|back|stop]` — Walk a route. At the end it loops, walks back, or stops. A group walks it together as a squad
- `/fb roamingfree <bot|--all|--group <group>>` — Wander about freely near where it is
- `/fb roamingstop <bot|--all|--group <group>>` — Stop roaming

### Patrolling
A patrol walks a route and goes after that route's targets, and only those. After the fight, it goes back to its route. Targets who are gone (logged off, removed, or a group that was deleted or emptied) come off the route once nobody is patrolling it. While a patrol runs, it keeps them, and goes after them again when they're back.
- `/fb patrolling` (or `patrol`) — Open the patrolling screens
- `/fb patrollingstart <bot|--all|--group <group>> <route> [loop|back|stop]` — Patrol a route
- `/fb patrollingstop <bot|--all|--group <group>>` — Stop patrolling
- `/fb patrollingtargetadd <route> <player|bot|group>` — Give a route's patrols a target
- `/fb patrollingtargetdel <route> <name>` — Remove a target
- `/fb patrollingtargetlist <route>` — Who a route's patrols hunt
- All the route and point commands above also work as `patrolling…`

Bots fight back when a player hits them, or when another bot hits them on purpose, then pick up where they left off. Turn either off in the config (`combat.fight-back.players` and `combat.fight-back.bots`), or for one bot in its settings.

A bot does one job at a time: fighting, roaming or patrolling. To give a busy bot a new job, or to open its gear, stop it first. FightBot tells you when. With `orders.must-stop-first: false` in the config, a new order takes over instead (opening its gear still needs it stopped).

### Kits & saves
- `/fb kits` (or `saves`) — One screen, with kits on one side and saves on the other. Seven of each, plus five ready-made loadouts underneath: `diamond-sword`, `netherite-sword`, `mace`, `crystal` and `cart`

### Kits — re-gear bots you already have
- `/fb saveload <bot> [1-7]` — Store a bot's gear and potion effects (like invisibility) as a kit (no number: the first free slot)
- `/fb kit <bot> <1-7|ready-made>` (or `load`) — Give a bot a kit or a ready-made loadout (`/fb kit Bob mace`), replacing what it carries
- `/fb kit --all <1-7|ready-made>` — Give every bot the kit (busy bots are skipped)
- `/fb kit --group <group> <1-7|ready-made>` — Give a whole group the kit
- `/fb delload <1-7>` — Delete a kit (the ready-made ones can't be deleted)

In the kits screen, pick a kit, then pick as many bots as you like. Each one drops off the list once it has the kit.

### Saves — spawn new bots with stored gear and settings
- `/fb savegear <bot> [1-7]` — Store a bot's gear, settings and potion effects (like invisibility) in a save slot (no number: the first free slot)
- `/fb save <1-7|ready-made> [name|--random] [count] [--location <x> <y> <z> ...]` — Spawn bots from a save, or wearing a ready-made loadout (`/fb save crystal`)
- `/fb delsave <1-7>` — Delete a save

### Groups
- `/fb groups` — Open the groups screen
- `/fb groupcreate <name>` — Create a group
- `/fb groupadd <group> <bot|player>` — Add a bot, or an online player. Each is in one group at a time, so adding one that's in another group moves it. If the group is roaming, patrolling or fighting together, a free bot joins in. A busy bot keeps at its own job until it's free (or joins in straight away with `orders.must-stop-first: false`).
- `/fb groupadd <group> --all` — Put every bot in the group
- `/fb groupremove <group> <bot|player>` — Take a bot or a player out
- `/fb groupdel <group>` — Delete a group; its bots are freed
- `/fb grouplist [group]` — List groups, or one group's members (in game: opens the screen)
- `/fb groupcheck <bot>` — See which group a bot is in
- `/fb groupchange <group> <newName>` — Rename a group

Players in a group are on the team with its bots. With `groups.friendly-fire: false` (the default), a bot never fights back against someone in its own group. Bots that come back after a restart are back in their group, and players stay in theirs until they're taken out.

### Group fights
- `/fb groupfight <group> <group>` — Two groups fight as one-on-one duels: each bot takes one opponent until one of them falls, then picks the next. Players in either group are in the fight too, so 3 against 300 works
- `/fb groupfight <group> <player|bot>` — A whole group goes after one target
- `/fb groupstop <group> [group]` — Stop one group, or both sides of a fight

### Voice lines (needs Simple Voice Chat)
- `/fb vc` — Is voice chat working, how many bots talk, and the commands
- `/fb vc <line>` — The bot nearest you that talks says a line (FightBot's own: `hello`, `grass`, `am_i_muted`)
- `/fb vc <line> <bot|--all|--group <group>>` — Those bots say it
- `/fb vc play <line> [bot|--all|--group <group>]` — The same, for a line named like a command (`list`, `stop`…)
- `/fb vc list` — Every line: FightBot's own, and the files added to the server
- `/fb vc stop [bot|--all]` — Stop talking (no name: every bot)
- `/fb vc presence <bot|--all|--group <group>> <talks|deafened|no-mod>` — How a bot shows in voice chat: talking, deafened (voice chat turned off, the crossed-out speaker), or no mod at all
- `/fb vc reload` — Look in `plugins/FightBot/voice/` again

Deafened bots, and bots without the mod, stay quiet even when told. So does every bot while CPM is on the server (see Player models). Add a line: put an `.mp3` or `.wav` in `plugins/FightBot/voice/` — the file's name is the line's name, so `plotvoiceline.mp3` is `/fb vc plotvoiceline`. Files added to the server are **never** said by a bot on its own. Everyone near the bot is told it's a sound file added by this server, and who played it, and every play goes in `voice/plays.log`.

### AI voice chat (needs Simple Voice Chat and an AI key)
- `/fb ai` — Is it listening, which bots can answer (and why the others can't), the last thing it heard and the last answer
- `/fb ai watch` — Show each step live in your chat while you test: *hearing you*, what the AI heard, what the bot says, or why nothing happened. Only your own chats (the console sees everyone's). Again to stop

Stand within 8 blocks of a bot (`ai.range`), look at it and say something short like "hi". It answers out loud in a word or two, then gets back to fighting. Turn it on with `ai.enabled: true`, `ai.provider: groq` and your key in `ai.api-key` (Gemini and OpenAI work too) - the AI setup guide has every step. Chats have no limit by default; players with `fightbot.ai.limited` get `ai.limited-replies` answers (2).

### Emotes (needs Emotecraft)
- `/fb emote` — Every emote bots can play
- `/fb emote <bot|--all|--group <group>> <emote>` — Play an emote
- `/fb emote <bot|--all|--group <group>> --stop` — Stop it

Emote files (`.json` or `.emotecraft`) go in `plugins/FightBot/emotes/`, or upload them in the web editor; an emote is named after its file. A bot told to fight stops its emote. Only players with the Emotecraft mod see emotes.

### Player models (needs Customizable Player Models)
No commands: put `.cpmmodel` files in `plugins/FightBot/models/` (or upload them in the web editor) and each new bot wears one at random (`identity.models`). Only players with the CPM mod see them. A `.cpmproject` is the CPM editor's save file, not a model: open it in the editor, then File > Export with *Export mode: Model*. While CPM is on the server, bots show no voice chat icon and stay quiet, so the Voice Chat and CPM mods don't crash anyone's game (`identity.models.voice-safe`).

### Web editor
- `/fb web` — A link to edit FightBot in your browser: settings, skins, emotes, player models, voice lines, the bots that are on, and the debug logs. Clicking it in chat opens it
- `/fb web new` — A fresh link (the old one stops working)
- `/fb web stop` — Close it now

The link stops working after 30 minutes unused or 4 hours, and anyone who has it can change FightBot on your server — don't share it. Everything going between your server and the page is encrypted with a key that's only in the link.

### Networks (Velocity and BungeeCord)
Put the same FightBot jar on the proxy too (the Paper build). The servers link up to it by themselves.
- `/fb network` — Is this server linked to the proxy, and what bots are on each server
- `/fb send <bot> <server> [player]` — Move a bot to another server, with its gear, health, skin and settings. It arrives at spawn, or next to the player you name

On the proxy (permission `fightbot.proxy`, or the proxy console):
- `/fbp list` — Every server, whether it's linked, and its bots
- `/fbp <server> <command>` — Run a FightBot command on that server, like `/fbp arena list`
- `/fbp all <command>` — Run it on every linked server
- `/fbp send <bot> <server> [player]` — Move a bot to another server
- `/fbp web` — One web editor link for every server, with a server picker (`/fbp web stop` closes it)
- `/fbp update` — Look for a newer FightBot for the proxy now (it also updates itself)
- `/fbp status` — How the link is doing

Only the servers where you want bots need FightBot. Bots count in the network's player count and the server list's hover list. With `network.share-kits`, `share-saves`, `share-skins` and `share-voice` on, kits, saves, skins and voice lines are the same on every server that shares them.

### Other
- `/fb reload` — Re-read the config without restarting (it also shows how your skins are doing)
- `/fb debug <on|off>` — Log everything the bots do to `plugins/FightBot/debug/` (`/fb debug` alone shows whether it's on)
- `/fb update` — Look on Modrinth for a newer FightBot right now

> **Skins:** set `identity.skin-source` to `random`, `folder` or `mojang`, then `/fb reload`. With `random`, about 970 skins come built in, ready at once, and FightBot also finds real names with their own skins while nobody's on the server, and new bots get those names, each wearing its own skin (`identity.find-skins`). The console says when it finds some, and `/fb skins` shows how many and who it's waiting for. If the console says the skin signing service asked FightBot to wait, that's normal. FightBot carries on by itself. `/fb skins` shows how far along it is.
>
> **Kicks and bans:** `/kick`, `/ban` and ban plugins (including death-ban plugins) remove bots, like players. A name banned with `/ban` can't be spawned until `/pardon <name>`.
>
> **LuckPerms:** bots get their groups, permissions and prefixes like players, and `/lp user <bot> ...` works on them. Set `luckperms.group` to put every bot in a group (say, for a [Bot] prefix).
>
> **Reloads:** after `/plugman reload FightBot` or `/reload`, bots come straight back, still doing what they were.
>
> **Updates:** FightBot downloads new releases from Modrinth by itself, ready for the next restart, and tells admins. It picks the right build for the server (the Paper build on Paper and Purpur, FightBot for Spigot on Spigot and CraftBukkit), and swaps a wrong one at the next restart. Turn downloads off with `updates.download: false`.
>
> **Shields and knockback:** bots block with a shield and take knockback exactly like players. A shield only blocks from the front, once it's been up a quarter of a second, and an axe knocks it out for 5 seconds, so stun slams work.
>
> **Movement:** bots sprint-jump after players on open ground and crit off the jump, jump gaps up to 3 blocks wide, walk round a single missing block, and cross wider gaps by placing blocks (a block mid-jump over 4, bridging down to 3 on anything wider). See `movement.*` in the config.
>
> **Cart PvP:** a bot with TNT minecarts, rails, cobwebs, arrows and a bow or crossbow (plus flint and steel, unless the bow has Flame) cobwebs its target, puts a rail beside them and a TNT minecart on it, then shoots a burning arrow into the cart. Without Flame it lights fire just before the cart and shoots through it. A crossbow is kept loaded, so the shot is one click. Up close, it cobwebs you and steps back first. Any rail works. Rain puts burning arrows out, so bots don't try it in the rain. Give bots totems: a cart blast is big.
>
> **Crystal PvP:** a bot with end crystals (and obsidian, unless there's obsidian or bedrock about) places obsidian beside its target, a crystal on top, and hits it, a few times a second. Everything is the game's own: real placements, real hits, real explosions. It picks the spot that hurts its target most for the least to itself, only where it can hit the crystal too, and plays safer when its health is low. It suits fast-crystal servers (`crystal.per-second`). Give it armour and totems: crystals hurt both sides.
>
> **Cobwebs:** bots are slowed in a cobweb like a player (a quarter of the pace, no jumping out), and can't hit through one, not even one round their own head. They cut it away first: about half a second with a sword or shears. Given cobwebs, bots now and then trap your feet, then your head, web up runners and cut themselves free. Tune it with `cobwebs.*` in the config: `cobwebs.how-often: 200` webs you within about 2 seconds when you're close.

> **Building blocks:** with `building.only-own-blocks` (`kit` by default), a bot that's been given a kit only pillars, bridges and builds over gaps with blocks it carries, and uses them up. No blocks, no building.
>
> **Mace:** a bot with a mace and wind charges wind-jumps and smashes; with an elytra and rockets it flies up and dives on you. With a Wind Burst mace, every smash throws it back up and it rockets straight back down at you, again and again until it misses. After a miss it saves itself with a wind charge, a water bucket or its elytra.
>
> **Capes:** 30% of bots wear a cape that came with their skin (`identity.capes`). Minecraft only shows capes Mojang gave an account, so capes can't be made from pictures.
>
> Bridging and mining are off by default, and pillaring and mace combat are on. Change any of them in the config, or for one bot in its settings menu.

## Equipment

Right-click a bot **in Creative mode** to open its inventory, or use **Open gear** in its settings menu. Stop it first if it's busy.

| Where | Contents |
|-------|----------|
| Top row, 1–4 | Helmet, chestplate, leggings, boots |
| Top row, 6 | Offhand — totem or shield |
| Top row, 8 | Main hand — weapon |
| Row 2 | Panes (divider) |
| Rows 3–6 | Anything else (row 3 = the hotbar) |

Shift-click from your inventory to put things where they belong.

Only armour, the offhand and the weapon have fixed slots. The bot finds and uses anything else it's carrying, wherever it sits:
- an axe
- food
- cobwebs
- ender pearls
- a water bucket
- a mace and wind charges
- an elytra
- a pickaxe
- a bow or crossbow and arrows
- TNT minecarts, rails and flint and steel (cart PvP)
- end crystals and obsidian (crystal PvP)

## Requirements

| FightBot build | Minecraft | Needs |
|----------------|-----------|-------|
| FightBot (Paper build), newer than 3.17.1 | 1.20.5 and up | Paper, or a fork like Purpur. Nothing else. |
| FightBot for Spigot (`-spigot` versions, 6.0.9 and up) | 26.1 and up | Spigot or CraftBukkit. Nothing else. |
| 3.17.1 and older | 1.16 and up | LibsDisguises |

Optional: a Velocity or BungeeCord proxy (5.18.0 and up), with the Paper build's jar on it. Simple Voice Chat, for bots that talk and answer you (AI chat). Emotecraft and Customizable Player Models, for emotes and models on bots (6.0.0).

Newer versions make bots **genuine server-side players**, not disguised mobs. Both builds come out together with the same features. Folia isn't supported, and Spigot older than 26.1 can't host bots; FightBot says so at startup. If your server is below 1.20.5, use 3.17.1 with LibsDisguises.

More at [fightmc.xyz](https://www.fightmc.xyz)
