CREATE DATABASE `express_example` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `express_example`;


-- Table User
CREATE TABLE IF NOT EXISTS `user` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'user id',
  `username` varchar(32) NOT NULL COMMENT 'username',
  `password` varchar(64) NOT NULL COMMENT 'user password',
  `register_time` bigint(20) NOT NULL COMMENT 'user register timestamp',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `name` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


-- Table post
CREATE TABLE IF NOT EXISTS `post` (
  `pid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'post id',
  `title` varchar(50) NOT NULL COMMENT 'post title',
  `content` text COMMENT 'post content',
  `post_time` bigint(20) NOT NULL COMMENT 'post timestamp',
  `user_id` int(10) NOT NULL COMMENT 'post user id',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
