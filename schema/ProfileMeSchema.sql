-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: profileme
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `AccountID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `DateOfBirth` date NOT NULL,
  PRIMARY KEY (`AccountID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'jane','doe','janedoe@email.com','$2b$10$cqlmDxdBKaAJX6WDhFK6bO6BSPs3CfQaOlrs6aSRpHnVRIaHRAFm2','2001-01-01'),(2,'jam','jam','jamjam@email.com','$2b$10$q29wVKnDdJ1iQQWCAQFht.APjN/ppOCepuxRGO0TtpWuhDr5evnO6','1111-01-11'),(3,'test','test','test@email.com','$2b$10$FyDqauqj9xtlOgo8Tp5B2e.Pb7hb.6AqJE8yuNwNdRJSCyLGRR47G','2222-01-01'),(4,'eilish','potato','eilish@email.com','$2b$10$j82I/HCh6xkJs2bVXdvPIOpnZ4QkyAaQUXhq9L151beRRkpXeUCWq','2222-12-12'),(5,'John','Doe','johndoe@email.com','$2b$10$A7CNU2AfDcC8KfMSH/N/F.RpDQxgKDRKzRnMzlryECyNnw6ZQTnIq','2001-03-12');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `JobID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `Location` varchar(255) DEFAULT NULL,
  `DatePosted` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`JobID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,'job','job desc','Dublin','2025-03-26 02:50:44'),(2,'job1','job1','Korea','2025-03-28 22:04:36'),(3,'test job','testing job','seoul','2025-03-28 22:29:36'),(4,'Computer Engineer','fixes computers','sligo','2025-04-07 19:53:30'),(5,'Computer Engineer','Fixes laptops','seoul','2025-04-07 19:57:53'),(6,'Chef','For hire private cook','seoul','2025-04-07 19:58:24'),(7,'Accountant','Accountant for hire','dublin','2025-04-07 19:59:26'),(8,'Accountant','part time accountant','dublin','2025-04-07 20:00:00'),(9,'plumber','plumbing for hire','seoul','2025-04-07 20:07:50');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `MessageID` int NOT NULL AUTO_INCREMENT,
  `ProfileUserID` int DEFAULT NULL,
  `MessageText` text,
  PRIMARY KEY (`MessageID`),
  KEY `ProfileUserID` (`ProfileUserID`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`ProfileUserID`) REFERENCES `profile` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile` (
  `UserID` int NOT NULL,
  `ProfileDescription` varchar(1000) DEFAULT NULL,
  `ProfileVideo` mediumblob,
  `ProfileIcon` mediumblob,
  `DisplayedLocation` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `UserAge` int DEFAULT NULL,
  `UserGender` varchar(50) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `AccountID` int DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  KEY `AccountID` (`AccountID`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`AccountID`) REFERENCES `account` (`AccountID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_links`
--

DROP TABLE IF EXISTS `user_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_links` (
  `LinkID` int NOT NULL AUTO_INCREMENT,
  `ProfileID` int NOT NULL,
  `LinkName` varchar(255) DEFAULT NULL,
  `LinkURL` varchar(500) DEFAULT NULL,
  `IconClass` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`LinkID`),
  KEY `ProfileID` (`ProfileID`),
  CONSTRAINT `user_links_ibfk_1` FOREIGN KEY (`ProfileID`) REFERENCES `user_profile` (`ProfileID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_links`
--

LOCK TABLES `user_links` WRITE;
/*!40000 ALTER TABLE `user_links` DISABLE KEYS */;
INSERT INTO `user_links` VALUES (15,1,'','github.com','bi bi-github');
/*!40000 ALTER TABLE `user_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profile`
--

DROP TABLE IF EXISTS `user_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profile` (
  `ProfileID` int NOT NULL AUTO_INCREMENT,
  `AccountID` int NOT NULL,
  `ProfileImage` varchar(500) DEFAULT NULL,
  `ProfileVideo` varchar(500) DEFAULT NULL,
  `BioText` text,
  `DisplayLocation` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `FeedText` text,
  PRIMARY KEY (`ProfileID`),
  UNIQUE KEY `unique_account_id` (`AccountID`),
  CONSTRAINT `user_profile_ibfk_1` FOREIGN KEY (`AccountID`) REFERENCES `account` (`AccountID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profile`
--

LOCK TABLES `user_profile` WRITE;
/*!40000 ALTER TABLE `user_profile` DISABLE KEYS */;
INSERT INTO `user_profile` VALUES (1,1,'http://localhost:3000/uploads/1-profilePic.jpg','http://localhost:3000/uploads/1-profileVideo.mp4','trying to update biotext','','2025-04-07 19:38:36','This should persist after refresh'),(23,5,NULL,'http://localhost:3000/uploads/5-profileVideo.mp4','this is my personal statement',NULL,'2025-04-07 20:05:57','updating feed');
/*!40000 ALTER TABLE `user_profile` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-07 20:22:47
