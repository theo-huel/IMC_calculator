import './App.css';
import React, { useState } from 'react';

function App() {

  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    age: '',
    weight: '',
    height: '',
  });

  const [imc, setImc] = useState(null); 

  const [interpre, setInterpre] = useState(null); 


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);

    if (!isNaN(weight) && !isNaN(height) && height > 0) {
      const calculatedImc = weight / ((height/100) * (height/100));
      const imc = calculatedImc.toFixed(2); // garde seulement 2 décimales
      setImc(imc); 
      if (imc < 16 )
        setInterpre("Dénutrition sévère/n Risque très élevé de complications"); // garde seulement 2 décimales
      if (imc >= 16 && imc<=16.9 )
        setInterpre("Dénutrition modérée -> Risque élevé"); // garde seulement 2 décimales
      if (imc >= 17 && imc<=18.4 )
        setInterpre("Dénutrition légère -> Risque modéré"); // garde seulement 2 décimales
      if (imc >= 18.5 && imc<=24.9 )
        setInterpre("Corpulence normale -> Risque faible (zone idéale)"); // garde seulement 2 décimales
      if (imc >= 25 && imc<=29.9 )
        setInterpre("Surpoids -> Risque accru (hypertension, diabète, etc.)"); // garde seulement 2 décimales
      if (imc >= 30 && imc<=34.9 )
        setInterpre("Obésité modérée (Classe I) -> Risque élevé"); // garde seulement 2 décimales
      if (imc >= 35 && imc<=39.9 )
        setInterpre("Obésité sévère (Classe II) -> Risque très élevé"); // garde seulement 2 décimales
      if (imc >= 40)
        setInterpre("Obésité massive (Classe III) -> Risque très grave (morbide)"); // garde seulement 2 décimales
    } 
    
    else {
      alert("Veuillez entrer des valeurs valides pour poids et taille !");
    }

    try {
        const response = await fetch('http://localhost/backend/index.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            firstname: formData.firstname,
            imc: imc
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log('Données enregistrées avec succès ✅');
        } else {
          console.error('Erreur côté serveur :', data.message);
        }
      } catch (error) {
        console.error('Erreur lors de l’envoi des données :', error);
      }
    
  };

  return (
    <div className="App">
      <h1>Calculateur IMC</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Prénom :</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Poids (kg) :</label>
          <input
            type="number"
            step="0.1"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Taille (cm) :</label>
          <input
            type="number"
            step="0.01"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Calculer</button>
      </form>

      {imc && (
        <div style={{ marginTop: "20px" }}>
          <h2>Résultat :</h2>
          <p>IMC = {imc}</p>
        </div>
      )}
      {interpre && (
        <div style={{ marginTop: "20px" }}>
          <h2>Interprétation :</h2>
          <p>{interpre}</p>
        </div>
      )}
    </div>
  );
}

export default App;
