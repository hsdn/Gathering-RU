module.exports = function Gathering(mod) {
	let mobid = [],
		gatherMarker = [];

	function gatheringStatus() {
		sendStatus("",
			"Модуль: " + (mod.settings.enabled     ? "вкл"   : "выкл"),
			"Предупреждающее сообщение: " + (mod.settings.sendToAlert  ? "вкл" : "выкл"),
			"Отображение растений: " + (mod.settings.plantsMarkers ? "вкл" : "выкл"),
			"Отображение руды: " + (mod.settings.miningMarkers ? "вкл" : "выкл"),
			"Отображение энергии: " + (mod.settings.energyMarkers ? "вкл" : "выкл")
		);
	}

	function sendStatus(msg) {
		sendMessage([...arguments].join('\n\t'));
	}

	mod.command.add("gat", (arg) => {
		if (!arg) {
			mod.settings.enabled = !mod.settings.enabled;
			if (!mod.settings.enabled) {
				for (let itemId of mobid) {
					despawnItem(itemId);
				}
			}
			gatheringStatus();
		} else {
			switch (arg) {
				case "alert":
					mod.settings.sendToAlert = !mod.settings.sendToAlert;
					sendMessage("Предупреждающее сообщение: " + (mod.settings.sendToAlert ? "вкл" : "выкл"));
					break
				case "status":
					gatheringStatus();
					break
				case "plants":
					mod.settings.plantsMarkers = !mod.settings.plantsMarkers;
					sendMessage("Отображение растений: " + (mod.settings.plantsMarkers ? "вкл" : "выкл"));
					break
				case "ore":
					mod.settings.miningMarkers = !mod.settings.miningMarkers;
					sendMessage("Отображение руды: " + (mod.settings.miningMarkers ? "вкл" : "выкл"));
					break
				case "energy":
					mod.settings.energyMarkers = !mod.settings.energyMarkers;
					sendMessage("Отображение энергии: " + (mod.settings.energyMarkers ? "вкл" : "выкл"));
					break
				default:
					sendStatus("",
						"gat, включение модуля",
						"gat alert, предупреждающее сообщение",
						"gat status, состояние модуля",
						"gat ore, включает отображение руды",
						"gat plants, включает отображение растений",
						"gat energy, включает отображение энергии"
					);
					break
			}
		}
	})

	mod.game.me.on('change_zone', (zone, quick) => {
		mobid = [];
	})

	mod.hook('S_SPAWN_COLLECTION', 4, (event) => {
		if (mod.settings.enabled) {
			if (mod.settings.plantsMarkers && (gatherMarker = mod.settings.plants.find(obj => obj.id === event.id))) {
				if (mod.settings.sendToAlert) {
					sendAlert( ("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg), 44);
					sendMessage("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg);
				}
			} else if (mod.settings.miningMarkers && (gatherMarker = mod.settings.mining.find(obj => obj.id === event.id))) {
				if (mod.settings.sendToAlert) {
					sendAlert( ("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg), 44);
					sendMessage("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg);
				}
			} else if (mod.settings.energyMarkers && (gatherMarker = mod.settings.energy.find(obj => obj.id === event.id))) {
				if (mod.settings.sendToAlert) {
					sendAlert( ("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg), 44);
					sendMessage("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg);
				}
			} else {
				return true;
			}

			spawnItem(event.gameId, event.loc);
			mobid.push(event.gameId);
		}
	})

	mod.hook('S_DESPAWN_COLLECTION', 2, (event) => {
		if (mobid.includes(event.gameId)) {
			gatherMarker = [];
			despawnItem(event.gameId);
			mobid.splice(mobid.indexOf(event.gameId), 1);
		}
	})

	function spawnItem(gameId, loc) {
		mod.send('S_SPAWN_DROPITEM', 8, {
			gameId: gameId*10n,
			loc: loc,
			item: 88704, // Памятная монета Велики
			amount: 1,
			expiry: 999999
		});
	}

	function despawnItem(gameId) {
		mod.send('S_DESPAWN_DROPITEM', 4, {
			gameId: gameId*10n
		});
	}
	
	function sendMessage(msg) { mod.command.message(msg) }

	function sendAlert(msg, type) {
		mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
			type: type,
			chat: false,
			channel: 0,
			message: msg,
		});
	}
}
