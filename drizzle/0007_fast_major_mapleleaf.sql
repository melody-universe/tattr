CREATE TABLE `guests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`isBot` integer NOT NULL,
	`name` text NOT NULL
);
