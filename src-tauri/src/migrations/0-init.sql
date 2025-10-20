CREATE TABLE `activities` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `title` VARCHAR(255) NOT NULL
);

INSERT INTO activities (id, title) VALUES (1, 'Test item');
