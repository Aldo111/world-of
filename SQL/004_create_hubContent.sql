-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2016 at 04:03 AM
-- Server version: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `worldof_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `hubContent`
--

CREATE TABLE `hubcontent` (
  `hub_id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `text` varchar(500) DEFAULT NULL,
  `ordering` int(255) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hubContent`
--

INSERT INTO `hubContent` (`hub_id`, `user_id`, `text`, `ordering`) VALUES
(1, 1, 'akljsdlkasmdkasd', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hubContent`
--
ALTER TABLE `hubContent`
  ADD PRIMARY KEY (`hub_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hubContent`
--
ALTER TABLE `hubContent`
  MODIFY `hub_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;