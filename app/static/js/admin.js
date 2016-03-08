/*
Effectue une requête GET qur le serveur pour récupérer la liste de toutes les questions
*/
$.ajax({
  url: "http://localhost:5000/question/", // route api
  type: "GET", // requête GET
  datatype: "application/json", // type de donnée
  success:function(data) {
    refreshListeQuestions(data); // on rafraîchit la liste des questions lors de la réponse
    console.log(data); // affichage des questions en console
  },
  error: function(err){
    console.log("Erreur lors de la récupération des questions");
  }
});


function refreshListeQuestions(data) {
  $("#listeQuestions").empty(); // on vide les éventuelles questions existantes
  for(var question of data["Questions"]) {
    // on ajoute chaque question à la listeQuestions
    $("#listeQuestions").append($("<li>").append(question["contenu"])); // on affiche le contenu de la question (son intitulé)
  }
}
