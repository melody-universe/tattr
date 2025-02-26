ALTER TABLE `users` RENAME COLUMN "login" TO "username";--> statement-breakpoint
DROP INDEX `users_login_unique`;--> statement-breakpoint
DROP INDEX `login_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `login_idx` ON `users` (`username`);