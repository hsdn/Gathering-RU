module.exports = function Gathering(mod) {
	let plantsMarkers = false,
		miningMarkers = false,
		energyMarkers = false
	
	let mobid = [],
		gatherMarker = []
	
	function gatheringStatus() {
		sendStatus(
			"Модуль: " + (mod.settings.enabled     ? "вкл"   : "выкл"),
			"Предупреждающее сообщение: " + (mod.settings.sendToAlert  ? "вкл" : "выкл"),
			
			"Отображение растений: " + (plantsMarkers ? "вкл" : "выкл"),
			"Отображение руды: " + (miningMarkers ? "вкл" : "выкл"),
			"Отображение энергии: " + (energyMarkers ? "вкл" : "выкл")
		)
	}
	
	function sendStatus(msg) {
		sendMessage([...arguments].join('\n\t - '))
	}
	
	mod.command.add("gat", (arg) => {
		if (!arg) {
			mod.settings.enabled = !mod.settings.enabled;
			if (!mod.settings.enabled) {
				plantsMarkers = false
				miningMarkers = false
				energyMarkers = false
				for (let itemId of mobid) {
					despawnItem(itemId)
				}
			}
			gatheringStatus()
		} else {
			switch (arg) {
				case "alert":
					mod.settings.sendToAlert = !mod.settings.sendToAlert
					sendMessage("Предупреждающее сообщение " + (mod.settings.sendToAlert ? "вкл" : "выкл"))
					break
				case "status":
					gatheringStatus()
					break
				
				case "plants":
					plantsMarkers = !plantsMarkers
					sendMessage("Отображение растений " + (plantsMarkers ? "вкл" : "выкл"))
					break
				case "ore":
					miningMarkers = !miningMarkers
					sendMessage("Отображение руды " + (miningMarkers ? "вкл" : "выкл"))
					break
				case "energy":
					energyMarkers = !energyMarkers
					sendMessage("Отображение энергии " + (energyMarkers ? "вкл" : "выкл"))
					break
				
				default :
					sendMessage("Неверный параметр!")
					break
			}
		}
	})
	
	mod.game.me.on('change_zone', (zone, quick) => {
		mobid = []
	})
	
	mod.hook('S_SPAWN_COLLECTION', 4, (event) => {
		if (mod.settings.enabled) {
			if (plantsMarkers && (gatherMarker = mod.settings.plants.find(obj => obj.id === event.id))) {
				sendAlert( ("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg), 44)
				sendMessage("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg)
			} else if (miningMarkers && (gatherMarker = mod.settings.mining.find(obj => obj.id === event.id))) {
				sendAlert( ("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg), 44)
				sendMessage("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg)
			} else if (energyMarkers && (gatherMarker = mod.settings.energy.find(obj => obj.id === event.id))) {
				sendAlert( ("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg), 44)
				sendMessage("Найдено [" + gatherMarker.name + "] " + gatherMarker.msg)
			} else {
				return true
			}
			
			spawnItem(event.gameId, event.loc)
			mobid.push(event.gameId)
		}
	})
	
	mod.hook('S_DESPAWN_COLLECTION', 2, (event) => {
		if (mobid.includes(event.gameId)) {
			gatherMarker = []
			despawnItem(event.gameId)
			mobid.splice(mobid.indexOf(event.gameId), 1)
		}
	})
	
	function spawnItem(gameId, loc) {
		mod.send('S_SPAWN_DROPITEM', 8, {
			gameId: gameId*10n,
			loc: loc,
			item: mod.settings.markerId,
			amount: 1,
			expiry: 999999
		})
	}
	
	function despawnItem(gameId) {
		mod.send('S_DESPAWN_DROPITEM', 4, {
			gameId: gameId*10n
		})
	}
	
	function sendMessage(msg) { mod.command.message(msg) }

	function sendAlert(msg, type) {
		mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
			type: type,
			chat: false,
			channel: 0,
			message: msg,
		})
	}	
}
