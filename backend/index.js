const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const serviceAccount = require('./firebase-service-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());


// tester le serveur 
app.get('/', (req, res) => {
  res.send('Serveur opérationnel');
});

//Afficher tt les utilisateurs sur la Db
app.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('calculsIMC').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

app.post('/saveDb', async (req, res) => {
  const { FirstName, LastName, imc, interpretation} = req.body;
  try {
    const newDoc = await db.collection('calculsIMC').add({
      FirstName,
      LastName,
      imc,
      interpretation,
    });
    res.status(201).json({ id: newDoc.id });
  } catch (error) {
    res.status(500).send('Erreur lors de la sauvegarde des données');
  }
});

// Route pour récupérer les calculs IMC depuis Firestore
app.get('/calculs', async (req, res) => {
  try {
    const snapshot = await db.collection('calculsIMC').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des données');
  }
});



const PORT = 3009;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));