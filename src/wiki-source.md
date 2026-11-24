# FightBot Wiki

FightBot adds PvP bots to your Paper or Spigot server. Each bot is a real server-side player: it has a real hitbox, real physics and a spot in the tab list, and every other plugin sees it as a player. Bots fight with swords, axes, shields, totems, pearls, cobwebs, water buckets, potions, bows, TNT minecarts and end crystals. They can also walk routes, patrol an area and fight in teams.

> **New here? In game, type `/fb guide`.** It walks you through everything below, one short step at a time.

## Requirements

| FightBot build | Minecraft | Needs |
|---|---|---|
| FightBot (the Paper build), newer than 3.17.1 | 1.20.5 and up | Paper, or a fork like Purpur. Nothing else. |
| FightBot for Spigot (`-spigot` versions, 6.0.9 and up) | 26.1 and up | Spigot or CraftBukkit. Nothing else. |
| 3.17.1 and older | 1.16 and up | LibsDisguises |

Both builds come out together, with the same features, commands and config. They're published on the same Modrinth page: the Spigot build's versions end in `-spigot`. Each release is tested on every supported version.

Optional: **Simple Voice Chat**, for bots that talk (5.17.2 and up) and answer you with AI (6.0.0). See [Voice lines](#voice-lines-simple-voice-chat) and [AI voice chat](#ai-voice-chat).

Optional: **Emotecraft** and **Customizable Player Models**, for emotes and models on bots (6.0.0). See [Emotes and player models](#emotes-and-player-models).

Optional: a **Velocity or BungeeCord proxy** (5.18.0 and up). The Paper build's jar goes on the proxy too. See [Networks](#networks-velocity-and-bungeecord).

Folia isn't supported, and Spigot or CraftBukkit older than 26.1 can't host bots (their internal names are scrambled). The Paper build on a Spigot server says to use FightBot for Spigot instead. Whatever the reason, FightBot says so in the console at startup instead of half-working. If your server is older than 1.20.5, use 3.17.1 with LibsDisguises.

## Quick start

1. Put the jar in `plugins/` and start the server.
2. In game, type `/fb spawn`. A bot appears where you're standing.
3. Hit it. It fights back. Or send it after someone with `/fb fight <bot> <player>`.
4. Right-click it in creative mode to give it armour and a weapon.
5. `/fb stop` calls every bot off, and `/fb remove <bot>` gets rid of one.

Every command works as `/fightbot` or `/fb`. The permission is `fightbot.use`, which only OPs have by default.

Rather click than type? `/fb web` gives you a link to change FightBot from your browser. See [The web editor](#the-web-editor).

### Help inside the game

| Command | What it shows |
|---|---|
| `/fb guide` | A short walkthrough. Pick a page: `start`, `gear`, `fights`, `groups`, `army`, `routes`, `film`, `skins`, `names`, `voice`, `ai`, `web`, `network`, `which`, `lag` or `problems`. |
| `/fb skins` | Where your skins stand right now, and how to set them up. |
| `/fb help` | Commands by topic: the basics, moving bots, filming, gear, groups, routes, voice, and the server. Each says what it does, with an example. Click one in game to put it in your chat box. `/fb help <command>` explains one (`/fb help fight`), and `/fb help all` lists every command. |
| `/fb quick` | Your [quick actions](#quick-actions): commands you've saved, one click each. |

A command typed wrong shows how it's written and says which `/fb help` explains it (6.4.5).

`/fb start` jumps straight to the getting-started page. On a brand-new server, anyone who can use FightBot gets a one-time "type /fb guide" message when they join, until the first bot is spawned.

## Which one should I use?

Several commands do nearly the same job. This is how to choose between them.

### Getting bots into the game

| Use | Best when | Not the one when |
|---|---|---|
| `/fb spawn` | You want bots now. Names and skins are picked for you. | They should arrive ready to fight: a new bot carries nothing and hits with its fists. |
| `/fb save <1-7\|ready-made>` | Every bot should arrive geared and set up the same way: an army, an arena's fighters. `/fb save mace --random 10` needs nothing set up first. | You want to change bots that are already in the game. That's a kit. |
| `/fb edit clone` | You've set one bot up by hand and want more of exactly that, right now. | You'll want them again tomorrow. A clone needs the bot to copy; a save doesn't. |
| `/fb scene load` | You're filming, and want the same bots back in the same places between takes. | You want new bots. A scene only brings back the bots it saved. |
| `/fb join` | Bots should turn up by themselves like players, at spawn, and go after someone. | You want to choose where each one stands and what it does. |

### Gear: a kit, a save or a ready-made loadout

| Use | What it keeps | Best when |
|---|---|---|
| A **kit** (`/fb saveload`, then `/fb kit`) | Gear and potion effects. | Re-gearing bots you already have: a new round, or the same army with maces instead of swords. Each bot keeps its own settings. |
| A **save** (`/fb savegear`, then `/fb save`) | Gear, potion effects **and the settings you changed** on that bot. | Spawning new bots that should also behave a certain way: pearls off, hardcore on, bridging on. |
| A **ready-made loadout** (`mace`, `crystal`, `cart`...) | A full set of top gear. Works as a kit and as a save. | Trying something out, or when the best gear is what you want. They can't be changed, so for weaker or themed bots make your own. |
| **Right-click in creative** | Nothing. It's that one bot's inventory. | Putting a loadout together by hand, to store as a kit or a save afterwards. |

In short: **a kit changes the gear on bots you have. A save spawns new bots, gear and settings together.**

The names are easy to mix up, so: `saveload` stores a **kit** and `savegear` stores a **save**. `kit` (or `load`) gives a kit to a bot, and `save` spawns a bot from a save. `/fb kits` shows both in one screen if you'd rather click.

### Starting a fight

| Use | Best when | Keep in mind |
|---|---|---|
| Hitting a bot | Practice. It fights back against whoever hit it. | Only in survival or adventure. Bots leave players in creative alone. |
| `/fb fight` | You know exactly who should be attacked: `/fb fight --all Nolan`, `/fb fight Bot1 --bot Bot2`, `/fb fight --group red --group blue`. | Every bot goes after whoever you name, so a crowd mobs them. |
| `/fb groupfight <group> <group>` | Two sides. Each bot takes one opponent, then the next, so it looks like a battle and not a mob. `/fb fight --group <group> --group <group>` is the same command. | Both sides have to be in groups first. |
| `/fb charge` | An army in a formation should attack whoever is near, without you naming anyone. | It goes for everyone in range except you, the player it followed and the other bots charging. Add `players` or `bots` to narrow it. |
| `/fb protect` | Bots should only fight someone who hurts a certain player. | They never start a fight themselves. |
| `/fb hunt` | Bots should track a player down, from anywhere in the world, like a player with the locator bar. | They only know which way, not where. Someone crouching or invisible can't be tracked. |
| A patrol (`/fb patrollingstart`) | Guards for a place. They walk a route, attack only that route's targets, and go back to the route afterwards. | A route and its targets have to be set first. |

### Following a player

| Use | Best when | Keep in mind |
|---|---|---|
| `/fb march` | An army walking behind someone. Nothing to choose, and a crowd widens by itself. With `here` the rows hold the spot you stand on instead, which is the one for filming. | It's always rows. `/fb formation` shows how they line up, and sets how wide or how long. |
| `/fb surround` | A ring round a player, everyone looking in: a boss fight, a capture, a crowd round a speaker. `here`: a ring round a spot. | The ring grows with the number of bots. |
| `/fb protect` | Bodyguards. They keep close like marchers, watch the road, and go after anyone who hurts the player. | For a parade, use `march`. Bodyguards leave their places to chase whoever lands the first hit. |

In all four, a bot that's hit fights back and then takes its place again, and none of them fight back against the player they follow.

### Moving bots about

| Use | Best when | Keep in mind |
|---|---|---|
| `/fb tp` | Putting bots somewhere at once, while you set things up. | They don't walk there, so it's not for a shot. |
| `/fb rtp` | Scattering bots round a world, each in its own random safe spot. | You don't choose where they go. |
| `/fb roamingfree` | Making a place look lived in. Nothing to set up: bots stroll about near where they are. | You don't choose where they go. |
| `/fb roamingstart <bot> <route>` | Bots should walk a path you choose: guards on a wall, a street through a town. They find their own way from point to point. | You set the points first. `/fb pointtool` is the quick way. |
| `/fb patrollingstart <bot> <route>` | The same walk, and they attack the route's targets when they see them. | |
| `/fb march <bots> --route <route>` | An army marching a route in rows, for a parade or a shot, with nobody leading (6.4.7). | They keep to rows: for bots each going their own way, roam. |
| `/fb walk <bots> <point>` | Bots walking somewhere and standing about there, like survivors gathering after a fight (6.4.8). | Make the point first, with `/fb point <name>`. |
| `/fb march <bots> --point <point>` | An army marching in rows to a place, then holding there (6.4.8). | |
| The Player Cannon (`/fb cannon`) | Bots arriving round you by ender pearl, for a shot (6.4.8). | They come in from about 35 blocks off, so they need open sky over you. |
| `/fb record` and `/fb replay` | A shot for a video. The bot does exactly what you did, looking about, crouching and swinging included, the same on every take. | It copies you; it doesn't find its own way. A block that wasn't there when you recorded stops it. |
| `/fb action <bot> walk` | A simple move in a script or a command block: forward for 3 seconds. | Nothing is automatic. It walks into walls and off ledges. |

### Where a bot looks

| Use | Best when |
|---|---|
| `/fb look <bot> <player>` | It should keep watching someone as they move. |
| `/fb look <bot> north` (or a yaw, or `same`) | It should face one way and hold it. The one for lining up a shot. |
| `/fb look <bot> <x> <y> <z>` | Everyone should look at one spot, like a stage or a door. |
| `/fb action <bot> turn left` | A turn from where it faces now, when the exact direction doesn't matter. |
| `left` or `right` on a march or formation | Heads turned while they walk, like a parade. |

Outside a fight a bot turns its head at a person's pace, so a group turning a corner or a bot told to look somewhere doesn't snap round in one frame (6.4.6). A bot with nothing to do also **glances about** now and then: off to one side, or at someone close by, for a second or two, then back the way it was placed. A bot walking with `/fb action walk` keeps its eyes ahead and walks straight, and one turned with `/fb action turn` or teleported facing a new way glances out from that new way. Bots in a formation, or told where to look with `/fb look`, stay still. `head-movement.idle-glance: false` keeps every bot still.

### Stopping and removing

| Use | What happens |
|---|---|
| `/fb stop` | Bots stay, and stop whatever they're doing. When in doubt, this one. |
| `/fb stop --group <group>` (or `/fb groupstop <group>`) | The same, for one group. `groupstop` takes two groups, to end both sides of a fight. |
| `/fb march <…> --stop`, `/fb roamingstop`, `/fb patrollingstop`, `/fb look <…> --stop` | Only that one job ends. A bot doing something else isn't touched. |
| `/fb remove` (or `/kick`) | The bot leaves the game. |
| `/ban` | It leaves, and that name can't be spawned again until `/pardon`. |
| `/fb scene remove` | Takes a scene's bots out but keeps the scene, to load again. |

### One bot, a group or everyone

Nearly every order takes a bot's name, `--all`, `--free` (every bot that isn't in a group, 6.4.8), or `--group <group>`. Make groups as soon as you have two sides, or want to order part of an army about. A group is a team too: its bots don't fight back against each other, or against players in it.

### Every bot, or just one

| Change it in | It changes | Best when |
|---|---|---|
| `config.yml`, then `/fb reload` | Every bot. | You have the server's files open anyway. |
| `/fb settings` | The same settings as the config, as screens in the game, each one explained. **Every bot's switches** has the switches from a bot's own menu, for every bot at once. | You're in the game and want to change something now. |
| `/fb web` | The same settings as the config, in your browser, each one explained. | Your host makes files awkward to reach, or you'd rather type than click. |
| `/fb settings <bot>` | One bot's switches. They beat the config for that bot. | One bot should be different: a boss with pearls, a dummy that doesn't fight back. Its switches are lost when it dies or the server restarts, unless you store it as a save. |

### Skins and names

| `identity.skin-source` | Best when |
|---|---|
| `random` (the default) | Bots should look like a real server's players, with nothing to set up. |
| `folder` | You have your own skins: a themed army, the cast of a video. Each image is signed once, a few seconds an image. |
| `mojang` | You want the skins of certain real accounts. |
| `none` | Plain Steve and Alex are fine. Nothing is downloaded, by the server or by players' games. |

For names (`identity.name-source`): `random` reads as real players, `file` is for a cast you've named yourself, and `numbers` is for bots that should read as a unit, like `Guard01` and `Guard02`.

### Voice lines or AI voice chat

Both need Simple Voice Chat. **Voice lines** are sound files a bot plays: you decide exactly what's said, and it costs nothing. **AI voice chat** has a bot answer what a player says to it, in a word or two: it needs a key from an AI company, and what players say to a bot goes to that company.

### A recording or a scene

A **recording** is what one player did, for bots to act out. A **scene** is where a set of bots stand and how each one is set up. They go together: save a scene while its bots are replaying, and `/fb scene load` brings them back and starts them again.

## Spawning and managing bots

| Command | What it does |
|---|---|
| `/fb spawn` | One bot with a random name, exactly where you stand, facing the way you face. Spawn them one at a time to line them up on a ledge (6.4.5: before, each new bot moved a block or two away from bots already there; `orders.spawn-apart: true` brings that back). |
| `/fb spawn <count>` | Up to 200 bots with random names, spread out a little. A big batch arrives over a few seconds, a few bots each tick, so the server keeps up. Run it again and the next batch lands in the same spots; with `orders.spawn-apart: true` it spreads out round the first instead. |
| `/fb spawn --name <name>` | One bot with the name you give it. A real account's name wears that account's skin: see [A name you type](#a-name-you-type). Press Tab after `--name` for a few ideas. `/fb spawn <name>` is the short way, and scripts can keep using it. |
| `/fb spawn --random [count]` | The long way of writing `/fb spawn <count>`. With no number, one bot. |
| `/fb spawn [count\|--name <name>] --location <x> <y> <z> [world] [yaw pitch]` | Spawns them somewhere else. See [Spawning somewhere else](#spawning-somewhere-else). |
| `/fb list` | Every bot's head. Click one to open its menu. |
| `/fb remove <bot\|--all\|--group <group>>` | Removes bots: one, all of them, or everyone in a group (the group itself stays). `/kick` and `/ban` work too (see [Kicks and bans](#kicks-and-bans)). |
| `/fb remove --dead` | Removes only the bots that died and are spectating (see [Hardcore](#hardcore-dead-bots-stay-as-spectators)). |
| `/fb edit clone <bot> --name <name>` | Copies a bot, gear and settings included. |
| `/fb edit clone <bot> --random [count]` | Up to 200 copies at once, with random names. |
| `/fb edit change <bot> <--name <name>\|--random>` | Renames a bot. |
| `/fb tp <bot\|--all\|--group <group>> <player\|--bot <bot>\|x y z>` | Teleports bots. Sent to a player (or another bot), they face the way that player faces. Sent to x y z, they face south. |
| `/fb rtp <bot\|--all\|--group <group>> [world] [radius]` | Sends each bot to its own random safe spot: on top of the ground, never into water, lava, cactus or fire, within `rtp.radius` (1000) blocks of the world's spawn and inside its border. In the Nether it's under the roof; in the End, on end stone. No world: the one each bot is in. |
| `/fb look <bot\|--all\|--group <group>> <player\|--bot <bot>>` | Bots watch someone until you say `--stop`, or until that player leaves or dies. |
| `/fb look <…> <yaw> [pitch]` | Bots face the way you give, in degrees. See [Facing a direction](#facing-a-direction). |
| `/fb look <…> <north\|south\|east\|west\|up\|down\|same>` | Bots face a compass direction, or `same`: the way you're facing. |
| `/fb look <…> <x> <y> <z>` | Bots look at a spot. |
| `/fb look <…> --stop` | Ends it. `/fb stop` does too. |
| `/fb action <bot\|--all\|--group <group>> <action>` | The bot does what a player does with their keys and mouse. See [Actions](#actions). |

**Tab shows each step.** After `/fb spawn` it offers `--name`, `--random`, `--location` and a few counts. After `--random` it offers a count or `--location`, and after a count or a name, `--location`. `/fb save <slot>` takes the same words.

**A player or a bot? (6.4.4)** Wherever a command can take either, a plain name is a player and a bot goes after `--bot`, the way `/fb fight` has always worked: `/fb look Bob Nolan` watches the player Nolan, and `/fb look Bob --bot Guard1` watches the bot Guard1. It's the same for `/fb tp`, `/fb march`, `/fb surround`, `/fb protect` and a route's targets. Tab only offers players as plain names, and `--bot` (then the bots) after them; `orders.bots-in-player-names: true` brings the bots back. Groups are the other way round, since a group is mostly bots: `/fb groupadd red Bob` adds the bot Bob, and `/fb groupadd red --player Steve` adds the player Steve. The older ways still work, so command blocks and scripts don't need changing.

**Nicknames (6.4.5).** A player can be named by their nickname too (EssentialsX `/nick` and other nick plugins): `/fb fight Bob Nolan` works while Nolan is nicked, and so does every other command that takes a player. A real name always comes first, and a nickname two players share isn't used. Tab offers nicknames as well. Nicks that change the player's own name, the way Scripted Solutions' nicks do, work too (6.4.8). Before, the server still knew the player by their old name, so the nick found nobody.

A bot never takes a name that belongs to someone else:

- nobody who has played on your server (unless `identity.protect-real-names` is off)
- no AuthMe or nLogin account
- no banned name

Player data is safe either way, because bots have IDs of their own. If a real player joins using a bot's name, the bot steps aside.

### Actions

`/fb action <bot|--all|--group <group>> <action>` makes bots do one thing a player does:

| Action | What it does |
|---|---|
| `jump` | Jumps. |
| `crouch` | Crouches. Again to stand up. |
| `left-click` | A swing, hitting whatever it's looking at in reach. |
| `right-click` | Uses the block it's looking at (a door, button, lever or chest), or else the item in its hand: a pearl or snowball thrown, food eaten, a bow drawn and shot, a shield raised. |
| `walk [forward\|back\|left\|right] [seconds]` | Walks that way, relative to where it faces (forward if you don't say), until `stop`, or for that many seconds. |
| `sprint [seconds]` | Sprints forward. Sprinting only goes forward, as for a player; other directions walk. |
| `stop` | Stops walking or sprinting, and anything it's doing over and over. |
| `turn <left\|right\|around\|degrees>` | Turns it. Positive degrees turn right. |

**Over and over (6.4.8):** add `repeat` on the end of `jump`, `crouch`, `left-click` or `right-click` and the bot keeps doing it: `/fb action Bob jump repeat` jumps every time it lands. Run the same command again to stop it, or `/fb action Bob stop`, or `/fb stop`. Each bot goes at a player's pace, never quite even, and a crowd doesn't jump as one. With `actions.repeat: true` in the config, those four always repeat, and `once` on the end does just one.

Walking and sprinting work like holding a key down: **nothing is automatic**. The bot doesn't step up blocks, stop at edges or go round anything. It bumps into walls and walks off ledges like a player would. Make it jump with `/fb action <bot> jump` while it moves, and a sprint plus a jump is a sprint-jump. Crouched, it crouch-walks; drawing a bow or eating slows it, like you. Speeds match a player's: about 4.3 blocks a second walking, 5.6 sprinting. `/fb look` or `turn` points it first, and `/fb stop` ends it.

### Facing a direction

`/fb look` points bots exactly where you want them, which makes lining up a shot for a video or a screenshot much easier.

| You type | They do |
|---|---|
| `/fb look Bob 90` | Face yaw 90 (west), looking level. |
| `/fb look Bob 90 -20` | Face yaw 90 and look 20 degrees up. |
| `/fb look --all north` | Face north. Also `south`, `east`, `west`, `north-east` and so on, `up` and `down`. |
| `/fb look --group army same` | Face the same way you're facing right now. |
| `/fb look Bob 100 64 -20` | Look at the spot x 100, y 64, z -20. `~` works for players: `~ ~ ~5`. |
| `/fb look Bob Nolan` | Watch a player. |
| `/fb look Bob --bot Guard1` | Watch another bot. |

- **The numbers are the ones F3 shows.** Yaw: `0` south, `90` west, `180` north, `-90` east. Pitch: `-90` straight up, `0` level, `90` straight down.
- A bot keeps looking where it was told until `--stop`, whatever else it's doing: standing, roaming, marching. In a fight it looks at who it's fighting, then looks back.
- To turn a bot a little from where it is now, there's also `/fb action <bot> turn <left|right|around|degrees>`.

### Marching and surrounding

| Command | What it does |
|---|---|
| `/fb march <bot\|--all\|--group <group>> [player] [player\|straight\|left\|right]` | Bots march in rows behind you, or the player you name. Add `straight` to look straight ahead, or `left` or `right` for "eyes left" or "eyes right". |
| `/fb march <bot\|--all\|--group <group>> here` | Rows where you stand, facing the way you face, held there. See [Holding a spot](#holding-a-spot). |
| `/fb march <bot\|--all\|--group <group>> --route <route> [stop\|loop\|back]` | Rows marching a route, point to point, with nobody leading (6.4.7). See [Marching a route](#marching-a-route). |
| `/fb march <bot\|--all\|--group <group>> --point <point>` | Rows marching to a point, then holding there (6.4.8). See [Points](#points-walking-and-marching-somewhere). |
| `/fb surround <bot\|--all\|--group <group>> [player\|here]` | Bots stand in a ring round you, the player you name, or (`here`) the spot you stand on. |
| `/fb formation` | A screen showing how a march lines up, with heads, where you set how wide or how long it is. See [The formation screen](#the-formation-screen). |
| `/fb formation width <1-64>` | How many bots across each row (3 at first). Saved in the config; marches already going change at once. |
| `/fb formation length <0-64>` | Or how many rows long: the march is then as wide as it needs to be. `0` goes back to the width. |
| `/fb formation widen <on\|off>` | Whether a crowd marches wider (see below). |
| `/fb march <…> --stop` / `/fb surround <…> --stop` | Ends it. `/fb stop` does too. |
| `… spacing <blocks>` | On the end of a march or surround: how many blocks of gap between bots, 0 to 16. `/fb march --all spacing 2`. |
| `/fb charge <bot\|--all\|--group <group>> [radius] [players\|bots\|everyone]` | The bots leave their formation and attack everyone near them. See [Charge](#charge). |
| `/fb protect <bot\|--all\|--group <group>> [player] [behind\|front\|side]` | Bodyguards: bots keep close to you, or the player you name, and go after anyone who hurts them. See below. |

March, surround or protect? See [Following a player](#following-a-player).

**Marching:** behind you, the way you're walking, there's a gap (1 block), then the first row: one bot in the middle, one to its left and one to its right, shoulder to shoulder (`/fb formation width 5` makes it 5). The next row is straight behind it, and so on, so 7 bots make two full rows and one in the middle of a third. In a straight line the rows stay tight; when you turn, they swing round to their new places. Sprinting, the back rows trail a little (a bot can't go faster than you) and close up when you stop.

**Where they look:** marching bots look at you. Add `straight` and they look straight ahead, the way they're marching (6.4.8: `straight` used to mean at you). Add `left` or `right` and they turn their heads that way and a little up, like a parade's "eyes left", while they march straight on behind you: `/fb march --all Nolan left`. With no player named, you lead: `/fb march --all right`. `formation.march.look` (`player`, `straight`, `left` or `right`) sets what they do when you don't say. Bots in a ring always look at you.

**A big march:** a crowd marches wider, so it doesn't trail off behind you in a long thin line. Once the rows would be more than twice as deep as they're wide, they widen to keep it at that: 50 bots march 5 across, 200 march 10 across, 1000 march 23 across and 44 deep. `formation.march.widen: false` keeps every march `width` across, however long that makes it.

**A set length:** `/fb formation length 4` makes every march 4 rows long, as wide as it needs to be for its bots: 20 bots march 5 across, 40 march 10 across. Width and widening don't apply while a length is set. `/fb formation length 0`, or setting a width, goes back to the width.

#### The formation screen

`/fb formation` opens a screen that shows **how a march lines up**. Your head is at the top, walking up the screen, and the heads below stand where marching bots would: the front row first, the middle of each row first, then out to the left and right. Your spawned bots' own heads are used first, and plain heads fill in the rest.

- **How many across:** click the sign and type a number (1 to 64) on it. The heads move to match.
- **How many rows:** click the other sign and type how many rows long the march should be. It's then as wide as it needs to be. `0` goes back to the width.
- **Wider for crowds:** the switch for `formation.march.widen`.
- **Bots in this picture:** left-click for one more, right-click for one fewer, shift for ten at a time. It only changes the picture, so you can see how 50 or 500 bots would line up. It starts at the number of bots you have.
- **Back to the default:** 3 across, wider for crowds, no set length.

The middle 9 columns and the first 4 rows fit on the screen; the info item says how wide and deep the whole march is. Everything is saved in `config.yml` the moment you set it, and marches already going change at once. On 1.21.7 and newer you type the number in a dialog box. On older versions a sign goes up just over your head while you type, nobody else sees it, and the block goes back as it was afterwards; if there's no room for it, step somewhere with open space above you.

**If you fly or jump:** the rows stay on the ground under you and follow from there.

**Surrounding:** an evenly spaced ring round you that follows you. With the radius left at `0`, the ring grows with the number of bots: 7 bots make a 2-block ring, 20 about 3 blocks.

- Bots get to their places the way they walk anywhere else: round trees and walls, up and down steps. Two bots squeezing through the same gap take turns. A place that falls inside a tree or a wall is swapped for a spot behind you.
- **Bots always walk to their place (6.4.8)**, however far behind they've fallen: on a laggy server, half a march used to teleport to a leader who'd got ahead. One whose place is in another world waits where it is. To have far-off bots brought there instead, set `formation.teleport-distance` to a number (16 or more): further than that from its place, a bot is moved, only ever onto open ground it can stand on.
- It's a job, like roaming: a busy bot has to be stopped first (unless `orders.must-stop-first` is off). Bots already marching or surrounding can be switched straight to another formation, player or direction. A bot that's hit fights back, then takes its place again. If the player leaves, the bots wait where they are.
- **They never fight back against the player they follow.** Turn round and hit your own marchers: they take it, and stay in line. Anyone else who hits them still gets a fight. `formation.ignore-leader: false` turns this off.

| Setting | Default | What it does |
|---|---|---|
| `formation.march.width` | `3` | Bots side by side in each row (1 to 64). `/fb formation width <number>` changes it in game. |
| `formation.march.widen` | `true` | A crowd marches wider than `width`: about half as wide as it is deep. `false`: always `width` across. |
| `formation.march.rows` | `0` | A march this many rows long (1 to 64), as wide as it needs to be. `0`: off, `width` decides. `/fb formation length <number>` changes it in game. |
| `formation.march.gap` | `1` | Empty blocks between you and the first row. |
| `formation.march.side-gap` | `0` | Empty blocks between bots in a row. `0` is shoulder to shoulder. |
| `formation.march.row-gap` | `0` | Empty blocks between one row and the next. |
| `formation.march.look` | `player` | Where marchers look when you don't say: `player` (at you), `straight` (straight ahead), `left` or `right`. On a route or to a point, with nobody leading, `player` is straight ahead. |
| `formation.march.look-angle` | `45` | Marching `left` or `right`: how far they turn their heads, in degrees (0 to 120). |
| `formation.march.look-up` | `10` | Marching `left` or `right`: how far up they look, in degrees (-45 to 45). |
| `formation.surround.radius` | `0` | `0`: the ring grows with the number of bots. Or a fixed radius, in blocks. |
| `formation.surround.spacing` | `1.0` | Blocks from one bot to the next round the ring (radius `0`). |
| `formation.surround.min-radius` | `2.0` | The smallest the ring gets (radius `0`). |
| `formation.teleport-distance` | `0` | `0`: bots always walk to their place (6.4.8). A number (16 or more): further than this from its place, a bot is brought there. On a march, this plus the place's own distance from you. Servers still on the old 48 are moved to 0. |
| `formation.ignore-leader` | `true` | Marching, surrounding or protecting bots never fight back against the player they follow. |

### Holding a spot

`/fb march --all here` puts the bots in rows **where you stand, facing the way you face, and they stay there**. You can walk or fly off and film them. The front row is the spot you stood on. `/fb surround --all here` is a ring round the spot instead, everyone looking in.

- **How wide:** `/fb formation width 10` makes every march 10 across (1 to 64; 3 at first). It's saved in the config as `formation.march.width`, so it stays after a restart, and marches already going change straight away. A big crowd still widens past it so it isn't a long thin line; `formation.march.widen: false` stops that. `/fb formation` opens [the formation screen](#the-formation-screen) to see it and change it there.
- **Where they look:** holding a spot, they face the way you faced. Add `left` or `right` for "eyes left" or "eyes right", or use [`/fb look`](#facing-a-direction) afterwards to point them anywhere.
- **Spacing:** add `spacing <blocks>` on the end for that many blocks of gap between bots, sideways and row to row: `/fb march --all here spacing 2`. `spacing 0` is shoulder to shoulder; up to 16. It works on `/fb surround` too, and a saved scene keeps it. Without it, spacing comes from `formation.march.*`: `side-gap` between bots side by side, `row-gap` between one row and the next.
- Everything else works as it does for marching: bots walk to their places, a bot that's hit fights back and then takes its place again, and `/fb stop` ends it.

### Marching a route

`/fb march --all --route parade` (6.4.7) marches the bots in rows **along a route**, the same routes roaming and patrolling use (`/fb pointtool parade` makes one by walking it). Nobody leads: the front of the march walks the route itself, **point to point in straight lines**, at a steady marching pace.

- **Corners:** each row turns where the front turned, the way a real column goes round a corner, instead of the whole block swinging round like a gate.
- **Keeping together:** when the back rows fall behind (a tree, a crowd), the front waits for them. A few stuck bots don't hold the march up for long: after a few seconds it goes on at half pace.
- **At the end:** `stop` (the default) holds there, facing the way it came; `loop` goes round again from the first point; `back` turns round and marches back.
- **Where they look:** the way their own row is going. `left` or `right` on the end for eyes left or eyes right: `/fb march --group army --route parade loop left`.
- `spacing <blocks>` and `/fb formation width` work as for any march, and `--points` is the same as `--route`. `/fb stop` ends it.
- The route's points can be at any height: the march follows the ground between them.

### Points: walking and marching somewhere

A **point** (6.4.8) is one named place: the gate, the camp, where the survivors meet. A route is a line of points to walk along; a point is just somewhere to go.

| Command | What it does |
|---|---|
| `/fb point <name>` | Puts a point where you stand, facing the way you face. Run it again somewhere else to move it. |
| `/fb point tool <name>` | The point tool for one point: right-click with the emerald where it goes, and that's it. Your hotbar comes back. |
| `/fb point` | Every point. |
| `/fb point tp <name>` | Takes you there. |
| `/fb point rename <name> <new>` / `/fb point delete <name>` | |
| `/fb walk <bots> <point\|player\|here\|x y z>` | The bots walk there and stand about round it. |
| `/fb march <bots> --point <point>` | The bots march there in rows, and hold. |

**Walking there** (`/fb walk --all camp`): each bot walks its own way, at a walking pace, to a spot of its own round the point, so they end up standing about loosely, close but not touching, the way people gather after a fight. The ones nearest go in the middle. They don't all set off on the same tick. When they get there they turn to the middle, then stand about like any bot with nothing to do. A bot that can't get to its own spot (someone's on it, a wall's in the way) stops as near as it can. In a test, 12 bots all got there and stood within about 5 blocks of the point. `--stop` (or `/fb stop`) stops them. It takes a player (`/fb walk --all Nolan`), `here`, `--bot <bot>` or `x y z` too.

**Marching there** (`/fb march --group army --point camp`): rows form up where the bots are, then march to the point round anything a way can be found round, and hold there. `straight`, `left` or `right` on the end set where they look, and `spacing` and `/fb formation width` work as for any march.

The formation shapes from before 6.3.0 (`/fb formation --all wedge`, `square here`, `rows 20 10` and the rest) are gone, to keep it simple. Typing one now tells you what to use instead: a march, a surround, `march … here`, or `formation width`.

### Charge

`/fb charge --all` sends an army in. The bots drop what they're doing (marching behind you, holding a formation, standing about) and attack **everyone within 32 blocks of them**, each going for whoever is nearest to it.

- They never attack you, the player they were following, or one another.
- Give a radius, 4 to 128 blocks: `/fb charge --group army 64`.
- Add `players` or `bots` to attack only those: `/fb charge --all 48 players`. The default is `everyone`.
- If nobody is in range, nothing happens and the bots keep their formation.
- `/fb stop` ends it.

A typical scene: `/fb formation width 10`, `/fb march --group army`, walk the army where you want it, then `/fb charge --group army`.

### Recording and replaying

`/fb record <name>` **copies you exactly**: where you are, which way you look, crouching, sprinting and every swing of your arm, 20 times a second. Walk, run, turn, look round, then `/fb record stop` (or run `/fb record <name>` again). A red dot and a timer over your hotbar show it's recording.

`/fb replay <bot|--all|--group <group>> <name>` has bots **act it out**, the same way on every take. It reads as a person moving, not as something walking between points: use a recording for the shot, and a route for a patrol.

| You type | They do |
|---|---|
| `/fb replay Bob ambush` | Bob goes to where the recording starts and does exactly what you did, in the same place. |
| `/fb replay --group crowd ambush here` | Each bot does it **from where it stands**: the same moves, shifted to its own spot. Good for a crowd all doing one thing. |
| `/fb replay Bob ambush loop` | Over and over, until `/fb stop`. `here` and `loop` go together too. |
| `/fb replay Bob --stop` | Stops it. `/fb stop` does too. |
| `/fb record list` / `/fb record delete <name>` | The recordings you have, and deleting one. |

- A bot replaying walks its marks the way it walks anywhere, so blocks in the way stop it, and players can push it. One that falls too far behind is put straight back on its mark.
- A bot acting a recording out doesn't fight back when it's hit (`recording.fight-back: false`), so it stays on script. With `true` it fights back, then goes back to where it was in the recording.
- **At the end (6.4.4),** a bot walks back to where the recording starts, ready for the next take, and looks the way it did at the start. That's `recording.at-end: walk-back`. `teleport-back` puts it there at once, and `stay` leaves it where the recording ends, as before 6.4.4. A bot that can't walk back within 30 seconds is put there. A loop starts its next go from the start too.
- Recordings are kept in `plugins/FightBot/recordings/`, one file each, up to `recording.max-seconds` long (10 minutes). Changing world stops a recording, and so does leaving.

### Saved scenes

`/fb scene save <name>` writes down **every bot**, or `--group <group>` for just the bots in one or more groups: where each stands and faces, its gear, skin, health, settings and group, and what it's doing, such as a formation, a route, a replay or where it's looking. Fights aren't kept, because a scene is how things stand before the action starts.

`/fb scene load <name>` brings the scene back between takes. Bots of the scene still in the game are left as they are; the rest come back where they were and carry on with what they were doing.

| Command | What it does |
|---|---|
| `/fb scene save <name>` | Saves every bot as a scene. Saving under the same name again replaces it. |
| `/fb scene save <name> --group <group> [--group <group>…]` | Saves only those groups' bots. |
| `/fb scene load <name>` | Brings back the scene's bots that aren't in the game. |
| `/fb scene remove <name>` | Takes the scene's bots out of the game. The scene stays saved. |
| `/fb scene delete <name>` | Deletes the scene. Its bots stay. |
| `/fb scene list` | The scenes you have. |

Scenes are kept in `plugins/FightBot/scenes/`. Before 6.4.4 a scene saved the bots within a radius of you; that's gone, along with `scenes.radius`, since it was easy to leave someone out. A radius typed by an older script still works.

### Controlling a bot

`/fb control <bot>` lets you **play as a bot**, the way ControlPlayer lets you play as another player. `/fb control --stop` hands it back (`stop` without the dashes works too), and so does `/fb stop` while you're controlling one (`control.stop-hands-back`; typed again, it stops every bot).

- **Even mid-fight.** Take over a bot that's fighting and the fight goes on: whoever it was fighting keeps at it, against you now. Hand it back and the bot carries on the fight itself.

- **Nobody can see you.** You're hidden from everyone, nothing can hurt you, and mobs and bots leave you alone. You don't see the bot either: you're inside it.
- **You go by its name.** What you type in chat comes from the bot, and your own tab list shows you under the bot's name. If chat still shows your own name, a chat plugin or your proxy is sending it before FightBot sees it.
- **You carry its gear, and wear its skin.** Its armour, weapon and everything it carries are in your inventory, and you have its health and hunger. In third person (F5) and in your inventory screen you look like the bot (Paper and Purpur; on Spigot you still see your own skin there, but everyone else sees the bot either way). Your own things and your own skin come back when you hand it back.
- **It does everything you do**, 20 times a second: where you go and look, crouching, sprinting and every swing. It wears and holds what you do.
- **Your hits are its hits.** Whoever you hit is hit by the bot, so a bot you hit fights back against it, and kills go to the bot. Arrows you shoot are its arrows too. What you type in chat, the bot says. Commands stay yours.
- **Your voice comes out of the bot (6.4.4).** With Simple Voice Chat, players near the bot hear what you say from the bot, not from where you're hidden, and whispering stays a whisper. In a voice chat group you're heard by your group as normal. `control.voice: false` turns it off.
- **What happens to it happens to you.** When it's hit, you lose the health, your screen jolts, and you're knocked back just as far as a player would be. Its armour wears down and its totems go off in your hands.
- **When it ends**, the gear goes back to the bot as it is by then, used up or worn down, and you get your own things, health, hunger and game mode back. You're put back where you were when you took it over (`control.go-back: false` leaves you where the bot is). It ends if the bot dies or is removed, or if you leave. Your own things are written to `plugins/FightBot/control/` first, so they come back the next time you join even if the server stops while you're controlling a bot.
- A bot being controlled doesn't fight back or do anything by itself, and orders for it are turned down until you hand it back. Its gear screen stays shut meanwhile.
- It needs the `fightbot.control` permission (ops have it).

### Protecting a player

`/fb protect --all Nolan` turns bots into bodyguards. They keep their places round the player the way marchers do, and **when anyone hurts that player, every bodyguard goes after them**. Leave out the player and they protect you.

- **Where they stand:** `behind` (the default, rows like a march), `front` (rows ahead, so they meet trouble first) or `side` (a line down each side): `/fb protect --group guards Nolan side`.
- **Where they look:** the way the player looks, watching the road. `formation.protect.look: leader` has them look at the player instead.
- **What sets them off:** a hit, an arrow or anything else from a player or a bot. Falling, fire and the like set off nothing, since there's no one to go after. Someone in the player's own group is left alone (with `groups.friendly-fire` off), so is anyone in creative or spectator, and so is one of the bodyguards catching the player by accident.
- **Afterwards:** once the attacker is dead, gone, or has left the player and the bodyguards alone for `formation.protect.forget-after` seconds, they go back to their places.
- If the player dies, the bodyguards come to them again when they respawn. If the player logs off, it ends, and whoever gave the order is told. `/fb stop` ends it too.

| Setting | Default | What it does |
|---|---|---|
| `formation.protect.mode` | `behind` | `behind`, `front` or `side`, when the command doesn't say. |
| `formation.protect.width` | `3` | Bots side by side in each row (1 to 9). |
| `formation.protect.gap` | `1` | Empty blocks between the player and the first row. |
| `formation.protect.look` | `outward` | `outward`: they look where the player looks. `leader`: they look at the player. |
| `formation.protect.retaliate` | `true` | `false`: they only stand guard. |
| `formation.protect.forget-after` | `10` | Seconds without a hit before they let the attacker go. |

### Bots that join by themselves

Off by default, so `/fb spawn` works exactly as before. Turn it on with `joining.enabled: true` and `/fb reload`. Every so often a bot joins the server the way a player does ("X joined the game"), at the world spawn or a spot you choose, and gets on with what it came for:

- **`hunt`** (the default): it goes after a player (the nearest, or a random one) and fights them.
- **`point`**: it walks to a point you set.
- **`both`**: it walks to the point, then goes after a player.

If a player hits it on its way to the point, it fights back and then carries on (`fight`), takes no notice (`ignore`), or runs from them (`run`). Once it's reached its point or got the player it went after, it wanders about there (`wander`), logs off like a player (`leave`), or goes after a player again until it dies (`hunt`). It joins facing where it's headed and looks the way it walks.

| Command | What it does |
|---|---|
| `/fb join <number>` | Sends that many bots in now (1 to 20). Where they join and what they do comes from the joining settings. Command blocks can use it too. |

| Setting | Default | What it does |
|---|---|---|
| `joining.enabled` | `false` | Turns it all on. Off, `/fb join` says so and nothing joins. |
| `joining.on-their-own` | `true` | Bots join by themselves at random times. `false`: only `/fb join` sends them in. |
| `joining.at` | `spawn` | Where they join: `spawn` (the main world's spawn), or `"x y z world"`. |
| `joining.spread` | `4` | How far round that spot they appear, in blocks. |
| `joining.every-min-seconds` / `every-max-seconds` | `30` / `120` | A bot joins after a random wait between these. |
| `joining.max-bots` | `10` | The most joined bots in the game at once. Bots you spawn don't count. |
| `joining.min-players` | `1` | Bots only join while at least this many real players are online. |
| `joining.group` | `""` | A group they're put in as they join (made if it isn't there). |
| `joining.save` | `0` | A save (1 to 7) to join wearing, gear and settings. `0`: the usual gear. |
| `joining.objective` | `hunt` | `hunt`, `point` or `both`. |
| `joining.point` | `""` | The point for `point` and `both`: `"x y z world"` or `spawn`. Not set, they hunt instead. |
| `joining.hunt` | `nearest` | Who they go after: `nearest` or `random`. Only players in survival or adventure, never bots, and never someone in the bot's own group. |
| `joining.when-attacked` | `fight` | Hit on the way to the point: `fight`, `ignore` or `run`. |
| `joining.afterwards` | `wander` | Once done: `wander`, `leave` or `hunt`. |

- Bots that joined by themselves don't come back after a server restart. New ones join instead, like players logging in.
- `/fb stop` on a joined bot ends what it came for, and it stands where it is.

### The Player Cannon

The **Player Cannon** (6.4.8) brings bots in round you by ender pearl, like a group of players arriving.

1. `/fb cannon` opens a small screen. Pick **who comes**:
   - **New bots** (how many, and their gear: a sword or mace loadout each, one ready-made loadout, or one of your kits, and a group to join)
   - **A group** of yours
   - **Bots not in a group**
   - **Every bot**
2. Pick **what they do when they land**:
   - **Fight for you**: go for whoever you've been fighting, then guard you
   - **Fight everyone near**: everyone round you but you
   - **Fight you**
   - **Just stand**
3. Click **Take a Player Cannon**. It's a fishing rod named "Player Cannon". It carries what you picked, so different rods can bring different bots.
4. Right-click it. The bots throw real ender pearls from about 35 blocks away (`cannon.from-distance`), high up over whatever is in between. You see the pearls go up a way off and come down in a ring round you about 4 seconds later (`cannon.spread`), and the game takes each bot to where its pearl lands, the usual pearl damage and all.

- **It looks like players arriving.** The rod is a plain fishing rod with a name, as if someone renamed it in an anvil. It has one use and breaks like any rod. Nothing is said in chat, and no sound plays that a pearl wouldn't make.
- **Bots of yours** that are far off, or have no open sky to throw through, are moved to somewhere 30-odd blocks away first and throw from there. Ones close enough throw from where they are. A bot that was already fighting keeps fighting the same one after it lands.
- **Under a roof** there's no way for a pearl to come down, so the bots are simply there.
- **Who can use it:** anyone holding one (`fightbot.cannon.use`, everyone by default). Taking them from `/fb cannon` needs `fightbot.cannon` (ops). Someone without `fightbot.cannon.use` just has a fishing rod. `/fb cannon give <player> [how many] [protect|charge|attack|stand]` hands one out from the console.
- Scripted Solutions is getting a Player Cannon of its own, with teams of players and bots. This one may go once that's out. `cannon.enabled: false` turns it off.

| Setting | Default | What it does |
|---|---|---|
| `cannon.enabled` | `true` | `false`: rods do nothing, and `/fb cannon` says it's off. |
| `cannon.bots` | `5` | New bots a rod brings, as the screen starts. |
| `cannon.max-bots` | `30` | The most one rod can bring. |
| `cannon.gear` | `random` | `random` (a sword or mace loadout each, never crystals or TNT carts, which would blow up round you), a ready-made loadout's name, or a kit number. |
| `cannon.on-landing` | `protect` | `protect`, `charge`, `attack` or `stand`. |
| `cannon.from-distance` | `35` | How far off they throw from, in blocks (16 to 45). |
| `cannon.spread` | `4` | How far round you they land, in blocks (2 to 16). |

### Spawning somewhere else

Add `--location` to the end of a spawn command. It works the way `/tp` does:

| You type | Where the bot goes |
|---|---|
| `--location 100 64 -20` | Exactly there. A whole number puts it in the middle of the block, so this is 100.5 64 -19.5. |
| `--location ~ ~ ~5` | Where you are, 5 blocks further along z. `~` on its own means "the same as mine", and `~-2` means 2 less. |
| `--location ^ ^ ^3` | 3 blocks straight ahead of where you're looking. The three numbers are left, up and forward. |
| `--location 0 70 0 world_nether` | In another world. |
| `--location ~ ~ ~ 90 0` | Facing a direction: yaw, then pitch, like `/tp`. `~` keeps your own. |

The world, yaw and pitch are optional. `--location` always goes last, for example `/fb spawn 10 --location ~ ~ ~10` or `/fb save 2 --random 5 --location 0 64 0`. From the console, use plain numbers, or `~` counts from the main world's spawn.

### Command blocks

Command blocks and command minecarts can run FightBot commands, `/fb spawn` included (menus need a player). `~` counts from the command block itself.

To keep a server safe, FightBot stops a command block when it:

- spawns more than 200 bots within 20 ticks (one second), or
- would have more than 200 of its bots in the game at once.

A stopped command block can't spawn bots again until `/fb reload`. Ops are told which one it was and where it is.

### Quick actions

`/fb quick` (6.4.4) opens a screen of **commands you've saved, one click each**, so you don't have to type them out again. It's also on the bottom row of `/fb settings`.

An action is a name, an icon and up to 9 commands, run one after another. **Click one to run it.** Its commands run as whoever clicks it, with that person's own permissions, so an action can't do anything they couldn't type themselves.

A new server comes with five, to show how it works: ten mace bots, red against blue (two groups of five and a group fight), march behind me, stop every bot, and remove every bot. Change them or delete them as you like.

**Making one** (needs `fightbot.quick.edit`, which ops have):

1. Hold the item you want as its icon and click **Add an action**.
2. Click **Add a command** and type it, without the `/`. Or run the FightBot command first, then click **Add your last command** to save it without typing.
3. **Rename it** and **Run it now** to try it.

On an action's screen, click a command to change it, or right-click to take it out. **Change its icon** takes the item in your hand. **Delete this action** needs a shift-click. In the list, right-click an action to change it.

- `{player}` in a command becomes whoever clicks: `fb march --all {player}`.
- A line `wait 20` waits 20 ticks (a second) before the next command, for bots to finish spawning before they're grouped, say.
- `/fb quick run <name>` (or its number) runs one from the console or a command block, and `/fb quick list` lists them.
- They're kept in `plugins/FightBot/quick-actions.yml`, up to 45 of them.

## Fighting

| Command | What it does |
|---|---|
| `/fb fight <bot> <player...>` | One bot goes after one or more players. |
| `/fb fight <bot> --bot <bot>` | One bot goes after another bot. |
| `/fb fight <bot> --group <group>` | One bot goes after a whole group, bots and players. |
| `/fb fight --all <player\|--bot <bot>\|--group <group>>` | Every bot goes after them. |
| `/fb fight --group <group> <player\|--bot <bot>>` | A whole group goes after them. |
| `/fb fight --group <group> --group <group>` | Two groups fight each other, as one-on-one duels. |
| `/fb hunt <bot\|--all\|--group <group>> [player]` | Bots hunt a player down, knowing only which way they are. No name: whoever is nearest. See [Hunting](#hunting). |

Who's fought is said the same way as who fights: **a player by name, a bot after `--bot`, a group after `--group`.** You can name several: `/fb fight Bot1 Steve --bot Bot2`. When you press Tab, only real players are offered as plain names, bots after `--bot` and groups after `--group`, so the list isn't full of bots. `orders.bots-in-player-names: true` offers bots with the players as well, the way it was before 6.4.0.

The older ways still work, so scripts don't need changing: a bot's name where a player goes (`/fb fight Bot1 Bot2`), and `/fb fight --group red blue` for group against group.

| Command | What it does |
|---|---|
| `/fb stop` (or `/fb stop --all`) | Every bot stops, whether it's fighting, roaming, patrolling or hunting. While you're controlling a bot, it hands that bot back first. |
| `/fb stop <bot>` | One bot stops, whatever it's doing. |
| `/fb stop --group <group>` | Everyone in a group stops. |

`/fb fight`, a group fight, a charge, bodyguards or a patrol? See [Starting a fight](#starting-a-fight).

### Hunting

`/fb hunt <bot|--all|--group <group>> [player]` sends bots to **hunt a player down**, the way a player would with the locator bar: they know **which way** the player is, not where. Leave out the player and each bot hunts **whoever is nearest** in its world.

- A hunting bot runs a stretch the way its prey is, then looks again, every few seconds. Once it **sees them** (within 24 blocks, nothing in the way) it fights them as usual.
- **After a kill it goes on hunting:** the same player once they're back, or whoever is nearest now. It goes back to tracking anyone who gets more than 48 blocks away mid-fight.
- **Who it can't track:** anyone in another world, in creative or spectator, hidden from it by a vanish plugin, in its own group, or with the `fightbot.hunt.exempt` permission. And, as on the locator bar, anyone **invisible, crouching or wearing a carved pumpkin or a mob head**. It waits where it is until there's someone it can track.
- `/fb hunt <bots> --stop` or `/fb stop` ends it.
- Players can hunt the bots too: turn `performance.locator-bar` on (or **On the locator bar** for one bot in its menu) and bots show on players' locator bars (1.21.6+).

### How bots swing

Bots fight like a person, not a machine:

- **A moment to react.** Someone stepping into reach gets hit after a few ticks, not the very tick they arrive (`combat.reaction.min-ticks` and `max-ticks`).
- **Not like clockwork.** Swings come a little early or late (`combat.swing-jitter-ticks`), and now and then one misses, mostly at the edge of reach (`combat.miss-chance`).
- **Real critical hits only.** A bot jumps and swings on the way down, and the game decides if it's a crit. It never crits walking along, and its reach is a player's, whatever weapon you hold.
- **A charged swing.** It waits for its weapon to charge up (the attack bar a player sees) before it swings, and times its crit jumps to come down just as it fills (`combat.wait-for-charge`). That matters most for slow weapons: a half-charged axe hit does far less.
- **Hit them straight away.** A bot can be hit the moment it joins, teleports, pearls or changes world, like a player.
- **A turn, not a snap (6.4.7).** Its aim is as quick and sure as ever, but its head turns over a tick or two instead of jumping right round in one frame, and it doesn't swing at someone more than 70 degrees off to its side. `head-movement.natural: true` is slower and more human still.
- **One at a time (6.4.7).** With several on it, it keeps at the one it's fighting, the way a person does, and moves on when that one's out of reach and someone else is close. It used to turn to whoever was nearest that moment, and in a crowd its head never stopped swinging.
- **Getting its breath back (6.4.7).** Low on health, it backs off away from everyone fighting it - not just the nearest - and keeps going that way. Running to heal, it turns and runs, looking where it's going with a glance back now and then. Surrounded on every side, it stands its ground and eats where it stands.

### Ender pearls

Bots throw pearls to chase someone who runs, to get out of a pit, and to get away: low on health, or from a mace coming down.

- **How far they pearl away** (`combat.pearl-away-distance`): `0` (the default) is a full-strength throw, the way it always was. Low on health that can fly 30 blocks or more, and over an arena's wall. A number (4 to 35) makes a bot aim for ground about that many blocks off, away from whoever it's fighting, and never over a wall to get there. `8` keeps it in most arenas. It sets the pearl away from a mace too (normally about 10 blocks).
- **Never through a wall.** A pearl that hits a wall used to put the bot right where it hit, half inside the wall, and on a wall one block thick it could come out on the far side, out of an arena. Its landing is now moved back out of the wall, the way the pearl came. With no room to stand there, the bot stays where it was. This is always on.
- `combat.use-pearls: false` turns pearls off, and `combat.pearl-cooldown-seconds` is the least time between throws.

### Moving like a player

- **Sprint-jumping** (`movement.sprint-jump`): when the player it's fighting or hunting is 12 blocks or more away on open ground, or is running from it, a bot sprint-jumps like a player, which is faster than running. Coming in on someone, it may jump once at the end to come down on them. Otherwise it runs (6.4.6: before, it hopped from 4 blocks out whatever you did). Marching, guarding and roaming bots never sprint-jump. Coming down from a jump, it lands critical hits.
- **Steps (6.4.6):** a bot goes by each block's real height, like the game does for a player. Anything a player steps up without jumping (a dirt path next to grass, a slab, a stair, a thin layer of snow) it walks up; a full block it jumps; anything taller is a wall. So bots marching along a path don't hop up and down any more.
- **Gaps** (`movement.jump-gaps`): it jumps gaps up to 3 blocks wide, onto the same level or one block up, instead of placing blocks.
- **A single missing block** in otherwise solid ground is walked round, not jumped. Trenches across its path are still jumped.
- **Ledges:** a bot won't walk off a drop of 3 blocks or more unless its target is below it. In a fight, with its target level with it or higher on the far side of a dip, it waits about a second and a half for a way round, then hops down if the fall won't cost it much (4 blocks or less, or deeper while it would still have 5 hearts left), and comes up the other side. It never drops onto lava, fire, magma or cactus.
- **Holes:** a bot that falls into a hole it can't jump out of, with no way worked out to its target, places a block or two under itself and climbs out (Pillaring must be on). With pearls, it may pearl out instead.
- **Wider gaps** (`movement.gap-blocks`): chasing someone (or on a route that allows building), a bot crosses gaps of 4 to 12 blocks by placing blocks. Over 4, it sprint-jumps and puts a block down at the far end mid-jump to land on. Like a player, now and then it misses. On anything wider, it bridges out one block at a time until 3 are left, then jumps the rest. A bot roaming with no target never places blocks over gaps.
- **Deadly drops (6.4.5):** a bot never steps, drifts or is pushed off an edge where the fall would kill it: the void, 24 blocks or more, or more than its health can take. Bots shoving each other in a crowd, a jump for a critical hit and flowing water all stop at the edge. A gap over a deadly drop is never jumped, however short: with bridging on it's bridged all the way across, crouched; otherwise the bot goes round. Ten bots can bridge side by side over the End void.
- **Sprinting (6.4.5):** a bot running at full speed sprints, as a player holding the sprint key does, so its first hit carries sprint knockback. It lets go to block, eat, heal, shoot, jump for a crit, swim, bridge or pillar, when it's hungry, and for a moment after each swing.
- **Standing about:** bots with nothing to do only shove each other when they're actually touching (6.4.5), so a row of bots stays a row.
- **Only forward is a sprint (6.4.7).** Backing off, stepping sideways, or looking one way and going another, a bot walks, as a player has to. Eating slows it right down, as it does a player.
- **Looking where it's going (6.4.7):** after someone a long way off, going round something on the way, it looks where it's walking, not at them through the hill.
- **A long way off (6.4.7):** a bot after someone more than 40 blocks away works out as much of the way as it can and looks again from there, so a crowd follows a narrow path or a bridge across the void. Before, it walked straight at them and stopped at the edge.
- **Turning to aim (6.4.8):** a bot turns its head to someone at a quick player's pace: right round in about a third of a second, never in one frame. It won't hit someone more than 55° to its side. `head-movement.natural: true` is slower and more human still.
- **Digging through (6.4.8):** a bot with a pickaxe that has no way to walk to its target digs one, as a player would: a hole two blocks high through the wall, then through it. See [Building](#building).

### Mace

Mace combat is **on by default** from 6.0.0 (`mace.enabled`). A config from before 6.0.0 is switched on once, when it updates; turn it off after that and it stays off. One bot can be changed with **Mace** in its settings menu. The bot uses the game's own mace, wind charges, elytra and fireworks, so damage, Density, Breach and Wind Burst all work as they do for you.

- **Wind jump** (mace + wind charges): close in, it throws a wind charge at its feet, flies up and smashes you on the way down. With Wind Burst it can bounce up and smash again (`mace.wind-chain-max`).
- **Elytra dive** (mace + elytra + firework rockets; the elytra can be worn or anywhere in its inventory): from further away (up to 72 blocks), it takes off, climbs and flies over you, swaps the elytra for its chestplate and drops onto you from about `mace.dive-height` blocks. It aims for where you'll be when it gets there, not where you were.
- **Elytra combo** (the dive, with a **Wind Burst** mace): the first hit is the full flight - up, round and down. After every smash that lands, Wind Burst throws it up; at the top it puts the elytra on and fires a rocket **straight back down** at you, swapping to its chestplate at the last moment to smash again. That repeats until one misses. After a miss, it does the full flight again, until the rockets run out. `mace.elytra-combo: false` turns this off.
- **Pearl launch** (mace + ender pearls + wind charges): from further off than a wind jump (about 7 to 22 blocks), it throws a pearl that lands right next to you, then wind-jumps from there and smashes down. Nothing but the game's own moves: the pearl takes it where it lands, like yours does. Turn it off with `mace.pearl-launch: false`.
- **After a miss** with no rockets left, it saves itself the way you would: a wind charge just before it lands, a water bucket, or the elytra again.
- **Against you** (`combat.mace-defence`, on by default): when you come down on a bot with a mace (a wind jump, a dive, a pearl in), it does something about it, but not every time, like a person. It gets its shield up in time, gets out from under you and stays clear until you land (then comes for you), or pearls away. Getting out of the way, it either turns and runs, or, with time to spare, steps aside watching you - one way, kept to (6.4.7). Now and then it doesn't react at all. It sees a mace on your hotbar too, so swapping to it at the last moment doesn't hide it.
- **How hard they try** (`combat.mace-dodge`, `100`): above 100 a bot sees a dive coming from further off to the side, reacts sooner, all but never just stands there, and runs further clear; below 100, the other way (0 to 400). The shield is left as it is: `combat.shield-use` is still how often it blocks. Each dive is decided on its own, so a string of smashes gets a reaction every time, and a bot that's in the air when it sees one decides the moment it lands. Getting out of the way works best against a wind-charge jump, which can hardly steer once it's in the air. FightBot's own elytra divers aim where you're going to be, so against them the shield (or `combat.mace-shield-swap`) is what really stops the hit.
- **Totem in the offhand** (`combat.mace-shield-swap`, off by default): a bot holding a totem can't hold a shield. With this on, a bot that has a shield in its pack swaps it into its offhand when you dive at it with a mace, blocks, and puts the totem back once you've landed. While the shield is out the totem can't save it, which is why it's off unless you turn it on.
- **While you're in the air:** bots near you watch you all the way down. Bots further off (more than 8 blocks) look across at you and glance up now and then, each in its own time, instead of a whole army tipping its heads back at once. A jump, wind charge or mace leap doesn't count as "out of reach" either: bots wait for you to come down instead of pearling and building up after you.

`mace.wind-jump`, `mace.elytra`, `mace.elytra-combo` and `mace.pearl-launch` turn each move off, and `mace.cooldown-seconds` is the least time between mace attacks. `mace.how-often` sets how keen bots are on these moves: `100` is normal, `50` half as often, `200` twice as often (10 to 400). Normal pearl throws go by `combat.pearl-cooldown-seconds` instead.

### Cart PvP

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
- `cart.enabled` turns it off, `cart.cooldown` (`3`) is the least time between carts in seconds, and **Cart PvP** in a bot's settings switches it for one bot.

### Crystal PvP

Give a bot **end crystals** and **obsidian** (it uses obsidian or bedrock that's already there too). Within `crystal.range` (5 blocks) of its target, it fights the way a crystal player does:

- It puts obsidian down beside its target, places a crystal on top and hits it. Then the next one, several times a second.
- Everything is the game's own: real placements, real hits and the game's real explosion, so armour, Blast Protection and totems all count.
- Before each crystal it works out, the way the game does, how hard the blast would hit its target and itself: how far, and how much of each body the blast can see, after armour and enchantments. It picks the spot that hurts its target most for the least to itself.
- It never sets one off that would kill it without a totem in its hand, or that would cost it more than `crystal.max-self-damage` health (unless that would finish its target). Low on health itself, it only takes crystals that cost it little, and eats a golden apple when it can.
- It only places a crystal where it can also hit it (a player can place further than they can hit). If two in a row can't be set off, say because its target was knocked up out of the blast, it stops placing for a second instead of filling the ground with crystals.
- Made for **fast-crystal servers**, where a crystal can be hit the moment it's placed: a place and a hit take two ticks. `crystal.per-second` (`8`) sets how fast it goes (1 to 20).
- Give it **armour and totems**. Crystals hurt both sides, and a bot with no armour won't crystal at all, as nothing it could place would be worth it.
- `crystal.enabled` turns it off, and **Crystal PvP** in a bot's settings switches it for one bot. A config from before 6.0.11 had crystals switched off while they were reworked; it's switched on once, when it updates.

### Fighting back

Bots fight back:

- **Players:** when a player hits a bot, it hits back. This works whether the bot is standing about, roaming or patrolling. It never chases players in creative or spectator.
- **Bots:** when another bot hits it **on purpose**, it hits back. A stray sword sweep meant for someone else doesn't count, so a crowd of bots stays on its target.
- **Mobs:** when a mob attacks a bot that isn't fighting anyone (a zombie, a skeleton's arrow, an endermite from a pearl), the bot turns to it and hits it until it's dead, gone, or has left the bot alone for 10 seconds. A bot holding a place in a formation swings from where it stands; a free bot steps up to the mob. Players and bots always come first: the moment it has one of those to fight, it forgets the mob. It leaves the ender dragon, wither and warden alone.

**Caught off guard** (`combat.first-hit-cap`, `50`): a bot that isn't fighting anyone, and hasn't been hit for 15 seconds, can't lose more than half its health to the hit that starts a fight, a mace smash from the sky included. So it lives to fight back. Every hit after that is normal. Set the % it may lose (1 to 100); `100` turns this off.

**How hard bots hit** (`combat.damage-percent`, `100`): a bot's hit does what the same hit from a player does: the weapon, its enchantments, a critical, Strength and the target's armour all count, exactly as for you. Bots feel strong mostly because of what they carry, such as Strength II potions and Thorns III armour in the ready-made loadouts, and because they crit often. If they're too much for your players, lower this: `75` is three quarters (10 to 200). `mace.damage-percent` does the same for mace hits only, on top of it.

**One-hit players** (`combat.one-hit-players`, empty): player names listed here are killed by any hit from a bot, whatever the weapon. A bit of fun for a server's own players. Leave it empty for normal fights.

Once that fight is over, the bot goes back to what it was doing. Turn any of them off in the config (`combat.fight-back.players`, `combat.fight-back.bots` and `combat.fight-back.mobs`), or for one bot in its settings menu. For practice dummies that just take hits, turn off `players`.

A bot does one job at a time: fighting, roaming or patrolling. To give a busy bot a new job, or to open its gear, stop it first. FightBot tells you when, and what it's busy with, for example "Rd1 is fighting Blu".

Rather have new orders just take over? Set `orders.must-stop-first: false`. Then a busy bot drops what it was doing and starts the new job. (Opening its gear still needs it stopped.)

### When a fight ends

A fight is over when there's nobody left in it, and the bot is free again straight away:

- In a group fight, a bot moves on to the next opponent until the other side is beaten.
- A target who dies, leaves the server or is removed is dropped.
- A target who goes to another world, through a portal say, gets 30 seconds to come back. After that the bot gives up on them.

### Hardcore: dead bots stay as spectators

Normally a bot that dies leaves the game. With hardcore on, it **stays in the game as a spectator where it fell**, the way a player does in a hardcore world. It's still in the tab list, so you can see who has been knocked out of an event or a video.

- **Turn it on** for every bot with `death.hardcore: true`, or for one bot with its **Hardcore** switch in `/fb settings <bot>`. It's off by default.
- **A dead bot is out for good.** It can't be given orders or fought, and other bots ignore it. It still drops its items when it dies, as usual.
- `/fb list` shows who is dead. `/fb remove <bot>` takes one out, `/fb remove --dead` takes out all the dead ones, and `/fb remove --all` removes everyone.
- Spawning a new bot with a dead bot's name replaces the dead one.
- Dead bots leave when the server stops or FightBot reloads. A bot that joined by itself still counts towards `joining.max-bots` while it spectates.

### When hits don't land

If a bot keeps swinging but can't hurt anyone, FightBot tells you why, in chat and in the console:

- **PvP is off in that world.** On 1.21.9 and newer, run `/gamerule pvp true` in that world. On older versions, set `pvp=true` in `server.properties` and restart. FightBot's message tells you which.
- **The target is in creative or spectator.**
- **Another plugin is blocking the hits**, such as a no-PvP area, spawn protection or a login plugin. FightBot names the plugin it suspects.
- **Something else**, such as a scoreboard team with friendly fire off, god mode, spawn protection, or AuthMe holding a player who hasn't logged in.

It says so once, then waits longer and longer before repeating itself, so chat doesn't fill up.

### Shields

A bot with a shield in its offhand raises it when you're close, facing it and ready to swing, or falling on it with a mace. Once you've swung, it drops the shield to hit back.

The shield works exactly like a player's:
- It only blocks from the front.
- It only blocks once it's been up for a quarter of a second.
- An axe knocks it out for 5 seconds, so axes and stun slams work on bots.

Like a person, it reacts a moment late, and now and then it misses one. While it holds the shield up, it moves slowly and can't attack.

**How often** (`combat.shield-use`, `75`): the chance, in %, that it puts the shield up between its own swings. A hit it sees coming, it blocks a little more often still. `100` blocks at every chance, `0` only against a mace. Before 6.1.0 this was fixed at 55.

It gets the shield up **in time**: about half a second before your swing is charged, since a shield takes a quarter of a second to start working. It drops it the moment its own swing is ready, and can jump for a crit with the shield still up.

### Potions

A bot splashes potions at its own feet, the way a player does (6.4.9):

- **Healing** when it's low: below `potions.health-threshold` (`80`, as a % of its health). Before 6.4.9, FightBot couldn't tell what was in a potion on Paper 1.20.5 and newer, so bots threw healing potions at full health.
- **A buff** (speed, strength, fire resistance, regeneration...) when it hasn't got that effect on already. A side starting a fight doesn't all throw on the same tick.
- **Never a harmful one** at its own feet: harming, poison, slowness, weakness and the rest.

One bot throws at most one potion every `potions.cooldown-seconds` (`2`). `potions.enabled: false`, or the bot's own **Potions** switch, stops it. The debug log says which potion a bot threw and why.

### Axe fighting

- **Your shield goes up:** after a moment, the bot gets out its axe (from anywhere in its inventory, if it isn't already holding one) and hits your shield. That knocks it out for 5 seconds.
- **Then it punishes:** its sword comes back out for fast hits while your shield is down. A bot whose weapon is an axe gets a sword out of its inventory for this, if it has one (`combat.axe.punish-with-sword`). When your shield is back, the axe goes away again.
- **Crits with an axe:** axe players crit nearly every hit, because there's time to jump while the axe charges. Bots do too (`combat.axe.crit-chance`, 0.80).
- **Its own shield knocked out:** most of the time it backs off until it's back, still facing you, and hits you if you come after it (`combat.axe.back-off`).
- `combat.use-axe-swap` (or **Shield breaking** in a bot's settings) turns shield breaking on or off.

### Spears

**Off for now:** turn it on with `spear.enabled: true` (or for one bot, with **Spear fighting** in its settings). Then a bot holding a **spear** (1.21.11 and up) fights like a spear player:

- It keeps **2 to 4 blocks** off and **jabs**, since a spear can't hit anything closer than 2 blocks. Too close, and it steps back.
- A spear never crits, so it doesn't jump for them.
- Now and then, with you a few blocks off, it **lowers the spear and charges**. The faster you're closing when the tip meets you, the harder it hits.
- The jab, the charge and **Lunge** are all the game's own, so every spear and enchantment works as it does for you.
- `spear.charge: false` turns charging off, and keeps the jabs.
- **Lunge on foot.** With **Lunge** on the spear, a bot jabs at nothing to dash in at you from just out of reach, a few blocks off. When it's losing it dashes out again. Pearls are for further than that: a pearl in, then a lunge for the last few blocks. It's the game's own Lunge, so the rules are the game's: not gliding or in water, and not when it's too hungry. `spear.lunge: false` turns it off.

**Spear charges from the elytra.** With an **elytra and firework rockets** too, and [elytra flying](#elytra-chasing-and-air-fights) switched on, a spear bot charges from the air:

- **You're on the ground:** it takes off, flies out and turns, then comes back in low and fast with the spear lowered. Then it pulls up and comes round for another pass, until its rockets run out (`elytra.max-rockets`), and lands beside you.
- **You're flying:** it goes straight at you in the air with the spear lowered.
- The damage comes from how fast it's going when the tip reaches you, so at elytra speed one hit can **pop a totem**, even through armour.
- A bot with a **mace** dives with that instead. `spear.elytra-charge: false` turns spear charges from the elytra off.

### Elytra: chasing and air fights

**Off for now:** turn it on with `elytra.enabled: true` (or for one bot, with **Elytra flying** in its settings). Then give a bot an **elytra and firework rockets** (anywhere in its inventory):

- **Someone gets far away** (more than 24 blocks): it puts the elytra on, takes off, crosses to them on rockets, and glides down to land beside them. Its chestplate goes back on, and it fights on foot.
- **Someone flies off on an elytra:** it goes after them in the air, leading where they're going, and hits them mid-flight with its weapon. A bot with a spear charges them with it. See [Spears](#spears).
- It levels off before the ground, so it lands without fall damage.
- **Won the fight in the air** (or told to stop)? It glides back down to where the fight was, circling down round the spot, and lands there with its chestplate back on, instead of drifting off. Stuck against a tree or a wall, it drops out of the glide and lands.
- A **mace** bot dives on you from the elytra instead. See [Mace](#mace). A **spear** bot makes spear runs at you. See [Spears](#spears).

| Setting | Default | What it does |
|---|---|---|
| `elytra.enabled` | `false` | Elytra flying at all. Also **Elytra flying** in a bot's settings. |
| `elytra.chase` | `true` | Flying after players who get far away. |
| `elytra.chase-distance` | `24` | How far off someone has to be before it flies (12 to 200). |
| `elytra.air-fights` | `true` | Chasing and hitting players who are flying. |
| `elytra.max-rockets` | `8` | Rockets it may use on one flight. |

### Bows and crossbows

Give a bot a **bow or crossbow and some arrows** (anywhere in its inventory). It shoots at players it can't hit with its weapon: further off than 8 blocks, or somewhere it can't walk to.

- It **draws**, then **aims ahead** of someone running and **high enough** for the arrow's drop, and lets go. The game does the shot, so Power, Punch, Flame, Infinity, Piercing, Multishot, Quick Charge and tipped or spectral arrows all work.
- A **crossbow** loads first, then fires when it has a clear shot. It keeps a loaded crossbow loaded for next time.
- It moves slowly while it draws, like you. When you come close, its weapon comes back out.
- Its aim isn't perfect: it misjudges your speed a little and its hand isn't quite steady (`ranged.aim-error`).
- Arrows it walks over go back in its inventory.
- A bot carrying a [cart PvP](#cart-pvp) kit keeps its bow or crossbow for the carts.

| Setting | Default | What it does |
|---|---|---|
| `ranged.enabled` | `true` | Bows and crossbows. Also **Bow & crossbow** in a bot's settings. |
| `ranged.min-distance` | `8` | Closer than this, it fights hand to hand. |
| `ranged.max-distance` | `40` | Further than this, it doesn't shoot. |
| `ranged.aim-error` | `1.0` | How unsteady its aim is, in degrees. `0` never misses a still target. |

### Cobwebs

Bots handle cobwebs like players do:

- **Stuck in one**, a bot creeps at a quarter of its pace and can't jump out. Its water bucket washes out a web at its feet.
- **No hitting through a cobweb.** A player's swing stops at the first block outline in the way: a cobweb, even one round your own head. Bots are the same. With a web in the way it **cuts it first**: about half a second with a sword or shears (it gets one out of its inventory if it has one), much longer by hand. Then it hits.
- **Using them in a fight.** Give a bot cobwebs and it uses them now and then, like a good player (raise `cobwebs.how-often` for more):
  - **Feet trap:** someone close (1 to 4 blocks) gets a cobweb at their feet. Stuck, they're slow and easy to hit.
  - **Head trap:** straight after, one on top, round their head. They can't hit back until they cut it.
  - **Ahead of runners:** one in the path of someone running off.
  - **While healing:** one on someone chasing it while it backs off to heal.
  - **Cutting itself free:** stuck in a cobweb with its target out of reach, it cuts its way out with a sword or shears.

| Setting | Default | What it does |
|---|---|---|
| `cobwebs.how-often` | `100` | How keen bots are on cobwebs (10 to 400). `100` is now and then, `50` half as often. Above `100` a bot doesn't hold on to its webs: at `200` someone close gets webbed within about 2 seconds. |
| `cobwebs.cooldown-seconds` | `2` | The least time between one cobweb and the next, at `how-often: 100`. |
| `cobwebs.trap-feet` | `true` | Cobwebs at the feet of someone close. |
| `cobwebs.trap-head` | `true` | Then one on their head. |
| `cobwebs.ahead-of-runners` | `true` | Cobwebs in the way of someone running off. |
| `cobwebs.while-healing` | `true` | Cobwebs on someone chasing it while it heals. |
| `cobwebs.cut-own` | `true` | Cutting its way out of a cobweb it's stuck in. |

The **Cobwebs** switch in each bot's settings turns all of this off for that bot.

### Knockback

Bots take knockback exactly like players. They fly the same distance, and sprint hits, Knockback enchantments and knockback resistance (netherite armour) all count. A bot knocked into the air can only steer a little, just like you.

### Water and rivers

Bots swim. A bot going after someone across a river swims over and climbs out on the far side.

- Like a player, a swimming bot can only climb out where the land is level with the water. It swims along the bank to a place where it can.
- A path, a bridge or a low spot a few blocks along beats a long swim, so bots take it.
- Shallow water is waded through.
- A drop into water is only jumped when the water is deep enough to land in safely. A shallow stream at the bottom of a drop is treated like any other drop.
- A target right beside the water, close enough to hit, is fought from the bank.
- Free roamers stay on dry land. One that ends up in the water anyway, knocked in say, swims to the nearest place it can get out.
- With building on, a bot may put a block down to climb out of a river with steep banks. It only does this when it's after a target, or on a route it's allowed to build along.
- **Water pouring off a ledge isn't a landing** (6.4.5). The drop under the waterfall counts, so bots bridge or go round instead of walking off. A bot standing in shallow water at an edge isn't swimming, so it can still jump or bridge out.

**Water buckets (6.4.5).** A bot that places water (to wash out a cobweb, or to land a big fall) goes back and picks it up, in a fight or not, while it's within 16 blocks. A bot that dies or is removed takes its water with it, so big fights don't leave water everywhere.

## The settings screens

`/fb settings` (or `/fb edit`) on its own opens **every setting in `config.yml` as screens**. Since 6.4.4 the first screen is laid out so a new server owner isn't faced with everything at once:

- **Popular settings** comes first: the 21 settings most people change, on one screen. Health, damage, pearls, shields, maces, crystals, carts, drops, hardcore, skins, names, march width, bridging, whether a busy bot has to be stopped first, how many bots players see, staff notices, what a bot does after a replay, keeping bots over a restart, and (6.4.8) idle glancing about, where marchers look, and mining.
- **Every bot's switches** and **One bot's settings** sit beside it (below).
- **The twelve groups** the config is in are underneath, for everything else: Fighting; Weapons and PvP styles; Orders and groups; Marching and formations; Walking, building and mining; Roaming and patrolling; Who the bots are; Bots that join, and the Player Cannon; Filming; Voice and AI; Performance; The server (6.4.8: there were eight, and building was hidden under marching). Each one opens its sections, and each section its settings, with what each one does, what it is now and its default. A setting you've changed is yellow.
- **Quick actions** and the **Web editor** are along the bottom.
- **Every setting says what it does (6.4.5).** A choice lists each option with what it means, the one it's on marked in yellow: `building.only-own-blocks` shows what kit, true and false each do. Settings whose key says little have a plain name, like "Build only with blocks it carries" or "Bridge across gaps". The web editor shows the same.
- **Click a setting to change it.** A switch flips, a choice moves on to the next (shift-click: the one before), and anything else you type: a number, a name, a list (commas between), a key. **Right-click** puts it back to its default. A secret such as `ai.api-key` is never shown; shift-right-click clears it.
- **Typing it:** on 1.21.7 and newer a **dialog box** opens, with what the setting does, a box to type in, and Save and Cancel. On older versions a **sign** goes up over your head (nobody else sees it, and the block goes back afterwards): a number goes on the first line, and longer text, like a list or a command, can run across all four. Something too long for a sign, like an AI key, says to use `/fb web` or `config.yml` instead. Nothing is typed in chat any more.
- **It's saved at once:** written into `config.yml` with its comments kept, and the config is read again, as `/fb reload` would. Health, speed and damage only apply to bots spawned after. Staff are told what was changed, and by whom.
- **Every bot's switches:** the same switches as in a bot's own menu (pearls, shield, mace, hardcore...), for every bot at once. `/fb settings global` goes straight there. A bot whose switch you changed in its own menu keeps its own, and the screen says how many have.
- **One bot's settings:** pick a bot, for its own menu (below).
- Changing anything needs the `fightbot.settings` permission (ops have it). Without it, `/fb settings` opens the bots to pick from, as before.

## The bot settings menu

Every bot has its own menu. Open it with `/fb settings <bot>` or `/fb edit <bot>`, or from **One bot's settings** in `/fb settings`.

Hover over the head at the top to see the bot's health, group, what it's doing and how many settings you've changed.

| Button | What it does |
|---|---|
| **Bring here** | Teleports the bot to you, facing the way you are. |
| **Go to bot** | Teleports you to the bot. |
| **Rename** | A dialog box (1.21.7 and newer) or a sign asks for the new name. Type `random` for a made-up one; leave it as it is, or Cancel, to keep the name. |
| **Clone** | A copy with a random name, the same gear and the same settings. Stays open, so you can keep clicking. |
| **Change group** | Moves it to another group, or **No group**. |
| **Open gear** | Its inventory. Stop it first if it's busy. |
| **Stop** | Stops whatever it's doing. |
| **Heal** | Back to full health. |
| **Roam** / **Patrol** | Sets it roaming or patrolling. |
| **Reset settings** | Every switch goes back to the server's settings. |
| **Remove bot** | **Shift-click** to remove it, so it can't happen by accident. |

Renaming keeps everything: skin, gear, health, settings, group and fight. Minecraft doesn't let a player change their name while they're in the world, so behind the scenes the bot is swapped for an identical one with the new name. That's why you see it "join the game".

### Per-bot switches

Your `config.yml` sets how every bot behaves. These switches let one bot be different from the rest.

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
| Fights back: mobs | Hitting back at a mob that attacks it, when it isn't fighting anyone. |
| Pillaring | Going straight up when you're above it. |
| Bridging | Crossing gaps and water when there's no way round. |
| Mining | Breaking blocks in its way with a pickaxe. |
| Realistic ping | A wandering ping in the tab list. |
| Bow & crossbow | Shooting players out of reach. |
| Spear fighting | Jabbing and charging with a spear. |
| Elytra flying | Flying after far-off players, and fighting in the air. |
| Cart PvP | Cobwebbing players and blowing them up with a TNT minecart. |
| Crystal PvP | Placing end crystals by players and setting them off. |
| Hardcore | Staying in the game as a spectator when it dies, instead of leaving. |
| On the locator bar | Showing on players' locator bar (1.21.6+), so they can hunt it down. Off unless `performance.locator-bar` is on. |
| Drops items (6.4.4) | Dropping its gear when it dies. It starts out following `death.drop-items` and the world's keepInventory. Off, it drops nothing at all: everything it had just goes. |

- **Glowing means on.** Click to flip a switch.
- **Right-click** hands a switch back to the server, so it follows `config.yml` again.
- Changes apply the moment you click. There's no save button.

A bot's settings belong to that bot. They're gone when it dies (after a restart, a bot comes back with them). To keep a setup, put it in a **save** (below).

## Equipment

Right-click a bot **in creative mode**, or use **Open gear** in its menu.

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
- TNT minecarts, rails and flint and steel, for [cart PvP](#cart-pvp)
- end crystals and obsidian, for [crystal PvP](#crystal-pvp)

### Wear and mending

Bot gear wears out and breaks like yours: the game wears it down the same way, a point for each hit taken on armour and each hit with a weapon. Before 6.4.9 FightBot wore it down a second time on top, so it broke sooner than yours would. `gear.durability: false` stops a bot's gear wearing at all. When something breaks, the bot puts on the best spare in its pack (`gear.replace-broken`). A bot wearing **Mending** gear, with **bottles o' enchanting** anywhere in its inventory, mends like a player: it throws the bottles down in front of itself and picks up the XP. The repair is the game's own, so a worn-out netherite set takes over a hundred bottles.

- `gear.mending-throw-speed` (`0.5`): how hard it throws each bottle.
- `gear.mending-throw-angle` (`45`): how far down it throws. `0` is straight ahead, `90` is at its feet.
- `gear.repair-after-fight-seconds` (`30`): a bot standing about gets its gear back to full this long after its last fight. A bot that never fought, like a practice dummy, always has full gear.

A bot mends until its Mending gear is back above 60%, or it runs out of bottles (20 seconds at most), backing off from you while it does. Hurt, it eats a gapple first, then goes back to the bottles. Bottles come in bursts with a short pause (`gear.mending-burst`).

## Kits and saves

`/fb kits` opens one screen, with **Kits** on one side and **Saves** on the other. `/fb loads` goes straight to the kits and `/fb saves` straight to the saves, each with a door (Back) to the screen with both; Esc closes it. Both hold up to seven loadouts and survive restarts.

A kit changes the gear on bots you already have; a save spawns new bots with gear and settings together. More in [Which one should I use?](#gear-a-kit-a-save-or-a-ready-made-loadout)

### Ready-made loadouts

Five loadouts come with FightBot, on the bottom row of the kits and saves screens. Click one in **Kits** and pick the bots to give it to; click one in **Saves** and a new bot spawns wearing it. Nothing to fill in first.

| Name | Fights with |
|---|---|
| `diamond-sword` | Diamond sword and axe, shield, cobwebs, pearls, gapples, strength potions. Diamond armour. |
| `netherite-sword` | Netherite sword, cobwebs, pearls, gapples, lots of strength potions. Netherite armour. |
| `mace` | Mace with Wind Burst, an elytra and firework rockets, wind charges, pearls, cobwebs, totems. Netherite armour with Thorns. |
| `crystal` | End crystals and obsidian, XP bottles, lots of totems. Netherite armour. |
| `cart` | TNT minecarts and rails, a crossbow, flint and steel, totems. Netherite armour. |

All the armour has Mending and Unbreaking III, every enchantment is at its normal maximum, and none of them put potion effects on a bot. The commands take their names too: `/fb kit Bob mace`, `/fb save crystal`, `/fb kit --all cart`. They can't be changed or deleted. Anything a Minecraft version doesn't have is left out.

### Kits: re-gear bots you already have

| Command | What it does |
|---|---|
| `/fb saveload <bot> [1-7]` | Stores a bot's gear as a kit. Leave out the number to use the first free slot. |
| `/fb kit <bot> <1-7\|ready-made>` (or `load`) | Gives one bot the kit, replacing what it carries. |
| `/fb kit --all <1-7\|ready-made>` | Gives every bot the kit. Busy bots are skipped, and FightBot tells you how many. |
| `/fb kit --group <group> <1-7\|ready-made>` | Gives a whole group the kit. |
| `/fb delload <1-7>` | Deletes a kit. |

In the screen, click a kit, then click as many bots as you like. Each one drops off the list once it has the kit. Close the screen when you're finished.

### Saves: spawn new bots already set up

| Command | What it does |
|---|---|
| `/fb savegear <bot> [1-7]` | Stores a bot's gear **and settings**. Leave out the number to use the first free slot. |
| `/fb save <1-7\|ready-made> [count\|--name <name>]` | Spawns bots from a save, or wearing a ready-made loadout: `/fb save mace 10`, or `/fb save mace --name Steve` for one with that name. `--location` works on the end, as for `/fb spawn`. |
| `/fb delsave <1-7>` | Deletes a save. |

A save only remembers the settings you changed on that bot, so later config changes still reach everything else. Hover over a save to see which settings its bots spawn with.

**Potion effects:** saves and kits keep the bot's potion effects too, so a bot saved while invisible comes out invisible. Give the effect first, then save: `/effect give <bot> invisibility infinite 0 true` (`true` hides the particles), then `/fb savegear <bot> 1`. Effects keep their level and time left (or last forever, given with `infinite`). Bots also keep their effects over a restart or reload.

## Groups

Bots **and players** can be in a group, one group at a time; adding one that's in another group moves it.

**Teams.** Players in a group are on the team with its bots. In a group fight, the other side goes after them too, so 3 against 300 works: all 300 go after the 3. With `groups.friendly-fire: false` (the default), a bot never fights back against someone in its own group, player or bot, and won't use a crystal or a TNT cart that would blow up a teammate. `true` lets teammates fight back.

**When a bot dies** it leaves its group. With `groups.keep-after-death: true` (off by default) it keeps its place: spawn a bot of that name again (`/fb spawn --name <name>`, or `/fb scene load`) and it's straight back in the group. With [hardcore](#hardcore-dead-bots-stay-as-spectators) on, a dead bot spectating stays listed in its group. `/fb grouplist <group>` marks members who are dead or not in the game. `/fb remove` and `/fb groupremove` still take a bot out.

**Adding a bot to a group that's busy:** a free bot joins in with whatever the group is doing together: roaming, patrolling or a fight. A busy bot keeps at its own job and goes with the group's next order once it's free. With `orders.must-stop-first: false` it drops its job and joins in straight away. A bot can't join a group that the route it patrols is hunting.

| Command | What it does |
|---|---|
| `/fb groups` | Opens the groups screen. |
| `/fb groupcreate <name>` | Makes a group. |
| `/fb groupadd <group> <bot\|--player <player>>` | Puts a bot, or an online player, in it. A plain name is a bot; a player goes after `--player` (6.4.4). |
| `/fb groupadd <group> --all` | Puts in every bot that isn't in a group yet. Bots already in a group stay where they are. |
| `/fb groupadd <group> --group <other>` | Moves everyone in another group, bots and players, into this one. The other group stays, empty. |
| `/fb groupremove <group> <bot\|--player <player>>` | Takes a bot or a player out. |
| `/fb groupdel <group>` | Deletes a group. Its bots are freed. |
| `/fb grouplist [group]` | Lists groups, or one group's members, marking any that are dead or not in the game. In game, this opens the screen. |
| `/fb groupcheck <bot>` | Which group a bot is in. |
| `/fb groupchange <group> <new name>` | Renames a group. |

Groups keep their names across restarts. Bots that come back after a restart are back in their group, and players stay in theirs until they're taken out.

**In the groups screen,** click a group, then **Add a bot**. Click bots one by one, or add lots at once:

- **Add every free bot:** every bot that isn't in a group yet (the same as `groupadd <group> --all`).
- **Add every bot:** every bot that isn't in this group, taken out of any other group.
- **Move another group in:** pick a group, and everyone in it, bots and players, moves to this one (the same as `groupadd <group> --group <other>`).

Each one joins in with whatever the group is doing together, as if added by itself.

### Group fights

| Command | What it does |
|---|---|
| `/fb groupfight <group> <group>` | Two groups fight as one-on-one duels. Each bot takes one opponent until one falls, then picks the next. |
| `/fb groupstop <group> [group]` | Stops one group, or both sides of a fight. |

A group going after a player or a bot is `/fb fight --group <group> <player>` or `/fb fight --group <group> --bot <bot>`. (`/fb groupfight <group> <player>` still works, for older scripts.)

## Roaming and patrolling

Bots can walk a **route**, or wander about **freely**, when they aren't fighting. Routes are shared between roaming and patrolling. The route and point commands work with either prefix (`roaming…` or `patrolling…`).

A route, free roaming, a patrol or a recording? See [Moving bots about](#moving-bots-about).

### Making a route

1. `/fb roamingroutecreate park` makes a route called `park`.
2. Stand on each spot and run `/fb roamingpointset park`. Each run adds the next point.
3. To move a point to where you're standing, use `/fb roamingpointset park <number>`. To delete one, use `/fb roamingpointdel park <number>`.

**Or make it by walking it:** `/fb pointtool park` (also `/fb roamingpointtool park`) makes the route if it's new and lends you four things in your hotbar:

| Item | Right-click |
|---|---|
| Emerald | A point where you stand. |
| Red dye | Takes the last point back. |
| Lime dye | Done. Your hotbar comes back. |
| Barrier | Cancel. The points you put down this time are taken back too. |

While you work, the route is drawn in the air for you only: a spark at each point (the first one blue) and a line on to the next. The tools can't be dropped, moved or placed. Your hotbar also comes back if you leave or die. The point tool and the point commands make the same routes, so you can mix them.

`/fb roaming` or `/fb patrolling` opens the same things as screens.

### Roaming

| Command | What it does |
|---|---|
| `/fb roamingstart <bot\|--all\|--group <group>> <route> [loop\|back\|stop]` | Walks the route. At the end it loops, walks back, or stops. |
| `/fb roamingfree <bot\|--all\|--group <group>>` | Wanders about near where it is, pausing now and then. |
| `/fb roamingfree --group <group> apart` | Every bot in the group wanders its own way, in random directions, instead of together as a squad. |
| `/fb roamingfree --group <group> together` | Together as a squad, even with `roaming.free-apart: true`. |
| `/fb roamingstop <bot\|--all\|--group <group>>` | Stops roaming. |

A group sent on a route walks it together, as a squad. A group sent free roaming does too, behind a leader, unless you add `apart`. With `roaming.free-apart: true` (6.4.8, off at first), a group sent free roaming always spreads out, each its own way, so you can put every bot in one big group and still have them wander about at random. If a roaming bot is attacked, it fights back, then goes back to its walk.

**Free roaming (6.4.8):** roamers pick spots out in the open that they can walk to in a straight line, so they don't stand walking into walls. If there's no way to the spot they picked, they pick another. A crowd roaming in one place spreads out over more ground (200 bots over about 64 blocks), instead of all bumping into each other in a small circle. A roamer that no player is near enough to see stands about until someone comes (`performance.unseen-roamers-rest`). That costs the server almost nothing.

Free roamers now and then stop to look at a bit of grass. With Mining on, ones carrying a pickaxe sometimes pull it up. They don't go swimming. In the config:
- `roaming.free-radius` sets how far a free roamer strays.
- `pause-min-seconds` and `pause-max-seconds` set how long it stands about between strolls.
- `point-pause-seconds` sets how long a route walker waits at each point.
- `stop-at-points: false` (6.4.4) walks a route straight on through each point, turning as it goes, without stopping or waiting. It reads as someone walking a path rather than going from mark to mark. The end of the route still loops, turns back or stops as you said. 6.4.8: it no longer slows almost to a stop at each point (stop, go, stop, go along points close together). It turns for the next one the moment it gets there.

### Patrolling

A patrol walks a route and goes after **that route's targets**, and only those. After the fight it goes back to its route. Targets who are gone (logged off, removed, or a group that was deleted or emptied) come off the route once nobody is patrolling it. While a patrol runs, it keeps them, and goes after them again when they're back.

| Command | What it does |
|---|---|
| `/fb patrollingtargetadd <route> <player\|--bot <bot>\|--group <group>>` | Gives the route's patrols a target. A plain name is a player (6.4.4). |
| `/fb patrollingtargetdel <route> <name>` | Removes a target. |
| `/fb patrollingtargetlist <route>` | Who the route's patrols hunt. |
| `/fb patrollingstart <bot\|--all\|--group <group>> <route> [loop\|back\|stop]` | Patrols the route. Started from a group's or a bot's menu on a route that has no targets yet, the route's targets screen opens straight after, so you can pick who they patrol for (6.4.8). |
| `/fb patrollingstop <bot\|--all\|--group <group>>` | Stops patrolling. |

`patrolling.spot-range` sets how close, and in sight, a target has to be before it's spotted. `patrolling.give-up-seconds` sets how long a target can stay out of reach before the patrol goes back to its route.

## Skins

Choose where skins come from with `identity.skin-source` in `config.yml`, then run `/fb reload`:

| Setting | What bots wear |
|---|---|
| `random` | **The default.** FightBot's own skins: about 970 that come in the jar already signed (ready at once, nothing to download), a few looked up from Mojang, and real names with their own skins that it finds by itself. There's nothing else to do. See [Names with their own skins](#names-with-their-own-skins). |
| `folder` | Your own skin images. Put skin `.png` files (64×64, or old-style 64×32) in `plugins/FightBot/skins/`. |
| `mojang` | The skins of real accounts. List their usernames under `identity.skin-names`. |
| `none` | Plain Steve and Alex. |

`random` is the default from 6.0.1. A config still on `none`, the old default, is switched to `random` once when it updates. Set it back to `none` and it stays.

**Type `/fb skins` in game at any time.** It shows your current setting, how many skins are ready, what's still in progress, and anything that went wrong.

Skins work the same on both builds. On Spigot and CraftBukkit, the bot heads in the menus show each bot's skin too.

### About signing (the "wait" messages)

Minecraft only shows a skin that Mojang has signed. In `folder` mode, FightBot sends each image to a free signing service (MineSkin) the first time it sees it. It keeps the result, so each image is only ever signed once.

The free service takes a few images at a time. **When the console says the service asked FightBot to wait, that's normal.** Nothing is broken and there's nothing to do. FightBot waits for as long as it's asked, then carries on by itself until every image is signed, with a line like `Signed skin 4 of 12` for each one. If the service stays busy for a very long time, FightBot takes a break and signs the rest on the next restart or `/fb reload`.

- Until the first image is signed, new bots look like Steve or Alex. After that, each new bot wears one of the images signed so far.
- A bot keeps the skin it spawned with. One that comes back after a restart gets a new skin if its old one isn't from the current `skin-source`.
- Want it faster? Get a free API key at [mineskin.org](https://mineskin.org) and put it in `identity.skin-api-key`.
- If an image can't be signed, FightBot names it and says why. The usual reason is that it isn't a real 64×64 skin. Fix or remove the image, then `/fb reload`.
- Added images while the server is running? Run `/fb reload`.

Already have signed skin data? Save it as a small `.yml` file in the skins folder, with a `value:` line and a `signature:` line. The `README.txt` in that folder explains how.

### Names with their own skins

With `skin-source: random`, FightBot finds more skins by itself. **While nobody is on your server** (bots don't count), every 10 seconds it:

1. Makes up a few names, the same way it makes up bot names (`jake2011`, `SleepyPanda`...).
2. Asks Mojang which of them are real accounts, and what they wear.
3. **No account, no skin, or one of the game's default skins** (Steve, Alex and the other seven)? It skips the name. A skin worn by lots of accounts is skipped too.
4. **A skin of its own?** It keeps the name and its skin.

Then, with `name-source: random` (the default), **new bots get those names, each wearing its own skin**. Bots named another way (from `botnames.yml`, or numbered) keep their names and wear one of the skins instead. A name you type yourself is different: see below.

- It keeps at most one name each time, so up to 360 an hour. Fewer when the names it tries have no skin of their own.
- Everything it finds is kept in `skins/cache/names.txt`, so no name is checked twice. Delete the file to start over.
- Until some are found, new bots get a made-up name and one of the built-in skins.
- Names found by 5.20.3 and older came from the old Minecraft-themed made-up names (`BlockBuddy22`, `CreeperKidYT`). Bots don't get those names any more, but their skins are still worn. They don't count towards `max`, and they make room for new ones once it's reached.
- **The console says when it finds some:** the first one straight away, then one line every 10 minutes at most (*"Found 8 more names with their own skin (42 in all)."*).
- `/fb skins` shows how many it has found, how many are new since the server started, and what it's doing. If it's waiting for players to leave, it says who's on.
- These are real people's names and skins. If the real owner joins your server, the bot steps aside, the same as with any other name.
- Rather not see a certain skin? Add it to `identity.skip-skins`: the long code at the end of its `textures.minecraft.net` address, or the whole address.
- **`/fb skins names`** lists every name it found, with a click-to-copy button (Paper build), and saves them all to `skins/found-names.txt`.

| Setting | Default | What it does |
|---|---|---|
| `identity.find-skins.enabled` | `true` | Finding more skins. |
| `identity.find-skins.every-seconds` | `10` | How often it looks (5 to 3600). |
| `identity.find-skins.only-when-empty` | `true` | Only while nobody's on. `false`: it keeps looking while players are on too. |
| `identity.find-skins.max` | `5000` | It stops once it has found this many (up to 50000). |

`skin-source: name` from 5.18.0 is now part of `random`. An old config is switched over by itself, and the names it found are kept.

### A name you type

`/fb spawn --name Dream` (or `/fb save 1 --name Dream`): when the name you type is a real Minecraft account, the bot wears **that account's skin**, and its cape if it has one. Spawn a bot with your own name from an alt account and it looks just like you. This is `identity.skin-from-name`, on at first, and it works with any `skin-source` except `none`.

- The first time, FightBot asks Mojang, which takes a second or so (never more than 4; after that the bot spawns with a skin as usual). The skin is then kept in `skins/cache/`, so the next bot with that name is instant.
- **Scripts don't wait.** From the console, a command block or another plugin, the bot spawns straight away (so `/fb spawn --name Guard1` followed by `/fb kit Guard1 mace` keeps working), and the skin is looked up behind it: the next `Guard1` wears it. Only a player typing the command waits for the skin.
- A name with no account behind it gets a skin like any other bot, and isn't asked about again for half an hour.
- Random names (`--random`, a number) are left to `skin-source`.
- `identity.protect-real-names` still refuses the name of someone who has played on your server.
- Some people would rather not see their name and skin on a bot: `identity.skin-from-name: false` turns it off, and typed names get a skin like any other bot.

### Capes

Minecraft only shows real capes, ones Mojang gave an account, so a cape can't be made from a picture. Bots wear capes that **come with a borrowed skin**: built-in skins, found names (`random`) and `skin-names` accounts (`mojang`) that had a cape on.

- `identity.capes.enabled` (`true`): capes at all.
- `identity.capes.chance` (`30`): how many bots in 100 wear one, as near as the skins it has allow.
- `/fb skins` shows how many found names have a cape.

`mojang` and `random` mode download skins in the background the same way. The first bots after a fresh start may look plain for a moment. Mojang also asks for a short wait sometimes, and that's normal too.

## Names

Choose how `--random` names are made with `identity.name-source`:

| Setting | Names |
|---|---|
| `random` | Made-up names that look like real players' names, like `jake2011`, `SleepyPanda`, `itz_ava` or `NoahPlays`. Never a short "rare" name. This is the default. |
| `file` | Picked from `botnames.yml`. |
| `numbers` | Numbered names, from `identity.number-format`. |

Number patterns use `%<digits>n` for one random character from those digits, and you can chain them. For example, `Bot%01n%01n` gives `Bot00`, `Bot01`, `Bot10` or `Bot11`. Watch how many names a pattern can make: `%01n` only has two, so a third bot gets a made-up name instead, and FightBot tells you why. The older style also works: `%03d` gives a random number padded to three digits, like `042` or `517`.

With `file`, if `botnames.yml` is empty or every name in it is taken, bots get made-up names, and FightBot says so in chat.

`identity.protect-real-names` (on by default) stops bots taking the name of anyone who has played on your server. Turn it off to let bots use those names too, for example on a scripted server. Online players, AuthMe and nLogin accounts, and banned names are still off-limits.

## Kicks and bans

Bots are players, so they can be kicked and banned like players.

- **`/kick <bot>`** removes the bot, the same as `/fb remove`.
- **`/ban <bot>`** removes it, and the name can't be spawned again until you run **`/pardon <bot>`**. FightBot tells you this if you try.
- Bans from plugins that keep their own ban list, like LiteBans, still remove the bot. Only the server's own list stops the name being spawned again.
- **Ban plugins** work too. This includes death-ban plugins like the Unstable SMP ones, which kick and then ban a player who dies. The bot is removed, and its name stays banned until it's pardoned.
- Random names skip banned names.

Some kicks are ignored for bots, because they can only be about a real player's game:

- flying, lag and odd packets
- idling
- turning down the resource pack
- the whitelist (bots skip it)
- IP bans (every bot shares one address, so one IP ban would take them all)

FightBot notes this in the console the first time it happens.

## Other plugins

FightBot checks what's installed at startup and says, in the console, anything that affects bots.

- **AuthMe:** bots can't type a password, so FightBot logs its own bots in as they join. It only does this for bots, and no AuthMe accounts are made. A name that has an AuthMe account belongs to a real player, so it can't be used for a bot.
- **nLogin:** nLogin sets each player up while they connect, and a bot never connects the way a player does, so nLogin can't log it in. Instead, as each bot joins, FightBot puts its name on nLogin's list of names that skip the login (`limbo.unrestricted.nicknames`, which nLogin has for plugins that make players). The name is only in nLogin's memory, never written to its config, and it comes off the list when the bot leaves. Nothing goes into nLogin's accounts. A name that already has an nLogin account belongs to a real player, so it's never used for a bot. Tested with nLogin 2.0.24.
- **SimpleLogin:** bots can't type a password, so FightBot marks its own bots logged in as they join, and takes off the blindness and frozen walking speed SimpleLogin puts on new players. Nothing goes into SimpleLogin's accounts. SimpleLogin keeps accounts by player ID, and a bot's ID is FightBot's own, so a bot can never use a real player's account.
- **Other login plugins** (LoginSecurity, LibreLogin and others): these hold players who haven't logged in, and bots can't log in. If bots won't fight, that's why.
- **PacketEvents** (on its own or inside GrimAC): it tries to kick players whose connection it can't hook, and bots have none. FightBot stops that kick, for bots only.
- **ViaVersion:** its "Could not find UserConnection" warning when a bot joins is harmless.
- **ProtocolLib:** plugins built on it expect every player to have a network connection. Bots don't, so if one logs errors naming a bot, that's why.
- **Anticheats:** they judge players by what their game sends, and bots have no game. Some flag a bot for packets "out of order" or missing whenever it fights. So when an anticheat is installed, bots carry the **NPC tag**, the one Citizens and other NPC plugins use, which tells anticheats and other plugins that follow it to leave that player alone (`anticheat.npc-tag`: `auto`, `true` or `false`). If one still kicks a bot, FightBot says why.
- **PvP turned off** in a world: FightBot warns at startup and when a bot's hits don't land.
- **WorldGuard** and **PvPManager** (`combat.avoid-no-pvp`, off by default): with it on, a bot in a fight doesn't follow anyone into a WorldGuard region with PvP denied. It waits at the edge until they come out, and doesn't pearl in. A bot in a fight (or in one in the last 15 seconds) can't get into such a region at all, the way PvPManager walls in a player in combat: not walking, running away, knocked back, or by a pearl (the pearl lands, the bot stays where it was). It also leaves alone a player PvPManager protects (PvP switched off, a newbie, just respawned). Off, bots go after their target wherever it is, as before, and their hits there come to nothing.
- **Vanish plugins** (EssentialsX, SuperVanish, PremiumVanish and others): bots are players to them. If a player can't see a bot that's right next to them, and FightBot didn't hide it, FightBot says so in the console (and to staff), naming the bot and whether a vanish plugin marked it vanished. Tested with EssentialsX and SuperVanish, which leave bots alone.
- **PvPManager** gives every new player newbie protection, and every bot is a new player, so bots couldn't hurt anyone or be hurt for their first 10 minutes. FightBot takes newbie protection off its own bots as they join, and switches their PvP on.
- **LuckPerms:** see [LuckPerms](#luckperms) below.
- **Simple Voice Chat:** bots can talk, and answer you with AI. See [Voice lines](#voice-lines-simple-voice-chat) and [AI voice chat](#ai-voice-chat).
- **Emotecraft** and **Customizable Player Models:** emotes and models on bots. See [Emotes and player models](#emotes-and-player-models).
- **PlugManX** and `/reload`: see [Reloading FightBot](#reloading-fightbot-plugmanx-reload) below.

### LuckPerms

With LuckPerms on the server, each bot gets its LuckPerms data as it joins, just like a player:

- **Groups, permissions, prefix and suffix.** Tab list, name tag and chat plugins show a bot's prefix like anyone else's.
- **Permission checks.** LuckPerms answers every permission check on a bot. If a bot isn't allowed to do something, it can't do it.
- **`/lp user <bot>` works.** Give a bot a rank with `/lp user <bot> parent add vip`, and every bot with that name has it from then on.

Settings:

- `luckperms.group` puts every bot in a LuckPerms group while it's here, on top of its own groups. Use it for a `[Bot]` prefix, or for permissions only bots should have. Make the group first with `/lp creategroup bot`. It's kept in memory only, never saved.
- `luckperms.enabled: false` turns all of this off.

If a bot is spawned with the name of someone LuckPerms already knows, `/lp user <name>` still means that player, not the bot.

**Selling longer AI chats:** chats with bots have no limit by default. Give `fightbot.ai.limited` to the players who should get `ai.limited-replies` answers (2), and take it off a rank you sell:

```
/lp group default permission set fightbot.ai.limited true
/lp group vip permission set fightbot.ai.limited false
```

## Voice lines (Simple Voice Chat)

With the **Simple Voice Chat** plugin on the server, bots show up in voice chat like players, and they talk. Players hear them with the voice chat mod, coming from the bot, and can turn bots up or down with the **FightBot** slider in voice chat's volume settings. Without Simple Voice Chat, nothing changes. `/fb vc` shows whether it's working.

**How bots show up.** Each bot gets one of these when it joins, like real players (`voice.presence` sets the chances):

| | In voice chat | Says lines? |
|---|---|---|
| `talks` | Connected | Yes |
| `deafened` | Voice chat turned off (the crossed-out speaker) | No |
| `no-mod` | Doesn't have the mod (the disconnected icon) | No |

Change one bot with `/fb vc presence <bot> <talks|deafened|no-mod>`. A deafened bot, or one without the mod, stays quiet like a player would, even when you tell it to say something. (Voice Chat has no muted-microphone icon it can show above other players, so a quiet bot shows as deafened.) A bot wearing a CPM model always shows as connected and stays quiet - see [Player models](#player-models).

**FightBot's own lines.** These come in the jar, and bots say them by themselves. Anyone can also play them with `/fb vc <name>`:

| Line | When a bot says it by itself |
|---|---|
| `hello` | As it joins: 1 in 50 bots |
| `am_i_muted` | As it joins, the rare one: 1 in 200 |
| `grass` | When it pulls up grass while roaming: 1 in 100 times |

More come with updates. Each bot speaks in one voice, so it always sounds like the same person. `voice.triggers` sets how often (a % of those odds) and a cooldown for each moment, and `voice.min-gap-seconds` and `voice.max-talking` stop bots talking over each other. Rather bots only talk when you say so? `voice.on-their-own: false`.

**Your own lines.** Put `.mp3` or `.wav` files in `plugins/FightBot/voice/`, then `/fb vc reload`. The file's name is the line's name: `plotvoiceline.mp3` is `/fb vc plotvoiceline`. Lines are cut off after `voice.custom.max-seconds` (15 by default). You can also add them in the [web editor](#the-web-editor), which converts other kinds of sound file, like a phone's `.m4a`, for you.

**Nobody can pass off a file as FightBot's.** A file added to a server is **never** said by a bot on its own, only when someone types `/fb vc <name>` (that needs `fightbot.voice.custom`, which ops have). Everyone near the bot sees a note in chat that it's *a sound file added by this server*, and who played it (`voice.custom.show-who-played: false` hides the note). Every play, and every file added through the web editor, is written to `voice/plays.log` with the file's fingerprint (SHA-256).

| Setting | Default | What it does |
|---|---|---|
| `voice.enabled` | `true` | Bots in voice chat at all. |
| `voice.on-their-own` | `true` | Bots say FightBot's lines by themselves. `false`: only when played with `/fb vc`. |
| `voice.presence.talks` / `deafened` / `no-mod` | `50` / `20` / `30` | How bots show up, as chances. (`muted` from 6.0.0's test builds moves over by itself.) |
| `voice.distance` | `0` | How far away bots are heard, in blocks. 0 is voice chat's own distance. |
| `voice.volume` | `1.0` | How loud bots are (0.5 = half, 2.0 = twice). Every line is evened out to the same loudness first, so loud recordings don't blare. Players also get a FightBot slider in voice chat. |
| `voice.triggers.<what>` | | `enabled`, `chance` (a % of each line's own odds: 100 = as set, 200 = twice as often) and `cooldown` (seconds) for each moment a bot talks about. |
| `voice.custom.enabled` | `true` | Whether files added to the server can be played at all. |
| `voice.custom.show-who-played` | `true` | The chat note saying which file a bot is playing and who played it. `false`: no note, and everyone near the bot hears the file. Every play is still written to `voice/plays.log`. |

## AI voice chat

Talk to a bot in Simple Voice Chat and it answers out loud, in a word or two ("Hi", "Good"), then gets back to fighting. It only answers greetings and short questions - no small talk. It uses your own key with an AI company: **Groq** (the default - it has a free plan), **Google Gemini** or **OpenAI**.

**Setting it up (Groq):**

1. Make a key at **console.groq.com** (API Keys > Create API Key).
2. In `config.yml`: `ai.enabled: true`, `ai.provider: groq`, and the key in `ai.api-key`. Or set them in the web editor.
3. `/fb reload`, then `/fb ai`: it should say **listening**.

**Talking to a bot:** stand within 8 blocks (`ai.range`), look at it and say something short. Only bots that talk in voice chat answer (`/fb vc presence <bot> talks`). With CPM on the server, bots stay quiet and don't answer (see [Player models](#player-models)). The first time a player is near one, they're told that what they say to it goes to the AI company. Nothing else they say is used.

| Setting | Default | What it does |
|---|---|---|
| `ai.enabled` | `false` | AI chat at all. |
| `ai.provider` | `groq` | `groq`, `gemini` or `openai`. |
| `ai.api-key` | | Your key from that company. Kept secret in the web editor. |
| `ai.model`, `ai.listen-model`, `ai.speak-model`, `ai.voice` | blank | Blank: FightBot's defaults. Groq: `openai/gpt-oss-20b` thinks, `whisper-large-v3-turbo` listens, `canopylabs/orpheus-v1-english` talks in the voice `autumn`. |
| `ai.range` | `8` | How close you stand, facing the bot (2-32 blocks). |
| `ai.replies` | `0` | Answers per chat. `0`: no limit. |
| `ai.limited-replies` | `2` | For players with `fightbot.ai.limited` (see [LuckPerms](#luckperms)). |
| `ai.words` | `3` | Longest answer, in words (1-12). |
| `ai.chat-again-minutes` | `5` | After this long, a new chat can start. |
| `ai.max-per-hour` | `120` | Answers a server gives an hour at most (`0`: no limit). |

When the key hits its limit, bots just stop answering and fight; FightBot pauses and tries again later. **`/fb ai`** shows whether it's listening, which bots can answer, the last thing it heard and the last answer. **`/fb ai watch`** shows each step live in your chat while you test - *hearing you*, what the AI heard, what the bot says, or why nothing happened. With debug on, every step goes in the debug log too.

## Emotes and player models

Two mods that change how players look. Each needs its plugin on the server **and** the mod in the player's game - players without the mod see an ordinary bot.

### Emotes

With **Emotecraft** on the server, bots play emotes when you tell them to:

| Command | What it does |
|---|---|
| `/fb emote` | Every emote bots can play. |
| `/fb emote <bot\|--all\|--group <group>> <emote>` | Plays an emote. |
| `/fb emote <bot\|--all\|--group <group>> --stop` | Stops it. |

Put emote files (`.json` or `.emotecraft`) in `plugins/FightBot/emotes/` and `/fb reload`, or upload them in the web editor. An emote is named after its file. A bot told to fight stops its emote. `emotes.enabled: false` turns this off.

### Player models

With **Customizable Player Models** (CPM) on the server, each new bot wears one of the models in `plugins/FightBot/models/` at random. Put `.cpmmodel` files there and `/fb reload`, or upload them in the web editor.

- `identity.models.enabled` (`true`) and `identity.models.chance` (`100`, how many bots in 100 wear one).
- **A `.cpmproject` isn't a model.** It's the CPM editor's save file, which is how a lot of models are shared. Open it in the CPM editor (in game: **Open Skin Editor**), then File > Export with **Export mode: Model**, and use the `.cpmmodel` it makes.
- **With CPM on the server, bots show no voice chat icon and stay quiet, by themselves.** Right now the Simple Voice Chat and CPM mods crash some players' games (Minecraft 26.3) when Voice Chat draws an icon above someone: any bot, wearing a model or not. So while CPM is on the server, every bot shows as connected to voice chat (no icon) and never speaks: no voice lines and no AI answers. `/fb vc` and `/fb ai` say so. Once both mods have fixed it, `identity.models.voice-safe: false` turns this off; each bot's own voice chat setting was kept for then.
- Turning models off with `/fb reload` takes them off the bots already wearing one.

## The web editor

Change FightBot from your browser instead of the server files. Type `/fb web` in game (or the console) and click the link - it takes about 5 seconds to make (up to 30 on a slow connection). The editor at fightmc.xyz lets you:

- **change any setting**, with each one explained, and saves and reloads it for you
- **see the bots that are on**, with their health, what they're doing, their group and where, and stop or remove them
- **run the bots**: make them fight, roam or patrol, groups, kits, and each bot's own settings (new bots are only spawned in game)
- **upload skins**, **voice lines**, **emotes** and **player models**, and play emotes on bots
- put bots **and players** in groups, or every bot at once
- **read the debug logs**, follow one live, or download it

**On a network** (Velocity or BungeeCord), each server still has its own editor with `/fb web`. Or type **`/fbp web` on the proxy** for one link that covers every server: the editor shows a server picker at the top, and each server's own editor opens from there. Anyone with that link can change FightBot on every server, so it's only given to people with `fightbot.proxy`. `/fbp web stop` closes all of it.

How it stays safe:

- **The link is the key.** Anyone with it can change FightBot on your server, so don't share it. It stops working after `web.idle-minutes` unused (30), after `web.max-hours` (4), or when you type `/fb web stop`. `/fb web new` makes a fresh one.
- **Nothing to open up on your server.** Your server and the page both connect out to a relay, and everything between them is encrypted with a key that's only in your link. The relay can't read any of it.
- **Only FightBot's own things.** The editor can't run commands or touch other files, and every change is checked like a config edit. Everyone with `fightbot.use` is told in chat what was changed from the web, and by whose link.
- **Slow from far away?** When the link opens, FightBot times the relay. Over 700 ms a message, it tells you in game, and the console always says how fast it was.
- `web.read-only: true` lets the editor look at everything but change nothing. `web.enabled: false` turns it off. It needs the `fightbot.web` permission (ops have it).

## Networks: Velocity and BungeeCord

### New to proxies?

A proxy (Velocity or BungeeCord) is the **front door** of a network. Players connect to it, and it sends them on to the servers behind it, like a lobby and an arena. The proxy has no worlds and no bots of its own. The bots live on the servers.

- **Which servers need FightBot?** Only the ones where you want bots. Servers without it just show as "not linked" in `/fbp list`, and nothing breaks. Bots can only be sent to servers that have FightBot.
- **Two kinds of config.** The proxy has its own (`velocity.toml` on Velocity, `config.yml` on BungeeCord) for your server list and forwarding. FightBot on the proxy has a small `config.yml` of its own in its folder (see [the proxy's settings](#setting-it-up)). Each server keeps its full FightBot `config.yml`, same as without a proxy.

### What it does

Got a proxy in front of your servers? **Put the FightBot jar (the Paper build) in the proxy's `plugins` folder too.** It works on Velocity and BungeeCord, and their forks (like Waterfall). The servers link up to it by themselves. Then:

- **Bots count as players** in the server list's player count, and show up in its hover list of names, alongside real players.
- **Tab list** (Velocity only): bots on the other servers can show in everyone's tab list. Turn this on with `tab-list: true` in the proxy's FightBot config, if your network shows everyone in tab.
- **`/fbp` on the proxy** runs FightBot commands on any server. See below.
- **Bots can move between servers.** `/fb send <bot> <server>` takes a bot to another server with its gear, health, skin and settings, like a player switching servers. It arrives at that server's spawn, or next to a player you name.
- **Kits and saves can be shared.** Turn on `network.share-kits` and `network.share-saves` on the servers that should share them. A kit saved on one is the same on all of them, and deleting one deletes it everywhere. Whatever a server had before is kept in its `old-kits/` folder first.
- **Skins and voice lines can be shared.** Turn on `network.share-skins` and `network.share-voice`. A skin image or voice line added on one server goes to all the others that share them, and a deleted one goes from all of them. Each server checks what arrives the same way as a web editor upload (skins must be real 64×64 skins, voice lines must play), and keeps anything replaced or deleted in its `old-files/` folder. A skin is only ever signed once: the signed copy is shared too.
- **One web editor link for the whole network.** `/fbp web` on the proxy gives you one link with a server picker at the top. See [The web editor](#the-web-editor).

`/fb network` on a server shows whether it's linked, and the bots on every server.

**Updating:** the proxy updates itself too (5.18.1 and up). It looks on Modrinth when it starts and twice a day, downloads a new version, checks it, and puts it in place when the proxy stops, so the next start runs it. `/fbp update` looks right away. On Windows the running jar can't be replaced, so FightBot leaves the new one in its `update` folder and says to copy it in. If your proxy has 5.18.0, copy 5.18.1 in yourself once.

### Proxy commands

On the proxy, with the `fightbot.proxy` permission (or from the proxy console):

| Command | What it does |
|---|---|
| `/fbp list` | Every server, whether it's linked, and its bots. |
| `/fbp <server> <command>` | Runs a FightBot command on that server, like `/fbp arena spawn 5 --random --location 0 64 0`. The answer comes back to you. |
| `/fbp all <command>` | Runs it on every linked server. |
| `/fbp send <bot> <server> [player]` | Moves a bot to another server. |
| `/fbp web` | One web editor link for every server, with a server picker. `/fbp web stop` closes it. |
| `/fbp update` | Looks for a newer FightBot for the proxy now. |
| `/fbp status` | How the link is doing, and whether an update is waiting. |

### Setting it up

**Velocity with modern forwarding:** nothing to do. The servers already share Velocity's forwarding secret, and FightBot uses it.

**BungeeCord, or Velocity without modern forwarding:** start the proxy once, open `plugins/FightBot/link-secret.txt` on it (`plugins/fightbot/` on Velocity), and paste what's inside into `network.secret` in each server's FightBot `config.yml`. Then `/fb reload` on each server.

The link is encrypted, and both ends prove they know the secret before anything is sent. The servers connect out to the proxy on port **25599**, so nothing new is opened on the servers.

**Servers on another machine, or in containers** (like a hosting panel): set `network.proxy` on each server to the proxy's address and port, like `"10.0.0.5:25599"`, and make sure that port is open to them. Once a player has joined a server through the proxy, the proxy tells it its address too.

The proxy's own settings are in `config.yml` in its FightBot folder:

| Setting | Default | What it does |
|---|---|---|
| `link-port` | `25599` | The port the servers connect to. |
| `link-bind` | `0.0.0.0` | Which address to listen on. `127.0.0.1` if every server is on the same machine. |
| `count-bots` | `true` | Bots count in the player count. |
| `hover-list` | `true` | Bots show in the server list's hover list. |
| `tab-list` | `false` | Velocity only: bots on other servers show in the tab list. |
| `update-check` / `update-download` / `update-betas` | `true` / `true` / `false` | The proxy's own updates, as above. |

## Reloading FightBot (PlugManX, /reload)

You can reload FightBot while the server keeps running, with PlugManX (`/plugman reload FightBot`) or `/reload`. Turning it off and on again with `/plugman disable` and `/plugman enable` works too.

- Every bot is written down first and comes straight back afterwards, in the same place, with the same skin, gear, health, settings and group.
- Bots carry on with what they were doing: roaming, patrolling, fighting and group fights.
- Any bot body an older copy of FightBot left behind is removed first, so its name is free again.
- `reload.keep-bots: false` removes the bots on a reload instead.

### Server restarts

Bots come back after a server restart too, and after a FightBot update, since that needs a restart.

- As the server stops, every bot is written down. As it starts, they come back where they stood, **in the world they were in**, with the same inventory, skin, health, settings and group. This works on Spigot too from 6.4.3; before, a Spigot server brought none back.
- **A world that loads late:** a world plugin (Multiverse, or one that resets a world) may load its worlds a moment after FightBot starts. A bot in one of those waits, and comes back there the moment it loads. After `restart.wait-for-world` seconds (120) without it, it comes back at the main world's spawn instead (`restart.missing-world: remove` leaves it out). `restart.missing-world: wait` (6.4.4) keeps it waiting however long it takes, for worlds that only load when someone goes there. The console says which bots are waiting, and for which world.
- **A world plugin that empties a world as the server stops** (Multiverse and others can) used to send the bots to the main world just before they were written down, so they came back there. Since 6.4.4 FightBot writes down where they really were, and the console names the plugin that moved them.
- **A plugin that sends new players to spawn** (EssentialsX's spawn on join, Multiverse's first spawn, lobby plugins) sees every bot coming back as a new player, and used to move it there a moment later. Since 6.4.4, for `restart.hold-in-place-seconds` (10) after it's brought back, a bot stays where FightBot put it, and the console names the plugin, once. Bots you spawn yourself aren't held. `0` turns this off.
- **A world that was reset** while the server was down: if a bot's spot is inside blocks now, in lava or over nothing, it comes back on top of the ground there (or at the world's spawn).
- **After a crash:** the bots are also written down every `restart.save-every-seconds` (60), so a server that crashes, or is killed without a proper stop, still brings them back from the last time. Since 6.4.9 this is done a few bots a tick and the file is written in the background, so it no longer pauses the server.
- They **don't** carry on with what they were doing. Fights and routes start afresh.
- They come back **a few at a time** (`restart.per-second`, 10), so a big army doesn't hold the startup up.
- At most **`restart.max-bots`** come back (100; `0` means all of them). Lower it if your server struggles with lots of bots.
- **Crash-safe:** if the server goes down while bringing them back, the next start doesn't try again. It says so, and keeps them in `restart-bots-failed.yml`.
- `restart.keep-bots: false` starts every restart with no bots, as before.

## Updates

When the server starts, and twice a day after, FightBot looks on Modrinth for the newest release made for your Minecraft version.

- A newer one is downloaded into the server's update folder (`plugins/update`). FightBot checks it against Modrinth's checksum and makes sure it really is FightBot.
- **It picks the right build for your server:** the Paper build on Paper and Purpur, FightBot for Spigot on Spigot and CraftBukkit. If the wrong build is installed, the right one is downloaded and swapped in at the next restart.
- It goes in by itself the next time the server starts, or when FightBot is reloaded. Nothing changes while the server is running.
- Admins (anyone with `fightbot.use`) are told in chat when they join, and the console says so too.
- `/fb update` looks right away.
- A release that's taken back down on Modrinth is removed from the update folder again, if FightBot downloaded it.

Settings:

| Setting | Default | What it does |
|---|---|---|
| `updates.check` | `true` | `false`: FightBot never looks by itself. `/fb update` still looks when you ask. |
| `updates.download` | `true` | `false`: only tell admins, and download it yourself. |
| `updates.betas` | `false` | `true`: beta versions count as updates too. |

## The config

FightBot keeps its files in `plugins/FightBot/`:

| File or folder | What's in it |
|---|---|
| `config.yml` | Everything you can change: health, speed, damage, combat, building, mining, skins, names, ping and more. Every option is explained inside, in eight groups (see below). |
| `botnames.yml` | The name list, for `name-source: file`. |
| `data.yml` | Your saves, kits, groups and routes. Keep it when you update. |
| `skins/` | Your skin images, and a cache of signed and downloaded skins. |
| `voice/` | Your own voice lines (`.mp3`, `.wav`), and `plays.log`. |
| `debug/` | Debug logs, if you turn them on. |
| `reload-bots.yml` | The bots, written down during a plugin reload. It's gone again once they're all back. |
| `old-configs/` | Backups made when your config was updated. |

Edit the config, then run `/fb reload`, or change it in your browser with `/fb web`. Health, speed and damage only apply to bots spawned after the reload.

From 6.3.0 the settings are in eight groups, listed at the top of the file. Search for a group's name to jump to it:

| Group | What's in it |
|---|---|
| 1. Fighting | Bot stats (health, speed, damage, crits), `combat`, `retreat`, `head-movement`, `potions`, `water`, `cobwebs` |
| 2. Weapons and PvP styles | `gear`, `mace`, `elytra`, `spear`, `ranged`, `crystal`, `cart` |
| 3. Orders, groups and moving about | `orders`, `groups`, `formation`, `movement`, `building`, `mining`, `roaming`, `patrolling` |
| 4. Who the bots are | `identity` (names, skins, capes, models), `ping`, `death`, `luckperms`, `anticheat` |
| 5. Bots that join by themselves | `joining` |
| 6. Filming | `recording`, `scenes`, `emotes` |
| 7. Voice and AI | `voice`, `ai` |
| 8. The server | `performance`, `messages`, `web`, `network`, `updates`, `reload`, `restart`, `debug` |

Every setting kept its name, so nothing in an older config is lost: the next update moves your settings into the new layout by itself. A switch you've changed on one bot in its menu beats the config for that bot.

### Updating

Don't delete your config when you update. FightBot notices it came from an older version and builds a fresh one with any new options. It carries across every setting that still exists, and keeps the old file in `old-configs/`. The console says how many settings it kept, and lists new options and any it left out.

### Handy settings

| Setting | Default | What it does |
|---|---|---|
| `max-health` | `20.0` | Bot health in HP. 20 is a real player's 10 hearts. |
| `max-move-speed` | `0.28` | Top speed. |
| `crit-chance` | `0.30` | Chance of a critical hit. |
| `combat.fight-back.players` / `.bots` / `.mobs` | `true` | Fighting back, as above. |
| `combat.shield-use` | `75` | How often a bot puts its shield up between its own swings, in % (0 to 100). See [Shields](#shields). |
| `combat.mace-shield-swap` | `false` | A totem in its offhand and a shield in its pack: the shield comes out for a mace dive. See [Mace](#mace). |
| `combat.mace-dodge` | `100` | How hard bots try to get out from under a mace dive, in % (0 to 400). The shield is left as it is. See [Mace](#mace). |
| `identity.skin-from-name` | `true` | A bot you name after a real account wears that account's skin. See [A name you type](#a-name-you-type). |
| `performance.mob-spawning` | `false` | Mobs spawning round a bot on its own. See [Performance](#performance). |
| `performance.view-distance` / `simulation-distance` | `4` / `3` | Chunks kept loaded, and kept running, round each bot. `server`: the same as players. |
| `performance.locator-bar` | `false` | Bots on players' locator bars (1.21.6+), so players can hunt them. One bot: **On the locator bar** in its menu. |
| `rtp.radius` | `1000` | How far from a world's spawn `/fb rtp` sends bots, in blocks. See [Spawning and managing bots](#spawning-and-managing-bots). |
| `control.go-back` / `stop-hands-back` | `true` / `true` | After `/fb control`, you go back to your spot; `/fb stop` hands a bot you control back. See [Controlling a bot](#controlling-a-bot). |
| `control.voice` | `true` | With Simple Voice Chat, your voice comes out of the bot you're controlling. |
| `restart.wait-for-world` / `missing-world` / `save-every-seconds` | `120` / `spawn` / `60` | After a restart: how long a bot waits for its world to load, what then (`spawn`, `remove` or `wait`), and how often the bots are written down meanwhile. See [Server restarts](#server-restarts). |
| `restart.hold-in-place-seconds` | `10` | After a restart, how long a bot that's been brought back stays where FightBot put it, whatever other plugins do. `0`: off. |
| `performance.rest-when-idle` | `true` | A bot with nothing to do is checked twice a second instead of twenty times. |
| `performance.quiet-steps` | `true` | A bot no player is within 24 blocks of makes no footstep sounds, and in a crowd the 16 bots nearest each player make them. |
| `performance.unseen-roamers-rest` | `true` | A free roamer no player can see stands about until someone comes (6.4.8). |
| `performance.max-visible-bots` | `0` | The most bots each player is sent, nearest first. `0`: all of them. For players whose game slows down in a crowd. See [Performance](#performance). |
| `combat.use-pearls`, `use-cobwebs`, `use-shield`, `use-axe-swap`, `use-water-bucket` | `true` | Which tricks bots use. Each is also a switch in a bot's own settings. |
| `combat.pearl-away-distance` | `0` | How far a bot pearls to get away, in blocks (4 to 35), never over a wall. `0`: a full-strength throw. See [Ender pearls](#ender-pearls). |
| `orders.bots-in-player-names` | `false` | Tab offers only real players as plain names (in `/fb fight`, `look`, `tp`, `march` and the rest); bots come after `--bot`. `true`: bots with the players too. |
| `orders.spawn-apart` | `false` | `/fb spawn` puts a bot exactly where you stand. `true`: a new bot, or batch, spreads out round the bots already there (how it was before 6.4.5). |
| `messages.staff-notices` | `true` | FightBot tells staff in chat when something happens by itself (a bot kicked, an update out...). `false`: console only, for scripted or recorded servers. |
| `messages.author-notice` | `true` | When Funnyfam14, FightBot's author, joins, he's told privately that the server runs FightBot: the version, how many bots there are and any update waiting. Nobody else sees it, it gives no permissions and nothing leaves the server. `false` to turn it off. |
| `combat.wait-for-charge` | `true` | Bots wait for their weapon to charge before they swing. |
| `combat.axe.crit-chance` | `0.80` | How often a bot jumps for a crit with an axe. |
| `combat.miss-chance` | `0.08` | How often a swing misses, mostly at the edge of reach. |
| `combat.reaction.min-ticks` / `max-ticks` | `3` / `7` | How long a bot takes to react to someone stepping into reach. |
| `mace.enabled` | `true` | Mace combat: wind jumps, pearl launches and elytra dives. See [Mace](#mace). |
| `combat.first-hit-cap` | `50` | The hit that starts a fight takes at most this % of a bot's health. `100`: off. See [Fighting back](#fighting-back). |
| `combat.damage-percent` | `100` | How hard bots hit, as a % of the same hit from a player (10 to 200). See [Fighting back](#fighting-back). |
| `mace.damage-percent` | `100` | The same for mace hits only, on top of `combat.damage-percent`. |
| `recording.max-seconds` / `fight-back` | `600` / `false` | The longest recording, and whether a bot acting one out fights back. See [Recording and replaying](#recording-and-replaying). |
| `recording.at-end` | `walk-back` | After a replay: `walk-back` to where it starts, `teleport-back`, or `stay` where it ends. |
| `anticheat.npc-tag` | `auto` | The NPC tag on bots: `auto` when an anticheat is installed, `true` always, `false` never. See [Other plugins](#other-plugins). |
| `combat.one-hit-players` | `[]` | Player names any bot kills in one hit, whatever the weapon. See [Fighting back](#fighting-back). |
| `combat.mace-defence` | `true` | Bots do something about a mace coming down on them: a shield, out of the way, or a pearl away. See [Mace](#mace). |
| `mace.how-often` | `100` | How keen bots are on the mace moves. `50` is half as often, `200` twice (10 to 400). |
| `mace.elytra-combo` | `true` | After a Wind Burst smash: the elytra back on, a rocket, and another dive. See [Mace](#mace). |
| `spear.lunge` | `true` | With Lunge on the spear: dashing in from a few blocks off, and out when losing. See [Spears](#spears). |
| `spear.elytra-charge` | `true` | Spear charges from the elytra (needs `elytra.enabled` too). See [Spears](#spears). |
| `movement.sprint-jump` | `true` | Sprint-jumping to close a gap to someone it's fighting or hunting (12 blocks or more, or running from it), and crits off the jump. See [Moving like a player](#moving-like-a-player). |
| `movement.jump-gaps` | `true` | Jumping gaps up to 3 blocks wide instead of placing blocks. |
| `movement.gap-blocks` | `true` | Crossing gaps of 4 to 12 blocks by placing blocks, while after a target. |
| `cart.enabled` / `cooldown` | `true` / `3` | Cart PvP, and the least seconds between carts. See [Cart PvP](#cart-pvp). |
| `crystal.enabled` | `true` | Crystal PvP. See [Crystal PvP](#crystal-pvp). |
| `crystal.per-second` | `8` | Crystals placed and set off a second (1 to 20). Fast-crystal servers suit 8 and up. |
| `crystal.range` | `5` | How close its target must be for crystals (3 to 8). |
| `crystal.max-self-damage` | `10` | The most health one crystal may cost the bot (after armour), unless it would finish its target. |
| `formation.march.width` / `gap` | `3` / `1` | Marching rows: bots across (`/fb formation width` in game), and the gap behind you. See [Marching and surrounding](#marching-and-surrounding). |
| `formation.march.widen` | `true` | A crowd marches wider than `width`, so it isn't a long thin line. |
| `formation.surround.radius` | `0` | `0`: the ring grows with the bots. Or a fixed radius. |
| `roaming.stop-at-points` | `true` | Route walkers stop at each point. `false`: straight on through, turning as they go. |
| `orders.must-stop-first` | `true` | A busy bot turns down a new order until it's stopped. `false`: new orders take over. |
| `gear.mending-throw-speed` / `mending-throw-angle` | `0.5` / `45` | How hard and how far down bots throw XP bottles. See [Wear and mending](#wear-and-mending). |
| `gear.repair-after-fight-seconds` | `30` | How long after a fight a bot standing about gets its gear back to full. |
| `gear.durability` | `true` | Bots' gear wears down like a player's. `false`: it never wears (6.4.9: the game's own wear is stopped too). |
| `potions.health-threshold` / `cooldown-seconds` | `80` / `2` | Below this % of its health a bot splashes healing; the least time between two of its potions. See [Potions](#potions). |
| `death.drop-items` | `auto` | What a bot drops when it dies: `auto` (like a player), `always` or `never`. One bot: **Drops items** in its menu. |
| `death.hardcore` | `false` | A bot that dies stays in the game as a spectator. See [Hardcore](#hardcore-dead-bots-stay-as-spectators). |
| `voice.enabled` | `true` | Bots in voice chat, when Simple Voice Chat is on the server. |
| `web.enabled` | `true` | The web editor (`/fb web`). |
| `building.pillar` | `true` | Pillaring up to reach you. |
| `building.bridge` | `false` | Bridging gaps and water. |
| `building.only-own-blocks` | `kit` | Build only with blocks the bot carries. See [Building](#building). |
| `cobwebs.how-often` / `cooldown-seconds` | `100` / `2` | How much bots use cobwebs. See [Cobwebs](#cobwebs). |
| `formation.march.look-angle` / `look-up` | `45` / `10` | Marching eyes left or right: how far round and up. |
| `joining.enabled` | `false` | Bots join the server by themselves, like players. See [Bots that join by themselves](#bots-that-join-by-themselves). |
| `mining.enabled` | `false` | Breaking blocks in the way with a pickaxe. |
| `head-movement.natural` | `false` | In a fight, `true` turns the head at a person's pace, with a little aim drift. `false` is the quick, sure aim: a quick player's turn, right round in about a third of a second (6.4.8), never a one-frame snap. Outside a fight bots always turn at a person's pace (6.4.6). |
| `debug.include.plugins` / `tps` | `true` / `true` | What a debug log records about your server besides the bots: your plugins, and your TPS and tick times, with what each freeze was spent on (6.4.9). `false` leaves them out (6.4.7). |
| `head-movement.idle-glance` | `true` | A bot with nothing to do glances about now and then, or at someone close by. See [Where a bot looks](#where-a-bot-looks). |
| `ping.enabled` | `true` | A realistic, wandering ping in the tab list. |
| `death.leave-message` / `sound` | `true` | The "left the game" line when a bot dies (sent like a player's) and the death boom. |
| `reload.keep-bots` | `true` | Bots come back after a plugin reload, doing what they were. |
| `restart.keep-bots` / `max-bots` | `true` / `100` | Bots come back after a server restart, where they stood. See [Server restarts](#server-restarts). |
| `luckperms.enabled` / `group` | `true` / `""` | LuckPerms data for bots, and a group for every bot. |
| `updates.check` / `download` / `betas` | `true` / `true` / `false` | Update checks, as above. |
| `network.enabled` | `auto` | The link to FightBot on a Velocity or BungeeCord proxy. `auto` only runs behind a proxy. See [Networks](#networks-velocity-and-bungeecord). |
| `network.share-kits` / `share-saves` | `false` / `false` | The same kits and saves on every server that shares them. |
| `network.share-skins` / `share-voice` | `false` / `false` | The same skins and voice lines on every server that shares them. |

### Performance

To the server a bot is a real player, and the server does a lot for every player that a bot has no use for. From 6.1.0 FightBot switches those things off for bots, which is most of what a crowd of them used to cost. The `performance` section of the config sets each one, and `/fb reload` applies a change to the bots already in the game.

| Setting | Default | What it does |
|---|---|---|
| `performance.mob-spawning` | `false` | Mobs spawn round players, and every player lets more spawn. `false`: mobs don't spawn round a bot on its own, so fifty bots don't fill the caves under them with monsters. They still spawn round real players. |
| `performance.view-distance` | `4` | How far round each bot the world stays loaded, in chunks (2 to 32, or `server` for the same as players). A player needs this for what they see; a bot only needs the ground near it. Never more than the server's own. |
| `performance.simulation-distance` | `3` | How far round each bot the world keeps running: mobs moving, crops growing (2 to 32, or `server`). |
| `performance.locator-bar` | `false` | The locator bar (1.21.6 and newer) shows where other players are. The server works it out again for every player each time anyone moves, so a crowd of bots costs a lot. `false`: bots aren't on it. `true` shows them, at that cost. |
| `performance.rest-when-idle` | `true` | A bot with nothing to do (standing still, unhurt, no orders, in its place if it's in a formation) is checked twice a second instead of twenty times. It wakes the moment it's hit, pushed or given something to do, and a formation steps off together when its leader moves. |
| `performance.unseen-roamers-rest` | `true` | A bot roaming about freely that no player is near enough to see (the server's tracking range for players, at least 64 blocks) stands about until someone comes, and then rests like any idle bot (6.4.8). Roaming bots standing about where a player could see them rest too. Off: roamers wander about whether anyone's there or not. |
| `performance.quiet-steps` | `true` | A bot no player is within 24 blocks of makes no footstep sounds. For every step a player takes, the server goes through everyone online to see who should hear it, so an army walking together spent a lot of each tick on sounds nobody heard. With a crowd round a player, the 16 bots nearest them make the footsteps: a game can't play hundreds a second anyway. |
| `performance.max-visible-bots` | `0` | The most bots each player is sent: the ones nearest them (20 or more). `0`: all of them. See [Low FPS in a crowd](#low-fps-in-a-crowd). |

FightBot also does these for every bot, with no setting:
- Bots aren't sent what's around them (they have no screen), so the server doesn't work out and send every nearby entity's movement to them.
- Bots' player data isn't saved, so nothing is written to disk when one dies or leaves. FightBot cleared those files anyway.
- Bots don't count for sleeping, so they never stop real players skipping the night.

Mob spawning, view distance, simulation distance and "sent nothing" need Paper or Purpur. On Spigot the rest still apply.

**On our test servers** (the same test on 6.0.21 and 6.1.0):

| Test | 6.0.21 | 6.1.0 |
|---|---|---|
| 50 bots fighting, 26.2 | 8.1 ms a tick | 5.0 ms |
| 100 bots standing idle, 26.2 | 5.6 ms | 2.9 ms |
| 50 bots fighting, 1.21.4 | 7.0 ms | 5.5 ms |
| 100 bots standing idle, 1.21.4 | 5.4 ms | 2.8 ms |
| 50 idle bots on a survival world at night (view distance 10), 26.2 | 8.1 ms, 1016 chunks loaded | 5.4 ms, 421 chunks loaded |

A tick has 50 ms before the server drops below 20 TPS. Your numbers depend on your machine, your world and your other plugins.

**Roaming crowds (6.4.8).** A bot walking about costs about the same as a player walking about. Most of that is the game moving it (collisions, physics, telling the players near it), not FightBot. On our test server 200 bots roaming round a player took about 12 ms a tick, so TPS stays at 20. Roamers nobody can see now cost almost nothing, roamers standing about rest, and a big crowd spreads out instead of piling into each other. Your server's numbers depend on its CPU: a debug log (`/fb debug on`, then `/fb debug off`) shows FightBot's share of each tick against the whole tick.

**Big fights (6.4.9).** In a 125-against-125 group fight on our test server, an average tick went from 57 ms on 6.4.8 to 49 ms, and the slowest one in ten from 100 to 75 ms. Most of what's left is the game itself moving the bots and working out their hits, the same work it does for players. Bots now read their potions properly, play each hurt sound once, wear their gear down once, and look through their packs less often. Writing the bots down for a restart (`restart.save-every-seconds`) no longer pauses the server every minute.

**A very big crowd.** A thousand bots work, but a thousand in one place cost more than a thousand spread out. For every player the server looks at every other player near it, each tick, to decide who can see whom and what should stay awake. That work grows with the square of the crowd, it is the server's own, and no plugin can switch it off. On our test server 1000 bots standing together took about 40 ms a tick and 1000 marching about 75 ms (about 86 ms before 6.1.1), where 300 marching took 7 ms. If a crowd that size lags, split it: two armies of 500 a few hundred blocks apart cost less than one of 1000.

### Low FPS in a crowd

How fast the server runs (TPS) and how fast a player's game draws (FPS) are two different things. A player's game has to draw every bot it's sent, with its armour, what it holds and its name tag, so a few hundred bots on screen slow that game down however fast the server is. A few hundred real players would do the same. Three things help:

- **`performance.max-visible-bots`** (off by default). Each player is only sent the bots nearest them, and the rest as they come closer. With `150`, a player in a crowd of 1000 gets 150. The other bots still fight, march and count; that player just isn't sent them, and they're off that player's tab list until they're near. On our test server a player beside 200 fighting bots was sent about 9,200 packets a second with every bot shown, and about 3,400 with a limit of 50. Leave it at `0` when you're filming a big army and want every bot in the shot.
- **The player's own Video Settings:** Entity Distance down, Entity Shadows off, Particles on Minimal.
- **Performance mods in the player's game** help too: Sodium, Entity Culling and ImmediatelyFast.

We can measure what a player's game is sent, not the frame rate on your players' machines, so try a limit and see what it does for them.

A slow moment when a lot of bots spawn is the same thing: every new bot is a player the game has to set up. From 6.1.1 a big spawn arrives a few bots each tick, which spreads it out.

### Building

Building is always a last resort. A bot looks for stairs, slopes and ways round first.

- **Pillaring** (on by default): when you're above it and there's no way up, it crouches, jumps and places blocks under itself until it's level with you.
- **Stuck down a pit or below a ledge:** it gets out the way you would. It throws an ender pearl up onto your level (landing on top of a block, not against the side), throws a wind charge under its feet, or walks to the side nearest you and builds up against it.
- **Under an overhang (6.4.5):** a bot below a ledge it can't jump up walks out from under the roof to open sky, then builds up from there, instead of jumping into the ceiling.
- **After a teleport (6.4.5)** a bot forgets where it was stuck, so steps right in front of it are walked up, not pillared.
- **Bridging** (off by default): when there's a gap or water in the way and no way round, it bridges across the way a player does: it turns round, crouches, looks down behind it and backs out over the edge, placing blocks. On the far side it stands up and turns back round. Each bridge is a little different, like a player's: its own slightly-off angle, eased head turns and an uneven pace (6.4.5).
- **Gaps while chasing** (`movement.gap-blocks`, on): see [Moving like a player](#moving-like-a-player).

**Only its own blocks** (`building.only-own-blocks`): a player can only build with blocks they're carrying, and bots can be the same. They use up the blocks they carry, and with none, they don't pillar, bridge or build over gaps; they go round or wait. Blocks given with `/give` (or by another plugin) go into its pack and count (6.4.7). Any full solid block works (not obsidian, TNT, or sand and gravel, which fall).

| Value | What it does |
|---|---|
| `kit` (default) | Once a bot has been given anything (a kit, gear), it only builds with blocks it carries. A bot with an empty inventory builds as it always has. |
| `true` | Always. A bot carrying nothing builds nothing. |
| `false` | Never. Bots build without carrying blocks. |

`building.blocks` lists what they build with (or prefer, carrying several). Each bot picks one when it spawns.

## Problems and answers

**Bots lag my server.**
Update to the newest version: 6.1.0 made bots cost a fifth to a third less in a fight, about half as much standing idle, and keep far less of a survival world loaded, and 6.4.9 took another seventh off big fights (see [Performance](#performance)). If you changed the `performance` settings, put them back to the defaults. Then check the rest:
- **Debug logging** (`/fb debug off`) should be off unless you're recording a log for us.
- **Mobs:** a bot is a player to them, and they attack it. With `performance.mob-spawning: false` they don't spawn round bots, but they still spawn round you.
- **How many bots are fighting at once** matters most. A bot standing in a formation costs a fraction of one in a fight.
- **Slow to spawn?** Every bot is a real player, so plugins that do something when a player joins do it for every bot too: a skin plugin looking the name up online, a join message, a database. From 6.4.5 the console says once when that makes spawning slow. A [debug log](#still-stuck-send-a-debug-log) lists every plugin with code that runs on join and how long the last spawn took, and from 6.4.9 every freeze names the plugin the server was busy in. The console says it too, once for each plugin. If the same freezes happen when a real player joins with no bots on, the plugin is slow for everyone; the bots just join more often. Scenes also load a few bots a tick now, so a big one doesn't freeze the server.
- **Freezes?** From 6.4.9 a [debug log](#still-stuck-send-a-debug-log) names what the server was busy with in every freeze, plugin by plugin, and a TIME line each minute shares out its time between the server, the bots, FightBot and each of your plugins.
- Still slow? Run `/spark profiler start`, play for a minute, `/spark profiler stop`, and send us the link with a [debug log](#still-stuck-send-a-debug-log).

**My FPS drops when there are lots of bots.**
That's your game drawing them, not the server. Set `performance.max-visible-bots` (try `150`), and in your own game turn Entity Distance down, Entity Shadows off and Particles to Minimal. See [Low FPS in a crowd](#low-fps-in-a-crowd).

**My game crashes when a bot is near (with CPM on the server).**
That's the Simple Voice Chat and Customizable Player Models mods together (Minecraft 26.3): Voice Chat crashes drawing its icon above someone. From 6.0.1, with CPM on the server, bots never show an icon and stay quiet (`identity.models.voice-safe`), so update FightBot. A real player can still set it off; that's for the mods to fix.

**Bots stopped talking and answering.**
CPM is on your server, so bots stay quiet: that keeps the Voice Chat and CPM mods from crashing players' games. `/fb vc` says so. Once both mods have fixed it, set `identity.models.voice-safe: false`.

**A bot doesn't answer when I talk to it.**
Type `/fb ai watch`, then talk to it again. No *hearing you* at all: voice chat isn't sending your voice, so check your microphone in Voice Chat's settings. Otherwise it says why: not facing a bot that can answer, the bot is deafened, CPM is on the server (bots stay quiet), the chat's over, or an error from the AI company. `/fb ai` shows whether it's listening at all.

**The AI says Groq wants the terms accepted.**
On console.groq.com, open the Playground, pick `canopylabs/orpheus-v1-english` and accept its terms. FightBot tries again by itself every 2 minutes.

**My `.cpmproject` file does nothing.**
It's the CPM editor's save file, not a model. Export it as a model first. See [Player models](#player-models).

**Emotes or models don't show.**
You need the mod in your own game, as well as the plugin on the server. If the console says *"Client doesn't support emotes"* when you join, Emotecraft in your game didn't connect - usually your game is on a different Minecraft version than the server.

**The skin signing service is "busy", or asked FightBot to wait.**
That's normal. FightBot waits and carries on by itself. `/fb skins` shows progress. See [About signing](#about-signing-the-wait-messages).

**"Found names" isn't going up, or nothing shows in the console.**
- It only looks **while nobody is on the server** (bots don't count). `/fb skins` says who it's waiting for. To keep looking with players on, set `identity.find-skins.only-when-empty: false`.
- It's slow on purpose, to stay inside Mojang's limits: at most one name every 10 seconds, so give it a few minutes.
- Hiding the player count in the server list ("???") doesn't affect it.

**Bot names look weird or fake.**
Fixed in 5.20.4: made-up names look like real players' names (`jake2011`, `SleepyPanda`, `itz_ava`). Want your own? Set `identity.name-source: file` and list them in `botnames.yml`.

**"No skin for 'TongZesu': no Minecraft account has that name."**
Fixed in 5.20.3. TongZesu was one of FightBot's built-in skins, and that account no longer exists. Nothing was wrong with your config.

**Bots look like Steve.**
Type `/fb skins`. It tells you what's missing. The usual causes:
- `skin-source` is `none`
- the skins folder is empty
- `skin-names` is empty
- the skins are still signing

**A bot never uses crystals.**
It needs end crystals, obsidian (or obsidian or bedrock nearby) and a target within `crystal.range`. It also only places a crystal that hurts its target more than itself: with no armour, every crystal would cost it too much, so it doesn't crystal. Give it armour (Blast Protection helps) and totems. Check **Crystal PvP** in its settings and `crystal.enabled`.

**A bot never uses carts.**
It needs TNT minecarts, rails, arrows, and a bow or crossbow, plus flint and steel unless the bow has Flame (cobwebs help). It starts from about 3 to 5 blocks off, with room for a rail beside its target. It doesn't try in the rain, since rain puts burning arrows out. Check **Cart PvP** in its settings and `cart.enabled`.

**Bots spawned near the world spawn instead of where I said (1.20.5 to 1.21.x).**
Fixed in 6.0.10: bots appear exactly where they're spawned.

**A server won't link to the proxy.**
Type `/fb network` on that server. It says why. The usual causes:
- FightBot isn't in the proxy's `plugins` folder yet
- BungeeCord: `network.secret` isn't set (see [Setting it up](#setting-it-up))
- the proxy is on another machine: set `network.proxy`
- the proxy can't tell which server it is: set `network.server-name` to its name in the proxy's config

**A command block stopped spawning bots.**
FightBot stopped it for spawning too many bots too fast. Ops were told which one. Run `/fb reload` to let it spawn again. See [Command blocks](#command-blocks).

**I can't hit a bot right after it teleports or pearls.**
Fixed in 5.17.2: bots can be hit the moment they arrive, like players.

**Bots crit me while walking, or hit me the instant I'm in reach.**
Fixed in 5.17.2: bots only crit when they jump and fall, like you, and take a moment to react. See [How bots swing](#how-bots-swing).

**A dead bot didn't drop its armour.**
Fixed in 5.17.2: bots drop everything they had, like a player, unless the world keeps inventories (`death.drop-items` changes that).

**A bot fighting me stopped at the edge of a drop.**
Fixed in 5.17.4: when you're on a lower step, past a 3-block drop, the bot jumps down after you. From 6.1.0 it also crosses a dip when you're level with it or higher on the far side: it waits a moment, hops down if the fall is safe, and climbs up to you. If one still stops, turn on `/fb debug on` and send the log from `plugins/FightBot/debug/`.

**Bots fall into the void while bridging, or push each other off.**
Update to 6.4.5. A bot no longer steps, drifts or gets pushed off an edge where the fall would kill it, and it bridges all the way across a gap over the void instead of jumping. Bots also bridge over water pouring off a ledge instead of walking off into it.

**A bot is stuck under a ledge, jumping and crouching.**
Update to 6.4.5: it walks out from under the overhang to open sky and builds up from there. A bot you teleport also forgets where it was stuck, so it walks up steps instead of pillaring.

**`/fb fight` says a player isn't online, but they are.**
They're probably nicked. From 6.4.5 every command finds a player by their nickname too, as long as no other player has the same one. From 6.4.8 that includes nicks that change the player's own name, like Scripted Solutions' nicks.

**Bots spawn a block or two away from where I'm standing.**
From 6.4.5 `/fb spawn` puts each bot exactly where you stand. Before, a new bot moved away from bots already there. Want that back? `orders.spawn-apart: true`.

**Bots leave their water behind.**
Update to 6.4.5: a bot goes back for its water within 16 blocks, and a bot that dies or is removed takes its water with it.

**Bots hop up and down when they march along a path.**
Update to 6.4.6. A dirt path sits a pixel lower than grass, and bots took the next path block for a step to jump. Now they walk it, like a player.

**Bots sprint-jump the whole time.**
Update to 6.4.6: they only sprint-jump to close a gap to someone they're fighting or hunting: 12 blocks or more, or someone running from them, plus the odd jump in for a crit. Marching, guarding and roaming bots never do. `movement.sprint-jump: false` turns it off.

**Bots won't bridge across the void.**
Update to 6.4.7, and check two things: `building.bridge: true` (it's off at first), and blocks to build with. A bot that's been given a kit only builds with blocks it carries; from 6.4.7 blocks you give it with `/give` count too. `/fb debug on` says why a bot at the edge isn't bridging.

**Bots stop at the edge of a path or bridge across the void.**
Update to 6.4.7. A bot after someone more than 40 blocks away never worked out a route, and walked straight at them; now it follows the path. Orders to a lot of bots also used to leave most of them without a route.

**A bot fighting a crowd spins round and walks backwards.**
Update to 6.4.7. It backs off away from all of them now and keeps going that way, keeps at one enemy instead of turning to whoever's nearest, and runs forwards. Surrounded, it stands its ground.

**Idle bots move their heads.**
That's the glance from 6.4.6, so a crowd doesn't stand like statues. Bots always come back the way they were placed. `head-movement.idle-glance: false` keeps them still, and so does `/fb look`.

**Marching or surrounding bots teleport to me.**
Fixed in 6.4.8. They always walk to their place now, however far behind they are. On a laggy server, half a march used to jump to a leader who had got ahead. To have far-off bots brought to you again, set `formation.teleport-distance` to a number (16 or more).

**Bots with pickaxes stand stuck behind a wall.**
From 6.4.8 a bot carrying a pickaxe digs through to whoever it's after when there's no way to walk there, and mining is on by default. Check `mining.enabled` and the bot's own **Mining** switch, and that a protection plugin isn't stopping it (the debug log says so).

**Free roamers walk into walls, or a crowd of roamers lags.**
Better in 6.4.8. Roamers pick open spots they can walk to, a crowd spreads out over more ground, and roamers nobody can see stand still and cost almost nothing (`performance.unseen-roamers-rest`). See [Roaming](#roaming).

**A group I send free roaming follows one leader.**
That's a squad. Add `apart` (`/fb roamingfree --group army apart`), or set `roaming.free-apart: true` so a group always spreads out (6.4.8).

**Bots on a route go stop, go, stop, go.**
Fixed in 6.4.8, with `roaming.stop-at-points: false`. A bot now turns for the next point the moment it reaches one.

**A patrol from the groups menu doesn't go after anyone.**
Its route had no targets. From 6.4.8 the route's targets screen opens straight after, so you can pick who they patrol for.

**A bot is stuck in a hole.**
From 6.1.0 a bot in a hole it can't jump out of builds a block or two under itself and climbs out, or pearls out. It needs **Pillaring** on (`building.pillar`, and the switch in its settings menu) and, with `building.only-own-blocks` on, blocks in its pack.

**Bots following me wander off.**
Fixed in 6.1.0. Marching bots keeping pace behind a walking player were wrongly counted as stuck every two seconds and sent round by another way.

**A big march trails off in a long thin line, and bots jump about when I turn.**
Fixed in 6.1.1. A crowd now marches wider (1000 bots: 23 across instead of 3), and a bot at the back walks round a turn instead of being moved to its new place. See [Marching and surrounding](#marching-and-surrounding).

**Bots following me suffocated in a wall.**
Fixed in 6.1.1. A bot brought to its place is put in the middle of a block of open ground, never against the side of a hill, and one that does end up inside a block steps straight out of it.

**Bots pile up on me, or fall out of the sky, when I fly.**
Fixed in 6.1.1. With the player they follow in the air, bots keep their places on the ground underneath.

**Mobs kill my bots while they stand there.**
From 6.1.0 bots hit back at mobs that attack them (`combat.fight-back.mobs`), and mobs no longer spawn round a bot on its own (`performance.mob-spawning`).

**Bots don't talk.**
Type `/fb vc`. Simple Voice Chat has to be on the server, and only bots that "talk" say anything. FightBot's own lines come with updates; your own files only play when someone types `/fb vc <name>`.

**Bots won't hurt anyone.**
FightBot tells you why in chat, and how to fix it on your version. Usually PvP is off, you're in creative, or a plugin such as WorldGuard blocks PvP there.

**"X left the game" shows twice (or more) when a bot dies.**
Fixed in 5.20.2: a bot that dies leaves once, the way a player does. You get one "left the game", or none with `death.leave-message: false`, and plugins that change or hide leave messages treat it like a player's. This includes servers with a plugin that kicks players when they die.

**Bots stop at a river.**
Fixed in 5.16.8: bots going after someone swim across. Free roamers stay on dry land on purpose.

**After a plugin reload, bots stood about doing nothing, or "name is already taken".**
Fixed in 5.16.8: see [Reloading FightBot](#reloading-fightbot-plugmanx-reload).

**A bot disappeared.**
It was killed, kicked or banned, and FightBot says which in chat. A name banned with `/ban` can't be spawned until `/pardon <name>`.

**I can't see a bot, but it's there (mobs go for it).**
Update to 6.3.2 or newer: before that, an invisibility potion on a bot never wore off. If it still happens, look in the console: from 6.4.3 FightBot says when a player can't see a bot right beside them because another plugin hid it, and names any vanish plugin that marked the bot vanished.

**A bot died "falling from a high place" when it was teleported.**
Fixed in 6.4.3. A bot teleported a long way down, from a tower to the ground or out of the Nether to a lower spot, was hurt as if it had fallen all that way. A teleport now starts its fall afresh, as it does for a player.

**On Spigot, a bot teleported far away was "not in the game" a moment later.**
Fixed in 6.4.3. The ground under it could unload, and Spigot counts a bot there as gone, so orders said "None of them are in the game." Its ground now goes with it when it's teleported.

**After a restart, bots didn't come back in the world they were in, or came back in the main world.**
Update to 6.4.4. In 6.4.3: on Spigot they didn't come back at all, and a bot in a world that a plugin loads a moment late (Multiverse, a world that resets) was left out; now it waits for that world. In 6.4.4: two kinds of plugin still moved them to the main world. One empties a world as the server stops; the other sends new players to spawn (EssentialsX, Multiverse's first spawn, a lobby plugin). FightBot now works round both, and the console names the plugin that tried. See [Server restarts](#server-restarts). Still happening? Run `/fb debug on`, restart, and send the [debug log](#still-stuck-send-a-debug-log).

**"'Name' is banned on this server."**
That name was banned, perhaps by a death-ban plugin. Run `/pardon <name>`, or use another name.

**The plugin loads, but bots won't spawn.**
Check the console at startup. FightBot says whether your server can run bots and, if not, why. You need Paper 1.20.5 or newer with the Paper build, or Spigot or CraftBukkit 26.1 or newer with FightBot for Spigot.

**A bot just stands there.**
It hasn't been told to fight anyone. Try `/fb fight <bot> <you>`, or hit it. If it's chasing but stuck, it can't reach you. Pillaring gets it up to you. For gaps and water, turn on bridging.

**Bots fight each other when I don't want them to.**
Set `combat.fight-back.bots: false`, or switch **Fights back: bots** off in a bot's menu.

**A bot's settings went back to normal.**
Settings belong to the bot, so they're lost when it dies or the server restarts. Put the setup in a save.

**Config changes did nothing.**
Run `/fb reload`. Health, speed and damage only apply to bots spawned after that. Also check the bot's own menu, because a changed switch there beats the config.

**A bot dropped its mace (or another item) in a fight, with drops off.**
Update to 6.4.4. With a full pack, swapping weapons mid-fight dropped the extra item. Now it waits on the bot and goes back in its pack when there's room. To have one bot drop nothing at all when it dies, turn off **Drops items** in its menu.

**Bots don't show on the locator bar.**
Update to 6.4.4; before, `performance.locator-bar: true` didn't actually put them on it. The locator bar needs 1.21.6 or newer.

### Still stuck? Send a debug log

```
/fb debug on
```

Make the problem happen, then run `/fb debug off`. That's all: it tells you which file to send, in `plugins/FightBot/debug/`. (`/fb debug` on its own shows whether it's on.) It only writes a file; nothing is sent anywhere.

The log has three parts (6.4.6):
- **At the start:** how your server stands as you turn it on: your FightBot, server and Java versions, TPS, every plugin, every world, every bot and what it's doing, and `config.yml` with keys, secrets and passwords hidden.
- **In between:** what each bot saw, chose and did, and why. Also every FightBot command, settings changed in `/fb settings`, bots changing world and who moved them, worlds loading, what's saved and brought back over a restart, scenes, and voice chat while you control a bot. Once a minute there's a line on the server's TPS and its longest pause, and a note whenever the server freezes for 300 ms or more. From 6.4.9 each freeze says what the server was busy with, by plugin, and what that plugin was doing (writing a file, waiting for the network, the database...). A **TIME** line each minute shares out the server's busy time: the server itself, the bots' bodies (the game's own movement and hits), FightBot's thinking, and each other plugin.
- **At the end:** the same snapshot again as you turn it off, how long the last spawn took, and everything FightBot said in the console while it was on. The end is written when the server stops, too.

**What it says about your server.** Besides the bots, the log has your plugin list and your TPS. Some servers keep those private: `debug.include.plugins: false` and `debug.include.tps: false` leave them out (6.4.7), and the top of the log says so. Read a log through before you send it anywhere.

`/fb debug report` from 6.4.4 and 6.4.5 is gone: it's all in the one log now. A `/fb reload` along the way doesn't stop the log (6.4.6); only changing `debug.enabled` in the config does.

More at [fightmc.xyz](https://www.fightmc.xyz)
