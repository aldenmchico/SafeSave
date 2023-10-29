-- phpMyAdmin SQL Dump
-- version 5.2.1-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 18, 2023 at 01:16 AM
-- Server version: 10.6.15-MariaDB-log
-- PHP Version: 8.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone_2023_securepass1`
--

-- --------------------------------------------------------

--
-- Table structure for table `UserLoginItems`
--

CREATE TABLE `UserLoginItems` (
  `userLoginItemID` int(11) NOT NULL,
  `userLoginItemWebsite` varchar(145) NOT NULL,
  `userLoginItemUsername` varchar(145) NOT NULL,
  `userLoginItemPassword` varchar(145) NOT NULL,
  `userLoginItemDateCreated` date NOT NULL,
  `userLoginItemDateUpdated` date NOT NULL,
  `userLoginItemDateAccessed` date NOT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `UserLoginItems`
--

INSERT INTO `UserLoginItems` (`userLoginItemID`, `userLoginItemWebsite`, `userLoginItemUsername`, `userLoginItemPassword`, `userLoginItemDateCreated`, `userLoginItemDateUpdated`, `userLoginItemDateAccessed`, `userID`) VALUES
(1, 'oregonstate.edu', 'chicoa', 'chicoa_oregonstatepass1', '2023-10-18', '2023-10-18', '2023-10-18', 1),
(2, 'oregonstate.edu', 'songeu', 'songeu_oregonstatepass1', '2023-10-15', '2023-10-17', '2023-10-17', 2),
(3, 'facebook.com', 'aldenmchico@gmail.com', 'aldenfbpw', '2010-08-08', '2022-05-14', '2023-07-18', 1),
(4, 'reddit.com', 'starlord_xxx', 'austinredditPW', '2020-04-15', '2020-04-16', '2023-05-15', 4),
(5, 'google.com', 'seanmadden87@gmail.com', 'seangooglepassword', '2014-01-28', '2018-02-09', '2023-02-19', 3);

-- --------------------------------------------------------

--
-- Table structure for table `UserNotes`
--

CREATE TABLE `UserNotes` (
  `userNoteID` int(11) NOT NULL,
  `userNoteTitle` varchar(145) NOT NULL,
  `userNoteText` longtext DEFAULT NULL,
  `userNoteCreated` date NOT NULL,
  `userNoteUpdated` date NOT NULL,
  `userNoteAccessed` date NOT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `UserNotes`
--

INSERT INTO `UserNotes` (`userNoteID`, `userNoteTitle`, `userNoteText`, `userNoteCreated`, `userNoteUpdated`, `userNoteAccessed`, `userID`) VALUES
(1, 'Secret Note!', 'I <3 CS467 :)', '2023-10-18', '2023-10-18', '2023-10-18', 1),
(2, 'Hello World', 'This is a test.', '2015-07-05', '2018-10-14', '2019-01-04', 3),
(3, "Who\'s This?", 'Issa me, Mario!', '2016-08-14', '2017-09-09', '2020-10-10', 2),
(4, 'When Will This End?', 'Soon.', '2020-05-15', '2022-06-18', '2022-12-25', 2),
(5, 'Who Will Win the Superbowl?', 'LA Rams', '2023-10-18', '2023-10-18', '2023-10-18', 4);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `userID` int(11) NOT NULL,
  `userUsername` varchar(145) NOT NULL,
  `userEmail` varchar(145) NOT NULL,
  `userPassword` varchar(145) NOT NULL,
  `user2FAEnabled` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`userID`, `userUsername`, `userEmail`, `userPassword`, `user2FAEnabled`) VALUES
(1, 'chicoa', 'chicoa@oregonstate.edu', 'pass1', 1),
(2, 'songeu', 'songeu@oregonstate.edu', 'pass2', 1),
(3, 'maddesea', 'maddesea@oregonstate.edu', 'pass3', 1),
(4, 'magela', 'magela@oregonstate.edu', 'pass4', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `UserLoginItems`
--
ALTER TABLE `UserLoginItems`
  ADD PRIMARY KEY (`userLoginItemID`),
  ADD KEY `fk_UserLoginItems_Users1_idx` (`userID`);

--
-- Indexes for table `UserNotes`
--
ALTER TABLE `UserNotes`
  ADD PRIMARY KEY (`userNoteID`),
  ADD KEY `fk_UserNotes_Users1_idx` (`userID`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `userEmail_UNIQUE` (`userEmail`),
  ADD UNIQUE KEY `userUsername_UNIQUE` (`userUsername`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `UserLoginItems`
--
ALTER TABLE `UserLoginItems`
  MODIFY `userLoginItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `UserNotes`
--
ALTER TABLE `UserNotes`
  MODIFY `userNoteID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `UserLoginItems`
--
ALTER TABLE `UserLoginItems`
  ADD CONSTRAINT `fk_UserLoginItems_Users1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `UserNotes`
--
ALTER TABLE `UserNotes`
  ADD CONSTRAINT `fk_UserNotes_Users1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
