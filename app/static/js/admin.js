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


function refreshListeQuestions(data) {
  console.log(data);
  for(var question of data["Questions"]) {
    // on ajoute chaque question à la listeQuestions
    $("#listeQuestions").append($("<li>").append(question["contenu"])); // on affiche le contenu de la question (son intitulé)
  }
}


function showAddQuestionElements() {
  $("ajoutQuestionBlock").show();
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
            $("#listeQuestions").append($("<li>").append($("#intitule").val()));
          }
        },
        error: function() {
          alert("Erreur : la question n'a pas pu être ajoutée");
    }
  });
}
