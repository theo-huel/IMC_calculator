import './App.css';
import React, { useState, useRef } from 'react';
import UsersTable from './UsersTable';


function App() {
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    age: '',
    weight: '',
    height: '',
    interpretation: 'test',
  });


  const [imc, setImc] = useState(null); 
  const [interpre, setInterpre] = useState(null); 
    const [showInterpretation, setShowInterpretation] = useState(false); // pour afficher temporairement



  // Référence pour accéder à UsersTable
  const usersTableRef = useRef();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Fonction pour réinitialiser les champs du formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      firstname: '',
      age: '',
      weight: '',
      height: '',
      interpretation: 'test',
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);


    if (!isNaN(weight) && !isNaN(height) && height > 0) {
      const calculatedImc = weight / ((height / 100) * (height / 100));
      const imcValue = calculatedImc.toFixed(2);
      setImc(imcValue);


      let interpretation = "";
      if (imcValue < 16)
        interpretation = "Dénutrition sévère -> Risque très élevé";
      else if (imcValue >= 16 && imcValue <= 16.9)
        interpretation = "Dénutrition modérée -> Risque élevé";
      else if (imcValue >= 17 && imcValue <= 18.4)
        interpretation = "Dénutrition légère -> Risque modéré";
      else if (imcValue >= 18.5 && imcValue <= 24.9)
        interpretation = "Corpulence normale -> Risque faible (zone idéale)";
      else if (imcValue >= 25 && imcValue <= 29.9)
        interpretation = "Surpoids -> Risque accru";
      else if (imcValue >= 30 && imcValue <= 34.9)
        interpretation = "Obésité modérée (Classe I) -> Risque élevé";
      else if (imcValue >= 35 && imcValue <= 39.9)
        interpretation = "Obésité sévère (Classe II) -> Risque très élevé";
      else if (imcValue >= 40)
        interpretation = "Obésité massive (Classe III) -> Risque très grave";


      setInterpre(interpretation);
      setShowInterpretation(true); // affiche l'interprétation


      //Masque après 10 secondes
      setTimeout(() => setShowInterpretation(false), 10000);
      
      try {
        /********ZONE A DECOMMENTER SI DEPLOIEMENT DU BACKEND EN LOCAL********/
        /*const response = await fetch('http://localhost:3009/saveDb',  {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            FirstName: formData.firstname,
            LastName: formData.name,
            imc: imcValue,
            interpretation,
          }),
        });*/


        /********ZONE A COMMENTER SI DEPLOIEMENT DU BACKEND EN LOCAL********/
        const response = await fetch('https://imc-calculator-gomz.onrender.com/saveDb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            FirstName: formData.firstname,
            LastName: formData.name,
            imc: imcValue,
            interpretation,
          }),
        });


        if (!response.ok) throw new Error("Erreur lors de l'envoi des données");


        await response.json();

        // Réinitialise les champs après un envoi réussi
        resetForm();

        // Rafraîchit le tableau après l'ajout
        if (usersTableRef.current) {
          usersTableRef.current.refresh();
        }


      } catch (error) {
        console.error("Erreur :", error);
      }


    } else {
      alert("Veuillez entrer des valeurs valides pour poids et taille !");
    }
  };


  return (
    <>
      <div className="App">
        <h1>Calculateur IMC</h1>

        <div className="content-container">
          {/* Colonne gauche : formulaire */}
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              <div>
                <label>Nom :</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div>
                <label>Prénom :</label>
                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
              </div>

              <div>
                <label>Poids (kg) :</label>
                <input type="number" min="0.1" step="0.1" name="weight" value={formData.weight} onChange={handleChange} required />
              </div>

              <div>
                <label>Taille (cm) :</label>
                <input type="number" min="0.01" step="0.01" name="height" value={formData.height} onChange={handleChange} required />
              </div>

              <button type="submit">Calculer</button>
            </form>

            {imc && (
              <div style={{ marginTop: "20px" }}>
                <h2>Résultat :</h2>
                <p>IMC = {imc}</p>
              </div>
            )}
            {showInterpretation && (
              <div style={{ marginTop: "20px", transition: "opacity 5s" }}>
                <h2>Interprétation :</h2>
                <p>{interpre}</p>
              </div>
            )}
          </div>

          {/* Colonne droite : historique */}
          <div className="table-section">
            <UsersTable ref={usersTableRef} />
          </div>
        </div>
      </div>

    </>
  );
}


export default App;