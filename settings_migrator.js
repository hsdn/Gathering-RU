const DefaultSettings = {
    "enabled": 		false,
    "sendToAlert":  true, // Предупреждающее сообщение
    "markerId":    98260, // Свечение 98260 ---Голова драколота
    "plants": [
        {id: 1, name: 'растения', msg: 'Кустарник'},
        {id: 2, name: 'растения', msg: 'Кукуруза'},
        {id: 3 ,name: 'растения', msg: 'Морковь'},
        {id: 4, name: 'растения', msg: 'Гриб'},
        {id: 5, name: 'растения', msg: 'Тыква'},
        {id: 6, name: 'растения', msg: 'Яблоня'}
    ],
    "mining": [
        {id: 101, name: 'руда', msg: 'Валун'},
        {id: 102, name: 'руда', msg: 'Кобаловая руда'},
        {id: 103, name: 'руда', msg: 'Шадметаллическая руда'},
        {id: 104, name: 'руда', msg: 'Зерметаллическая руда'},
        {id: 105, name: 'руда', msg: 'Норметаллическая руда'},
        {id: 106, name: 'руда', msg: 'Галенит'}
    ],
    "energy": [
        {id: 201, name: 'энергия', msg: 'Бесцветный кристал'},
        {id: 202, name: 'энергия', msg: 'Красный кристал'},
        {id: 203, name: 'энергия', msg: 'Зеленый кристал'},
        {id: 204, name: 'энергия', msg: 'Голубой кристал'},
        {id: 205, name: 'энергия', msg: 'Белый кристал'},
        {id: 206, name: 'энергия', msg: 'Зараженный цветок'}
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
