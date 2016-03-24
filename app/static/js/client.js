
// Quand le document HTML est prêt,
// on fait une requêtes Ajax qui va récupérer
// la question à afficher au client
$(document).ready(function() {
  $.ajax({
    url: "http://localhost:5000/instance/", // route api
    type: "GET", // requête GET
    datatype: "application/json", // type de donnée
    success:function(data) {
      var question = getQuestionById(data["question_id"]);
      setInstanceQuestion(question, data["question_id"]);
      console.log("Temps restant : "+data["temps_restant"]);
      $("#countdown").countdown360({ // démarrage et affichage du compte à rebours
      	radius      : 60, // rayon du timer
      	seconds     : data["temps_restant"], // temps restant
      	fontColor   : '#FFFFFF', // couleur du texte (ici, blanc)
      	autostart   : true, // démarrage auto du timer
      	onComplete  : function () { console.log('Temps écoulé !') } // fonction à exécuter à la fin du compte à rebours
      	}).start()
    },
    error: function(err){
      console.log("Erreur lors de la récupération des questions");
    }
  });
})


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
    data: JSON.stringify({"numReponse":numReponse, "idQuestion":idQuestion}),
    datatype: "application/json", // type de donnée
    success:function(data) {
      if(data["success"] == true){
        if(data["reponseCorrecte"] == true) { // le client a réponse correctement
          indiquerBonneReponse(numReponse);

        } else { // le client a mal réponse
          indiquerMauvaiseReponse(numReponse);
        }
        // dans tous les cas, on rend les boutons inactifs
      //  $("#rep1, #rep2").attr("disabled", "disabled");
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
  * Indiquer visuellement que la bonne réponse a été choisie
  */
function indiquerBonneReponse(numReponse) {
  $("#rep1, #rep2").removeClass("btn-primary"); // on enlève la classe qui affiche les boutons en bleu
  $("#rep"+numReponse).addClass("btn-success"); // le bouton de la bonne réponse est un succès
  var mauvaiseReponse = (numReponse==1) ? 2 : 1; // on récupère l'id de la mauvaise réponse
  $("#rep"+mauvaiseReponse).addClass("btn-danger"); // le bouton de la mauvaise réponse se met en rouge

  $("#msg-reponse").text("Bravo, c'est la bonne réponse !"); // on indique le texte de la bonne réponse
  $("#msg-reponse").addClass("alert-success"); // le message est en vert (succès)
}



/**
  * Indiquer visuellement que la bonne réponse a été choisie
  */
function indiquerMauvaiseReponse(numReponse) {
  $("#rep1, #rep2").removeClass("btn-primary"); // on enlève la classe qui affiche les boutons en bleu
  $("#rep"+numReponse).addClass("btn-danger"); // le bouton choisi est en rouge (vu qu'on a choisi la mauvaise réponse)
  var bonneReponse = (numReponse==1) ? 2 : 1; // on récupère l'id de la bonne réponse
  $("#rep"+bonneReponse).addClass("btn-success"); // le bouton de la bonne réponse se met en vert

  $("#msg-reponse").text("Vous avez choisi la mauvaise réponse."); // on indique le texte de la bonne réponse
  $("#msg-reponse").addClass("alert-danger"); // le message est en vert (succès)
}
