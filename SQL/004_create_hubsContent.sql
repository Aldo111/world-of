-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2016 at 07:15 AM
-- Server version: 5.7.14
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

CREATE TABLE `hubs_content` (
  `id` int(255) NOT NULL,
  `hub_id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `text` varchar(500) DEFAULT NULL,
  `ordering` int(255) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hubs_content`
--

INSERT INTO `hubs_content` (`id`, `hub_id`, `user_id`, `text`, `ordering`) VALUES
(2, 0, 1, 'akljsdlkasmdkasd', 1);

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
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;