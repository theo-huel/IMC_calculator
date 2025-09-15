const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const serviceAccount = require('./firebase-service-key.json'); // ton fichier clé Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://imc-app-c6609-default-rtdb.firebaseio.com'
});

const db = admin.database();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/calculate', async (req, res) => {
  const { poids, taille, userId } = req.body;

  if (!poids || !taille) return res.status(400).send("Valeurs invalides");

  const imc = poids / (taille * taille);
  let interpretation = '';

  if (imc < 18.5) interpretation = 'Insuffisance pondérale';
  else if (imc < 25) interpretation = 'Normal';
  else if (imc < 30) interpretation = 'Surpoids';
  else interpretation = 'Obésité';
//tegxud
  // Sauvegarde dans Firebase Realtime Database
  if (userId) {
    await db.ref('calculsIMC').push({
      userId,
      poids,
      taille,
      imc: imc.toFixed(2),
      interpretation,
      date: new Date().toISOString()
    });
  }

  res.json({ imc: imc.toFixed(2), interpretation });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));