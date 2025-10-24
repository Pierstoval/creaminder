CREATE TABLE `activity_types` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT
);

CREATE TABLE `activities` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `description` TEXT NOT NULL,
    `date` VARCHAR(255) NOT NULL,
    `activity_type_id` INTEGER REFERENCES activity_types(id)
);

INSERT INTO activity_types (id, name, description) VALUES
    (1, 'Test', 'A basic test activity')
;

INSERT INTO activities (id, description, `date`, `activity_type_id`) VALUES
    (1, 'Test item', strftime('%Y-%m-%dT%H:%M:%S+0000', 'now'), 1)
;
