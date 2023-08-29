const multer = require('multer');
const path = require('path');
const { db } = require('./db');

const LIGNE_PAR_PAGES= 25;
const SECRET_KEY = 'b1717167dd1920d2ef95d8ae8de426a0adc0d8dca3551437862a2c3310b9e53a';

const storageUserAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/AvatarUser');
    },
    filename: function (req, file, cb) {
        const userId = req.body.uniquePseudo;
        cb(null, userId+path.extname(file.originalname));
    }
  });
  const storageConversationImage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/ImageConversation');
    },
    filename: function (req, file, cb) {
        const userId = req.body.uniquePseudo;
        cb(null, userId+path.extname(file.originalname));
    }
  });
  const storageFile = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/messages');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const nameFile=file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);

        req.body.fieldname=nameFile;
        req.body.namereal=file.originalname;

        let id_message = req.body.id_message;
        let name = req.body.name;

        const query= "INSERT INTO `discution`.`file` (`id_message`, `linkFile`,`name`) VALUES (?, ?,?);";
        db.query(query, [id_message, nameFile,name], (err, result) => {
            if (err) {
                console.error('Erreur lors de la creation du message:', err);
            } else {
            }
        });

        cb(null,nameFile);
    }
  });
  
  const uploadUserAvatar = multer({ storage: storageUserAvatar });
  const uploadConversationImage = multer({ storage: storageConversationImage });
  const uploadFile = multer({ storage: storageFile });

  module.exports = { LIGNE_PAR_PAGES,SECRET_KEY,uploadUserAvatar,uploadConversationImage,uploadFile };