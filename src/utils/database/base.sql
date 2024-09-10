CREATE TABLE IF NOT EXISTS `test-purposes` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL,
    `discord_id` TEXT UNIQUE NOT NULL,
    `updated` INTEGER DEFAULT (strftime('%s', 'now'))
);