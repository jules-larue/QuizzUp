$().ready(function() {
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
})


function ajoutQuestion(question) {
  console.log(question);
  $("#listeQuestions").append($("<li id="+question["id"]+">").append(question["contenu"]) // on affiche le contenu de la question (son intitulé)
                      .append($("<button onclick=deleteQuestion(this)>").append("Supprimer"))); // on ajoute à côté un bouton pour supprimer la question
}


function refreshListeQuestions(data) {
  console.log(data);
  for(var question of data["Questions"]) {
    // on ajoute chaque question à la listeQuestions
      ajoutQuestion(question);
  }
}

function submitQuestion() {
  // on crée la nouvelle question
  var question = new Question($("#intitule").val(),
                              $("#reponse1").val(),
                              $("#reponse2").val(),
                              $("#radioButton1").is(":checked") ? 1 : 2
                            );
  // et on fait la requête AJAX POST
  $.ajax({
        url: "http://localhost:5000/question/",
        type: "PUT",
        contentType: "application/json; charset=utf-8", // le type de données qu'on envoie
        data: JSON.stringify(question)  , // la donnée qu'on envoie
        success: function(data) {
          if(data["success"] == true) {
            // le serveur nous dit que la réponse a bien été ajoutée
            alert("La question a bien été ajoutée.");
            ajoutQuestion(data["question"]); // on ajoute la question à la liste
          }
        },
        error: function() {
          alert("Erreur : la question n'a pas pu être ajoutée");
    }
  });
}


function deleteQuestion(event) {
  var id = $(event).parent().attr("id");
  $.ajax({
        url: "http://localhost:5000/question/"+id, // on choisir l'id de la question à supprimer dans la route
        type: "DELETE", // méthode DELETE
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"id":id}), // on envoie l'id de la question au serveur
        success: function(data) {
          if(data["success"] == true) {
            alert("La question (id "+id+") a bien été supprimée.");
            $("#listeQuestions #"+id).remove(); // on supprime la questions dans la liste
          }
        },
        error: function(err) {
          alert("Impossible de supprimer la question.");
        }
  });
}
