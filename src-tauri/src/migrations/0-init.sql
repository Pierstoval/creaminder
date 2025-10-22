CREATE TABLE `activities` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `description` TEXT NOT NULL,
    `date` VARCHAR(255) NOT NULL
);

INSERT INTO activities (id, description, `date`) VALUES
    (1, 'Test item', strftime('%Y-%m-%dT%H:%M:%S+0000', 'now'))
;
