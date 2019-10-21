const DefaultSettings = {
    "enabled": 		false,
    "sendToAlert":  true, // Screen warning
    "markerId":    98260, // Light beam tips 98260 ---Vergos's Head
    "plants": [
        {id: 1, name: 'Special', msg: 'Harmony Grass'},
        {id: 2, name: 'Plants', msg: 'Wild Cobseed'},
        {id: 3 ,name: 'Plants', msg: 'Wild Veridia'},
        {id: 4, name: 'Plants', msg: 'Orange Mushroom'},
        {id: 5, name: 'Plants', msg: 'Moongourd'},
        {id: 6, name: 'Plants', msg: 'Apple Tree'}
    ],
    "mining": [
        {id: 101, name: 'Special', msg: 'Plain Stone'},
        {id: 102, name: 'Ore', msg: 'Cobala Ore'},
        {id: 103, name: 'Ore', msg: 'Shadmetal Ore'},
        {id: 104, name: 'Ore', msg: 'Xermetal Ore'},
        {id: 105, name: 'Ore', msg: 'Normetal Ore'},
        {id: 106, name: 'Ore', msg: 'Galborne Ore'}
    ],
    "energy": [
        {id: 201, name: 'Special', msg: 'Achromic Essence'},
        {id: 202, name: 'Essence', msg: 'Crimson Essence'},
        {id: 203, name: 'Essence', msg: 'Earth Essence'},
        {id: 204, name: 'Essence', msg: 'Azure Essence'},
        {id: 205, name: 'Essence', msg: 'Opal Essence'},
        {id: 206, name: 'Essence', msg: 'Obsidian Essence'}
    ]
};

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
        // Migrate from older version (using the new system) to latest one
        if (from_ver + 1 < to_ver) { // Recursively upgrade in one-version steps
            settings = MigrateSettings(from_ver, from_ver + 1, settings);
            return MigrateSettings(from_ver + 1, to_ver, settings);
        }
        // If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
        // a switch for each version step that upgrades to the next version. This enables us to
        // upgrade from any version to the latest version without additional effort!
        switch (to_ver) {
            default:
                let oldsettings = settings
                settings = Object.assign(DefaultSettings, {});
                for (let option in oldsettings) {
                    if (settings[option]) {
                        settings[option] = oldsettings[option]
                    }
                }
                break;
        }
        return settings;
    }
}
