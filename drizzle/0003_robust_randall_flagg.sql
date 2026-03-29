CREATE TABLE `stakeholders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`photoUrl` text,
	`photoKey` varchar(255),
	`organization` varchar(255),
	`position` varchar(100),
	`stakeholderType` enum('investor','board_member','partner','sponsor','other') DEFAULT 'other',
	`bio` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stakeholders_id` PRIMARY KEY(`id`),
	CONSTRAINT `stakeholders_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','doctor','receptionist','user','patient','stakeholder') NOT NULL DEFAULT 'user';