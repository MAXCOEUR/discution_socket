-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 192.168.0.168    Database: discution
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.3-MariaDB-1

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
-- Table structure for table `amis`
--

DROP TABLE IF EXISTS `amis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amis` (
  `demandeur` varchar(80) NOT NULL,
  `receveur` varchar(80) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `amis-user_idx` (`demandeur`,`receveur`),
  KEY `tt_idx` (`receveur`),
  CONSTRAINT `amis-demandeur->user` FOREIGN KEY (`demandeur`) REFERENCES `user` (`uniquePseudo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `amis-receveur->user` FOREIGN KEY (`receveur`) REFERENCES `user` (`uniquePseudo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text DEFAULT NULL,
  `uniquePseudo_admin` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `conversation->user_idx` (`uniquePseudo_admin`),
  CONSTRAINT `conversation->user` FOREIGN KEY (`uniquePseudo_admin`) REFERENCES `user` (`uniquePseudo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `demandeAmis`
--

DROP TABLE IF EXISTS `demandeAmis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demandeAmis` (
  `demandeur` varchar(80) NOT NULL,
  `receveur` varchar(80) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `amis-user_idx` (`demandeur`,`receveur`),
  KEY `tt_idx` (`receveur`),
  CONSTRAINT `demandeAmis-demandeur->user` FOREIGN KEY (`demandeur`) REFERENCES `user` (`uniquePseudo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `demandeAmis-receveur->user` FOREIGN KEY (`receveur`) REFERENCES `user` (`uniquePseudo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message-read`
--

DROP TABLE IF EXISTS `message-read`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message-read` (
  `id_message` int(11) NOT NULL,
  `uniquePseudo_user` varchar(80) NOT NULL,
  PRIMARY KEY (`id_message`,`uniquePseudo_user`),
  KEY `message-read->user` (`uniquePseudo_user`),
  CONSTRAINT `message-read->message` FOREIGN KEY (`id_message`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `message-read->user` FOREIGN KEY (`uniquePseudo_user`) REFERENCES `user` (`uniquePseudo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uniquePseudo_sender` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `id_conversation` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `message->user_idx` (`uniquePseudo_sender`),
  KEY `message->conversation_idx` (`id_conversation`),
  CONSTRAINT `message->conversation` FOREIGN KEY (`id_conversation`) REFERENCES `conversation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `message->user` FOREIGN KEY (`uniquePseudo_sender`) REFERENCES `user` (`uniquePseudo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=218 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `email` varchar(255) NOT NULL,
  `uniquePseudo` varchar(80) NOT NULL,
  `pseudo` varchar(80) NOT NULL,
  `passWord` varchar(255) NOT NULL,
  PRIMARY KEY (`uniquePseudo`),
  UNIQUE KEY `uniquePseudo_UNIQUE` (`uniquePseudo`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user-conversation`
--

DROP TABLE IF EXISTS `user-conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user-conversation` (
  `uniquePseudo_user` varchar(80) NOT NULL,
  `id_conversation` int(11) NOT NULL,
  PRIMARY KEY (`uniquePseudo_user`,`id_conversation`),
  KEY `user-conversation->conversation_idx` (`id_conversation`),
  KEY `user->user-conversation_idx` (`uniquePseudo_user`),
  CONSTRAINT `user->user-conversation` FOREIGN KEY (`uniquePseudo_user`) REFERENCES `user` (`uniquePseudo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user-conversation->conversation` FOREIGN KEY (`id_conversation`) REFERENCES `conversation` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'discution'
--
/*!50003 DROP PROCEDURE IF EXISTS `CreateAmisDemande` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`maxence`@`%` PROCEDURE `CreateAmisDemande`(IN myUniquePseudo VARCHAR(80), IN amiUniquePseudo VARCHAR(80))
BEGIN
    SET @amisExist = (
        SELECT COUNT(*)
        FROM amis
        WHERE (demandeur = myUniquePseudo AND receveur = amiUniquePseudo)
           OR (demandeur = amiUniquePseudo AND receveur = myUniquePseudo)
    );
    
    IF @amisExist = 0 THEN
        SET @demandeExist = (
            SELECT COUNT(*)
            FROM demandeAmis
            WHERE demandeur = amiUniquePseudo AND receveur = myUniquePseudo
        );

        IF @demandeExist > 0 THEN
			SET SQL_SAFE_UPDATES = 0;
            
            DELETE FROM demandeAmis
            WHERE demandeur = amiUniquePseudo AND receveur = myUniquePseudo;
            
            SET SQL_SAFE_UPDATES = 1;
            
            INSERT INTO amis (demandeur, receveur)
            VALUES (myUniquePseudo, amiUniquePseudo);
        ELSE
			SET @sendDemandeExist = (
				SELECT COUNT(*)
				FROM demandeAmis
				WHERE demandeur = myUniquePseudo AND receveur = amiUniquePseudo
			);
            IF @sendDemandeExist = 0 THEN
				INSERT INTO demandeAmis (demandeur, receveur)
				VALUES (myUniquePseudo, amiUniquePseudo);
			END IF;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateConversation` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`maxence`@`%` PROCEDURE `CreateConversation`(
  IN admin_pseudo VARCHAR(80),
  IN conversation_name TEXT
)
BEGIN
  DECLARE new_conversation_id INT;

  -- Créer la conversation
  INSERT INTO conversation (name, uniquePseudo_admin)
  VALUES (conversation_name, admin_pseudo);

  -- Obtenir l'ID de la nouvelle conversation
  SET new_conversation_id = LAST_INSERT_ID();

  -- Ajouter une ligne dans user-conversation pour l'administrateur
  INSERT INTO `user-conversation` (uniquePseudo_user, id_conversation)
  VALUES (admin_pseudo, new_conversation_id);
  
  SELECT * FROM conversation WHERE id = new_conversation_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateMessage` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`maxence`@`%` PROCEDURE `CreateMessage`(
  IN uniquePseudo VARCHAR(80),
  IN id_conversation INT,
  IN message TEXT
)
BEGIN
  DECLARE new_messages_id INT;

  -- Créer le message
  INSERT INTO messages (id_conversation, Message, uniquePseudo_sender)
  VALUES (id_conversation, message, uniquePseudo);

  -- Obtenir l'ID du nouveau message
  SET new_messages_id = LAST_INSERT_ID();

  -- Ajouter une ligne dans message-read pour l'utilisateur
  INSERT INTO `message-read` (id_message, uniquePseudo_user)
  VALUES (new_messages_id, uniquePseudo);
  
  -- Récupérer la ligne du message créé
  SELECT m.*,u.* FROM messages m join user u on m.uniquePseudo_sender=u.uniquePseudo WHERE id = new_messages_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAmis` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`maxence`@`%` PROCEDURE `GetAmis`(IN userId VARCHAR(80))
BEGIN
    CREATE TEMPORARY TABLE resultTable (
        email VARCHAR(255),
        uniquePseudo VARCHAR(80),
        pseudo VARCHAR(80),
        passWord VARCHAR(255),
        Avatar BLOB
    );
    
    INSERT INTO resultTable
    SELECT DISTINCT u.email, u.uniquePseudo, u.pseudo, u.passWord, u.Avatar
    FROM user u
    JOIN amis a ON u.uniquePseudo = a.demandeur AND a.receveur = userId
    UNION
    SELECT DISTINCT u.email, u.uniquePseudo, u.pseudo, u.passWord, u.Avatar
    FROM user u
    JOIN amis a ON u.uniquePseudo = a.receveur AND a.demandeur = userId;
    
    SELECT * FROM resultTable;
    
    DROP TEMPORARY TABLE IF EXISTS resultTable;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MarkAllUnreadMessagesAsRead` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`maxence`@`%` PROCEDURE `MarkAllUnreadMessagesAsRead`(
  IN conversationId INT,
  IN uniquePseudo_user VARCHAR(80)
)
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE messageId INT;

  -- Cursor pour sélectionner les messages non lus
  DECLARE cur CURSOR FOR
    SELECT m.id
    FROM messages m
    LEFT JOIN `message-read` mr ON m.id = mr.id_message AND mr.uniquePseudo_user = uniquePseudo_user
    WHERE m.id_conversation = conversationId
      AND mr.id_message IS NULL;

  -- Gérer les erreurs liées au curseur
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur;

  read_loop: LOOP
    FETCH cur INTO messageId;
    IF done THEN
      LEAVE read_loop;
    END IF;

    -- Insérer une nouvelle ligne dans message-read pour marquer le message comme lu
    INSERT INTO `message-read` (id_message, uniquePseudo_user)
    VALUES (messageId, uniquePseudo_user);
  END LOOP;

  CLOSE cur;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-29 12:00:43
