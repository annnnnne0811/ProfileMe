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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'Jane','Doe','janedoe@email.com','$2b$10$SG2ceiDB.6Z79Hw.mlR74OuhewznPwb1CAp.snoIwAPmnL7OBKSte','1996-01-01'),(2,'John','Doe','johndoe@email.com','$2b$10$4BT3dkEV9rBD6nwzp1iNEuMDfW65g8C6gk74QAnQ5IQcJ2NXHr2i.','1994-03-27'),(3,'Eilish ','Paseos','eilishpaseos@email.com','$2b$10$6XF7BIyBRg07WqOpy/yS3uoOjk.vmmV4OJkjHwvYrODAujivT8n7u','2004-02-17'),(4,'Alexandra','Bud','alexandrabud@email.com','$2b$10$JEMdXQGgpw2pWpQQp0lAxObSNkET2A9IhUOtLIv0s/a4cdt4PjhWS','2003-02-01'),(5,'Mary Anne','Flores','maryanne@email.com','$2b$10$4damWnlXLbuB9oYLKBFhdOiedZRtxMVa8MCEB7tUrAmkBClLMcfTS','2005-04-03'),(6,'Stepan','Chernobaev','stepanchernobaev@email.com','$2b$10$zB.LbZy.hvstoqA78SvbceFwPI8A3LmeDWki4Diw4kgXO9PiGTe8m','2003-12-01'),(7,'Raiyan','Mohd Farid','raiyanmohdfarid@email.com','$2b$10$LwfIlDmsHcMvEdDaEHG.leauPjasuKJTBZpu01SNbVIAcEjvQQWNC','2004-01-02');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,'Software Developer','Develop and maintain web applications for a fintech startup.','San Francisco, USA','2025-04-01 09:00:00'),(2,'Graphic Designer','Create visual content for marketing campaigns and social media.','London, UK','2025-04-02 14:30:00'),(3,'Data Analyst','Analyze sales data to provide actionable insights for a retail chain.','Toronto, Canada','2025-04-03 11:15:00'),(4,'Mechanical Engineer','Design and test machinery for a manufacturing company.','Munich, Germany','2025-04-04 08:45:00'),(5,'Marketing Manager','Lead a team to develop marketing strategies for a new product launch.','Sydney, Australia','2025-04-05 16:20:00'),(6,'Nurse Practitioner','Provide patient care in a busy urban hospital.','New York, USA','2025-04-06 10:00:00'),(7,'Civil Engineer','Oversee infrastructure projects, including bridges and roads.','Dublin, Ireland','2025-04-07 13:00:00'),(8,'Content Writer','Write blog posts and articles for a tech website.','Seoul, Korea','2025-04-08 09:30:00'),(9,'Electrician','Install and maintain electrical systems in residential buildings.','Tokyo, Japan','2025-04-09 07:00:00'),(10,'Teacher','Teach mathematics to high school students in a public school.','Cape Town, South Africa','2025-04-09 12:00:00'),(11,'AI Research Scientist','Conduct research on machine learning models for a tech company.','Seoul, Korea','2025-04-10 09:00:00'),(12,'Web Developer','Build and maintain e-commerce websites for a retail company.','Busan, Korea','2025-04-10 10:30:00'),(13,'Automotive Engineer','Design electric vehicle components for a leading car manufacturer.','Frankfurt, Germany','2025-04-11 08:45:00'),(14,'Product Manager','Oversee the development of a new software product.','Hamburg, Germany','2025-04-11 14:00:00'),(15,'Software Tester','Test mobile applications for bugs and performance issues.','Dublin, Ireland','2025-04-12 11:00:00'),(16,'HR Specialist','Manage recruitment and employee relations for a tech firm.','Cork, Ireland','2025-04-12 15:20:00'),(17,'Game Developer','Develop mobile games for a gaming studio.','Helsinki, Finland','2025-04-13 09:30:00'),(18,'Environmental Scientist','Research sustainable practices for a government agency.','Tampere, Finland','2025-04-13 13:00:00'),(19,'Logistics Coordinator','Manage supply chain operations for a manufacturing company.','Ljubljana, Slovenia','2025-04-14 08:00:00'),(20,'UI/UX Designer','Design user interfaces for a new mobile app.','Maribor, Slovenia','2025-04-14 12:15:00');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_links`
--

LOCK TABLES `user_links` WRITE;
/*!40000 ALTER TABLE `user_links` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profile`
--

LOCK TABLES `user_profile` WRITE;
/*!40000 ALTER TABLE `user_profile` DISABLE KEYS */;
INSERT INTO `user_profile` VALUES (1,3,NULL,'/uploads/3-profileVideo.mp4',NULL,NULL,'2025-04-10 17:23:38',NULL),(2,4,NULL,'/uploads/4-profileVideo.mp4',NULL,NULL,'2025-04-10 17:36:37',NULL),(5,7,NULL,'/uploads/7-profileVideo.mp4',NULL,NULL,'2025-04-10 20:03:28',NULL),(6,5,NULL,'/uploads/5-profileVideo.mp4',NULL,NULL,'2025-04-10 20:56:06',NULL),(7,6,NULL,'/uploads/6-profileVideo.mp4',NULL,NULL,'2025-04-10 22:01:46',NULL);
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

-- Dump completed on 2025-04-10 22:26:19
