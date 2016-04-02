var pseudo; // pseudo de l'utilisateur connecté
// Quand le document HTML est prêt,
// on récupère une question à afficher
// et on l'affiche
$(document).ready(function() {
  $("#btn-pseudo").attr("disabled", false);
  $("#quizz").hide();
});


function submitLogin() {
  pseudo = $("#pseudo").val();
  if((jQuery.trim(pseudo)).length==0) {
    // champ vide
    alert("Vous devez choisir un pseudo.");
  } else {
    pseudo

    // cacher le champs de pseudo et montrer celui por la question
    $("#identification").fadeOut(callback = function(){$("#quizz").fadeIn();});
    // et affichage d'une question
    afficherNouvelleQuestion();
  }
}



function afficherNouvelleQuestion() {
  $.ajax({
    url: "http://localhost:5000/instance/", // route api
    type: "GET", // requête GET
    datatype: "application/json", // type de donnée
    success:function(data) {
      var question = getQuestionById(data["question_id"]);
      setInstanceQuestion(question, data["question_id"]);
      console.log("Temps restant : "+data["temps_restant"]);
      $("#countdown").countdown360({ // démarrage et affichage du compte à rebours
      	radius               : 60, // rayon du timer
      	seconds              : data["temps_restant"], // temps restant
      	fontColor            : '#FFFFFF', // couleur du texte (ici, blanc)
      	autostart            : false, // démarrage auto du timer
        startOverAfterAdding : false,
      	onComplete           : function () {
          afficherStats(data["question_id"]); // affichage des stats de la question
          if($("#rep1").is(":enabled"))
            correction(data["question_id"]); // correction si pas de choix
        } // fonction à exécuter à la fin du compte à rebours
      }).start();
      // Intialisation des boutons de choix de réponse
      $("#rep1, #rep2").attr("disabled", false);
      $("#rep1, #rep2").removeClass("btn-danger");
      $("#rep1, #rep2").removeClass("btn-success");
      $("#rep1, #rep2").addClass("btn-primary");

      // Intialisation du timer
      $("#countdown").children().addClass("center-block");
      $("#countdown").width(300);
      $("#countdown").height(300);

      $("#resultats").hide();
    },
    error: function(err){
      console.log("Erreur lors de la récupération des questions");
    }
  });
}


function getQuestionById(question_id) {
  var res = null;
  $.ajax({
    url: "http://localhost:5000/question/", // route api
    type: "GET", // requête GET
    datatype: "application/json", // type de donnée
    async: false,
    success:function(data) {
      // data["Questions"] contient la liste de toutes les questions de la base
      for(var question of data["Questions"]) {
        if(question.id == question_id) {
          console.log("Success");
          res =  new Question(question.contenu,
                              question.reponse1,
                              question.reponse2);
        }
      }
    },
    error: function(err) {
      console.log("Erreur lors de la récupération de la question.");
    }
  });
  return res;
}



function setInstanceQuestion(question, question_id) {
  $("#intitule-question").text(question.contenu);
  $("#rep1").text(question.reponse1);
  $("#rep2").text(question.reponse2);

  // lors du click sur une réponse, on fait une requête
  // qui vérifie sur le serveur si la réponse donnée (premier paramètre)
  // à la question dont l'id est e second paramètre est correcte ou non
  $("#rep1").attr("onclick", "envoyerReponse(1, "+question_id+")");
  $("#rep2").attr("onclick", "envoyerReponse(2, "+question_id+")");

}


function envoyerReponse(numReponse, idQuestion) {
  $.ajax({
    url: "http://localhost:5000/reponse/", // route api
    type: "PUT", // requête PUT
    contentType: "application/json; charset=utf-8", // le type de données qu'on envoie
    data: JSON.stringify({"numReponse":numReponse, "idQuestion":idQuestion, "pseudo":pseudo}),
    datatype: "application/json", // type de donnée
    success:function(data) {
      if(data["success"] == true){
        console.log("appel correction("+idQuestion+")");
        correction(idQuestion);
        // dans tous les cas, on rend les boutons inactifs
        $("#rep1, #rep2").attr("disabled", "disabled");
      }
      else { // échec dans la requête
        // pour l'instant pas grand chose
        console.log("Echec requête.");
      }
    },
    error: function(err){
      console.log("Echec requête pour la bonne réponse.");
    }
  });
}

/**
  * Correction visuelle de la question (couleurs)
  */
function correction(id) {
  $.ajax({
    url: "http://localhost:5000/reponse/"+id, // route api
    type: "GET", // requête GET
    datatype: "application/json", // type de donnée
    success:function(data) {
      console.log("data = "+data)
      console.log("correction question"+id+", bonne rép = "+data["reponseCorrecte"])
      $("#rep1, #rep2").attr("disabled", true); // désactivation des boutons
      $("#rep1, #rep2").removeClass("btn-primary"); // on enlève la classe qui affiche les boutons en bleu
      $("#rep"+data["reponseCorrecte"]).addClass("btn-success"); // le bouton de la bonne réponse est un succès
      var mauvaiseReponse = (data["reponseCorrecte"]==1) ? 2 : 1; // on récupère l'id de la mauvaise réponse
      $("#rep"+mauvaiseReponse).addClass("btn-danger"); // le bouton de la mauvaise réponse se met en rouge
    },
    error: function(err){
      console.log("Echec requête pour la bonne réponse.");
    }
  });
}



function afficherStats(idQuestion) {
  $.ajax({
    url: "http://localhost:5000/resultats/"+idQuestion, // route api
    type: "GET", // requête GET
    datatype: "application/json",
    success:function(data) {
          console.log("nb bonnes : "+data["pourcentageBonnesReponses"]);
          console.log("nb mauvaises : "+data["pourcentageMauvaisesReponses"]);
          $("#countdown").fadeOut(callback = function() { // disparition chronomètre et apparition stats en fondu
          // on fait l'affichage des stats que si elles ne le son pas déjà
          $("#resultats").append($("<h3>").append("Résultats :"));
          $("#resultats").append($("<p>").append("Bonnes réponses : "+data["pourcentageBonnesReponses"]+" %"));
          $("#resultats").append($("<p>").append("Mauvaises réponses : "+data["pourcentageMauvaisesReponses"]+" %"));
          $("#resultats").fadeIn();
        });
    },
    error: function(err) {
      console.log("Erreur lors de la récupération des stats.");
    }
  });
}
