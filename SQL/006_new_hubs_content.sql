-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 04, 2016 at 04:34 AM
-- Server version: 5.6.28
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `worldof_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `hubs_content`
--

DROP TABLE IF EXISTS `hubs_content`;
CREATE TABLE `hubs_content` (
  `id` int(255) NOT NULL,
  `hub_id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `text` varchar(500) DEFAULT NULL,
  `ordering` int(255) NOT NULL DEFAULT '1',
  `conditions` text,
  `linked_hub` int(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hubs_content`
--
ALTER TABLE `hubs_content`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hubs_content`
--
ALTER TABLE `hubs_content`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;