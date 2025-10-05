import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const UsersTable = forwardRef((props, ref) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // on affiche 5 historiques par page

  const getUsers = async () => {
    try {
      /********ZONE A DECOMMENTER SI DEPLOIEMENT DU BACKEND EN LOCAL********/
      //const response = await fetch("http://localhost:3009/users");

      /********ZONE A COMMENTER SI DEPLOIEMENT DU BACKEND EN LOCAL********/
      const response = await fetch("https://imc-calculator-gomz.onrender.com/users");

      if (!response.ok) throw new Error("Erreur lors de la récupération des données");

      const data = await response.json();
      setUsers(data);
      setCurrentPage(1); // réinitialise à la 1ère page à chaque refresh
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  // Permet à App.jsx de rafraîchir la table
  useImperativeHandle(ref, () => ({
    refresh: getUsers,
  }));

  useEffect(() => {
    getUsers();
  }, []);

  // Pagination : calcul des indices pour afficher 5 par 5
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div>
      <h2>Historique des Calculs IMC</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : users.length === 0 ? (
        <p>Aucun calcul trouvé</p>
      ) : (
        <>
          <table border="1" style={{ margin: "10px auto", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>IMC</th>
                <th>Interprétation</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.LastName}</td>
                  <td>{u.FirstName}</td>
                  <td>{u.imc}</td>
                  <td>{u.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination avec flèches */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePrev} disabled={currentPage === 1}>
                ⬅️ Précédent
              </button>
              <span>
                Page {currentPage} / {totalPages}
              </span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>
                Suivant ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default UsersTable;
