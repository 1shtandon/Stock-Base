CREATE TABLE `user_table`
(
    `user_id`    int PRIMARY KEY AUTO_INCREMENT,
    `username`   varchar(255) UNIQUE,
    `password`   varchar(255) not null,
    `email`      varchar(255) UNIQUE,
    `age`        int          not null,
    `first_name` varchar(255) not null,
    `last_name`  varchar(255) not null
);

CREATE TABLE `admin_table`
(
    `admin_id` int PRIMARY KEY AUTO_INCREMENT,
    `username` varchar(255) UNIQUE,
    `password` varchar(255) not null,
    `email`    varchar(255) UNIQUE
);

CREATE TABLE `feedback_table`
(
    `feedback_id` int PRIMARY KEY AUTO_INCREMENT,
    `user_id`     int          not null,
    `title`       varchar(255) not null,
    `message`     text         not null
);

CREATE TABLE `transaction_table`
(
    `transaction_id` int PRIMARY KEY AUTO_INCREMENT,
    `instrumentId`   varchar(255) not null,
    `quantity`       int unsigned not null,
    `price`          double       not null,
    `user_id`        int          not null,
    `purchase_date`  date         not null
);

CREATE TABLE `stock_table`
(
    `instrumentId`  varchar(255) PRIMARY KEY not null,
    `prevClose`     double                   not null,
    `dayHigh`       double                   not null,
    `dayLow`        double                   not null,
    `high52weeks`   double                   not null,
    `low52weeks`    double                   not null,
    `dividendYield` double                   not null,
    `faceValue`     double                   not null,
    `bookValue`     double                   not null,
    `pros`          text                     not null,
    `cons`          text                     not null,
    `marketCap`     double                   not null,
    `price`         double                   not null,
    `PERatio`       double                   not null,
    `about`         text                     not null,
    `stockType`     ENUM ('NSE', 'BSE')      not null,
    `stockName`     varchar(255)             not null
);

CREATE TABLE `sessios_table`
(
    `user_id`     int          not null,
    `is_admin`    boolean      not null,
    `session_key` varchar(255) not null unique
);

ALTER TABLE `feedback_table`
    ADD FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);

ALTER TABLE `transaction_table`
    ADD FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`);

ALTER TABLE `transaction_table`
    ADD FOREIGN KEY (`instrumentId`) REFERENCES `stock_table` (`instrumentId`);