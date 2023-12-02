CREATE TABLE `Users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `userUsername` longtext NOT NULL,
  `userEmail` longtext NOT NULL,
  `userPassword` varchar(145) NOT NULL,
  `user2FAEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `userSecret` varchar(255) DEFAULT NULL,
  `userTempSecret` varchar(255) DEFAULT NULL,
  `userHMAC` varchar(256) DEFAULT NULL,
  `userEmailHMAC` varchar(255) DEFAULT NULL,
  `userSalt` varchar(64) DEFAULT NULL,
  `userSessionID` longtext,
  PRIMARY KEY (`userID`)
);

CREATE TABLE `UserLoginItems` (
  `userLoginItemID` int NOT NULL AUTO_INCREMENT,
  `userLoginItemWebsite` varchar(145) NOT NULL,
  `userLoginItemUsername` varchar(145) NOT NULL,
  `userLoginItemPassword` varchar(145) NOT NULL,
  `userLoginItemDateCreated` date NOT NULL,
  `userLoginItemDateUpdated` date NOT NULL,
  `userLoginItemDateAccessed` date NOT NULL,
  `userID` int NOT NULL,
  `websiteIV` longtext,
  `usernameIV` longtext,
  `passwordIV` longtext,
  `authTag` varchar(64) DEFAULT NULL,
  `favorited` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userLoginItemID`),
  KEY `fk_UserLoginItems_Users1_idx` (`userID`),
  CONSTRAINT `fk_UserLoginItems_Users1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `UserNotes` (
  `userNoteID` int NOT NULL AUTO_INCREMENT,
  `userNoteTitle` varchar(14500) NOT NULL,
  `userNoteText` longtext,
  `userNoteCreated` varchar(200) NOT NULL,
  `userNoteUpdated` varchar(200) NOT NULL,
  `userNoteAccessed` varchar(200) NOT NULL,
  `userID` int NOT NULL,
  `userNoteIV` longtext,
  `userNoteTextIV` longtext,
  `authTag` varchar(64) DEFAULT NULL,
  `favorited` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userNoteID`),
  KEY `fk_UserNotes_Users1_idx` (`userID`),
  CONSTRAINT `fk_UserNotes_Users1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
);



