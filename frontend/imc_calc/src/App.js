import './App.css';
import React, { useState } from 'react';

function App() {
  
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    weight: '',
    height: '',
  });

  const [imc, setImc] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);

    if (!isNaN(weight) && !isNaN(height) && height > 0) {
      const calculatedImc = weight / (height * height);
      setImc(calculatedImc.toFixed(2)); // garde seulement 2 décimales
    } else {
      alert("Veuillez entrer des valeurs valides pour poids et taille !");
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
          <label>Taille (m) :</label>
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
    </div>
  );
}

export default App;
