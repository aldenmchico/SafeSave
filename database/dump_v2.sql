-- MySQL dump 10.13  Distrib 8.1.0, for macos12.6 (arm64)
--
-- Host: classmysql.engr.oregonstate.edu    Database: capstone_2023_securepass1
-- ------------------------------------------------------
-- Server version	5.5.5-10.6.15-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `UserLoginItems`
--

DROP TABLE IF EXISTS `UserLoginItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserLoginItems` (
  `userLoginItemID` int(11) NOT NULL AUTO_INCREMENT,
  `userLoginItemWebsite` varchar(145) NOT NULL,
  `userLoginItemUsername` varchar(145) NOT NULL,
  `userLoginItemPassword` varchar(145) NOT NULL,
  `userLoginItemDateCreated` date NOT NULL,
  `userLoginItemDateUpdated` date NOT NULL,
  `userLoginItemDateAccessed` date NOT NULL,
  `userID` int(11) NOT NULL,
  PRIMARY KEY (`userLoginItemID`),
  KEY `fk_UserLoginItems_Users1_idx` (`userID`),
  CONSTRAINT `fk_UserLoginItems_Users1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserLoginItems`
--

LOCK TABLES `UserLoginItems` WRITE;
/*!40000 ALTER TABLE `UserLoginItems` DISABLE KEYS */;
INSERT INTO `UserLoginItems` VALUES (1,'oregonstate.edu','chicoa','chicoa_oregonstatepass1','2023-10-18','2023-10-18','2023-10-18',1),(2,'oregonstate.edu','songeu','songeu_oregonstatepass1','2023-10-15','2023-10-17','2023-10-17',2),(3,'facebook.com','aldenmchico@gmail.com','aldenfbpw','2010-08-08','2022-05-14','2023-07-18',1),(4,'reddit.com','starlord_xxx','austinredditPW','2020-04-15','2020-04-16','2023-05-15',4),(5,'google.com','seanmadden87@gmail.com','seangooglepassword','2014-01-28','2018-02-09','2023-02-19',3),(6,'twitter.com','jDoe','jdoePass123','2023-10-24','2023-10-24','2023-10-24',1),(7,'twitter.com','jDoe','jdoePass123','2023-10-24','2023-10-24','2023-10-24',1),(8,'twitter.com','jDoe','jdoePass123','2023-10-24','2023-10-24','2023-10-24',1),(9,'twitter.com','jDoe','jdoePass123','2023-10-24','2023-10-24','2023-10-24',1);
/*!40000 ALTER TABLE `UserLoginItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserNotes`
--

DROP TABLE IF EXISTS `UserNotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserNotes` (
  `userNoteID` int(11) NOT NULL AUTO_INCREMENT,
  `userNoteTitle` varchar(145) NOT NULL,
  `userNoteText` longtext DEFAULT NULL,
  `userNoteCreated` date NOT NULL,
  `userNoteUpdated` date NOT NULL,
  `userNoteAccessed` date NOT NULL,
  `userID` int(11) NOT NULL,
  PRIMARY KEY (`userNoteID`),
  KEY `fk_UserNotes_Users1_idx` (`userID`),
  CONSTRAINT `fk_UserNotes_Users1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserNotes`
--

LOCK TABLES `UserNotes` WRITE;
/*!40000 ALTER TABLE `UserNotes` DISABLE KEYS */;
INSERT INTO `UserNotes` VALUES (1,'Secret Note!','I <3 CS467 :)','2023-10-18','2023-10-18','2023-10-18',1),(2,'Hello World','This is a test.','2015-07-05','2018-10-14','2019-01-04',3),(3,'Who\'s This?','Issa me, Mario!','2016-08-14','2017-09-09','2020-10-10',2),(4,'When Will This End?','Soon.','2020-05-15','2022-06-18','2022-12-25',2),(5,'Who Will Win the Superbowl?','LA Rams','2023-10-18','2023-10-18','2023-10-18',4),(6,'New Note','This is a brand new note.','2023-10-24','2023-10-24','2023-10-24',1),(7,'New Note','This is a brand new note.','2023-10-24','2023-10-24','2023-10-24',1);
/*!40000 ALTER TABLE `UserNotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `userUsername` varchar(145) NOT NULL,
  `userEmail` varchar(145) NOT NULL,
  `userPassword` varchar(145) NOT NULL,
  `user2FAEnabled` tinyint(1) NOT NULL DEFAULT 1,
  `userSecret` varchar(255) DEFAULT NULL,
  `userTempSecret` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userEmail_UNIQUE` (`userEmail`),
  UNIQUE KEY `userUsername_UNIQUE` (`userUsername`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'chicoa','chicoa@oregonstate.edu','pass1',1,NULL,NULL),(2,'songeu','songeu@oregonstate.edu','$2b$10$/LI0jobIMYYfgveHnetJPuRocOXuVh0DobmS0kNRzeEG67xefG9Oy',1,NULL,NULL),(3,'maddesea','maddesea@oregonstate.edu','pass3',1,NULL,NULL),(4,'mangela','mangela@oregonstate.edu','pass4',1,NULL,NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-02 16:17:38
