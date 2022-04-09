CREATE TABLE `user_table` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255) UNIQUE,
  `password` varchar(255),
  `email` varchar(255) UNIQUE,
  `age` int,
  `first_name` varchar(255),
  `last_name` varchar(255)
);

CREATE TABLE `admin_table` (
  `admin_id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255) UNIQUE,
  `password` varchar(255),
  `email` varchar(255) UNIQUE
);

CREATE TABLE `feedback_table` (
  `feedback_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `title` varchar(255),
  `message` text
);

CREATE TABLE `transaction_table` (
  `transaction_id` int PRIMARY KEY AUTO_INCREMENT,
  `instrument_id` varchar(255),
  `quantity` int,
  `price` double,
  `user_id` int,
  `purchase_date` date
);

CREATE TABLE `stock_table` (
  `instrument_id` varchar(255) PRIMARY KEY,
  `stock_type` ENUM ('NSE', 'BSE'),
  `stock_name` varchar(255),
  `prev_close` double,
  `currentPrice` double,
  `day_high` double,
  `day_low` double
);

CREATE TABLE `sessios_table` (
  `user_id` int,
  `is_admin` boolean,
  `session_key` varchar(255)
);

ALTER TABLE `feedback_table` ADD FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);

ALTER TABLE `transaction_table` ADD FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);

ALTER TABLE `transaction_table` ADD FOREIGN KEY (`instrument_id`) REFERENCES `stock_table` (`instrument_id`);