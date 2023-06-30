CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`price` decimal(10,2),
	`storeId` int NOT NULL);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`userId` varchar(191) NOT NULL,
	`description` text,
	`slug` text,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3));
