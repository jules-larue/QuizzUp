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
  var id = question["id"]; // l'id de la question à ajouter
  $("#table-body-questions").append($("<tr id="+id+">")); // on ajoute une nouvelle ligne du tableau
  // on ajoute ensuite chaque colonne
  $("#table-body-questions #"+id).append($("<th>").append(id)) // ID
                                    .append($("<td>").append(question["contenu"])) // intitulé
                                    .append($("<td>").append(question["reponse1"])) // réponse 1
                                    .append($("<td>").append(question["reponse2"])) // réponse 2
                                    .append($("<td>").append($("<span class='glyphicon glyphicon-trash' onclick='deleteQuestion(this)'>")))
                                    .append($("<td>").append($("<span class='glyphicon glyphicon-edit' onclick=''>"))); // bouton pour modifier la question
  // ajout d'un curseur "pointer" quand on passe les icones suppression et modification
  $(".glyphicon-trash").css("cursor", "pointer");
  $(".glyphicon-edit").css("cursor", "pointer");
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
            alertSuccessAdd();
            ajoutQuestion(data["question"]); // on ajoute la question à la liste
          }
        },
        error: function() {
          alertFailAdd();
    }
  });
}


function deleteQuestion(event) {
  var id = $(event).parent().parent().attr("id");
  $.ajax({
        url: "http://localhost:5000/question/"+id, // on choisir l'id de la question à supprimer dans la route
        type: "DELETE", // méthode DELETE
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"id":id}), // on envoie l'id de la question au serveur
        success: function(data) {
          if(data["success"] == true) {
            alertSuccessRemove();
            $("#table-body-questions #"+id).remove(); // on supprime la question dans la liste
          }
        },
        error: function(err) {
          alertFailRemove();
        }
  });
}


// ===== NOTIFIACTION LOLIBOX =====
/*
  Succès lors de l'ajout d'une question
*/
function alertSuccessAdd() {
  Lobibox.notify('success', {
    title: 'Question ajoutée !',
    msg: 'Votre question a bien été ajoutée.',
    delayIndicator: false // pas de barre timer
  });
}

/*
  Echec lors de l'ajout d'une question
*/
function alertFailAdd() {
  Lobibox.notify('error', {
    title: 'Erreur !',
    msg: 'Votre question n\'a pas pu être ajoutée.',
    delayIndicator: false // pas de barre timer
  });
}

/*
  Succès lors de la suppression d'une question
*/
function alertSuccessRemove() {
  Lobibox.notify('success', {
    title: 'Question supprimée !',
    msg: 'La question a bien été supprimée.',
    delayIndicator: false // pas de barre timer
  });
}


/*
  Echec lors de la suppression d'une question
*/
function alertFailRemove() {
  Lobibox.notify('error', {
    title: 'Erreur !',
    msg: 'Votre question n\'a pas pu être supprimée.',
    delayIndicator: false // pas de barre timer
  });
}
