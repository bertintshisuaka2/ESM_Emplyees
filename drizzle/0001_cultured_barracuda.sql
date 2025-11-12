CREATE TABLE `accidents` (
	`id` varchar(64) NOT NULL,
	`employeeId` varchar(64) NOT NULL,
	`accidentDate` timestamp NOT NULL,
	`location` varchar(300),
	`description` text NOT NULL,
	`severity` enum('minor','moderate','severe','critical') NOT NULL,
	`witnesses` text,
	`treatmentProvided` text,
	`reportedBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` varchar(64) NOT NULL,
	`employeeId` varchar(64) NOT NULL,
	`fileName` varchar(500) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileType` varchar(100),
	`category` enum('contract','certification','medical','identification','other') NOT NULL,
	`uploadedBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` varchar(64) NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`position` varchar(200),
	`department` varchar(200),
	`hireDate` timestamp,
	`salary` varchar(50),
	`address` text,
	`emergencyContact` text,
	`status` enum('active','inactive','terminated') NOT NULL DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
