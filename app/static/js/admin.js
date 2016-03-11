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

  $("#button-modifier").hide(); // au début on ne montre pas le bouton de modification
  console.log("COUCOUOCUOCUCOCOCOCU");

  $(".close").click(showAddQuestion); // association évènement click à la croix
  $(".close").hide(); // au début, pas de croix

})


function ajoutQuestion(question) {
  console.log(question);
  var id = question["id"]; // l'id de la question à ajouter
  $("#table-body-questions").append($("<tr id="+id+">")); // on ajoute une nouvelle ligne du tableau
  // on ajoute ensuite chaque colonne
  $("#table-body-questions #"+id).append($("<th>").append(id)) // ID
                                    .append($("<td class='contenu'>").append(question["contenu"])) // intitulé
                                    .append($("<td class='reponse1'>").append(question["reponse1"])) // réponse 1
                                    .append($("<td class='reponse2'>").append(question["reponse2"])) // réponse 2
                                    .append($("<td>").append($("<span class='glyphicon glyphicon-trash' onclick='deleteQuestion(this)'>")))
                                    .append($("<td>").append($("<span class='glyphicon glyphicon-edit' onclick='showModifQuestion("+id+")'>"))); // bouton pour modifier la question
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
            // on va supprimer le formulaire de modification de question
            // si la question supprimée est celle qu'on modifie
            var idModif = getCookie("idQuestModifiee"); // l'id de la question modifiée
            if(idModif == id) // on a trouvé une question en cours de modification
              showAddQuestion();
          }
        },
        error: function(err) {
          alertFailRemove();
        }
  });
}


function updateQuestion(id) {
  var question = new Question($("#intitule").val(),
                              $("#reponse1").val(),
                              $("#reponse2").val(),
                              $("#radioButton1").is(":checked") ? 1 : 2
                            ); // la nouvelle question mise à jour
  $.ajax({
        url: "http://localhost:5000/question/"+id, // on choisir l'id de la question à supprimer dans la route
        type: "POST", // méthode POST
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(question), // on envoie les nouvelles données de la question modiifiée au serveur
        success: function(data) {
          if(data["success"] == true) {
            alertSuccessUpdate();
            // on met à jour le tableau
            $("#table-body-questions #"+id+" .contenu").first().text(data["question"]["contenu"]);
            $("#table-body-questions #"+id+" .reponse1").first().text(data["question"]["reponse1"]);
            $("#table-body-questions #"+id+" .reponse2").first().text(data["question"]["reponse2"]);
            showAddQuestion(); // on affiche un fomulaire d'ajout de nouvelle question
          }
        },
        error: function(err) {
          alertFailUpdate();
        }
  });
}


/*
  Affiche le bloc de modification d'une question dont l'id est précisé en paramètre
*/
function showModifQuestion(id) {
   // on stocke dans un cookie l'id de la question actuellement modifiée
   document.cookie = "idQuestModifiee="+id+";";
   // on commence par faire disparaitre l'ancien formulaire
  $("#form-question").fadeOut(callback = function() {
    // on commence pas enlever la mise en valeur d'une autre éventuelle question
    $("#table-body-questions tr").removeClass("selected-question");
    // on met en valeur la question dans le tableau
    $("#table-body-questions #"+id).addClass("selected-question");

    // affichage croix pour fermer
    $(".close").show();

    // on cache le bouton d'ajout de nouvelle question, et on affiche celui de Modification
    $("#button-add").hide();
    $("#button-modifier").show();

    var intitule = $("#table-body-questions #"+id+" .contenu").first().text();
    var reponse1 = $("#table-body-questions #"+id+" .reponse1").first().text();
    var reponse2 = $("#table-body-questions #"+id+" .reponse2").first().text();
    // on pré-remplit les infos du formulaire
    $("#form-question h2").text("Modification de la question numéro "+id);
    $("#intitule").val(intitule);
    $("#reponse1").val(reponse1);
    $("#reponse2").val(reponse2);
    $("#radioButton1").attr("checked", "checked"); // pour l'instant, on coche par défaut la réponse 1

    // à ce moment, on donne le bon argument à la fonction onclick() du bouton de mise à jour
    $("#button-modifier").attr("onclick", "updateQuestion("+id+")");
  });
  // on lance une petite animation de slide pour afficher le formulaire
  $("#form-question").fadeIn();
}

/*
  Fait disparaitre le formulaire de question en cours,
  et affiche un formulaire vierge pour ajouter une question
*/
function showAddQuestion() {
  // on supprime le cookie stockant l'id de la qustion en cours de modification
  var d = new Date();
  document.cookie = "expires=" + d.toGMTString() + ";" + ";";
  // on commence par faire disparaitre l'ancien formulaire
  $("#form-question").fadeOut(callback = function() {
    // on ne met plus en valeur la question dans le tableau
    $("#table-body-questions tr").removeClass("selected-question");
    // on modifie le titre
    $("#form-question h2").text("Ajouter une nouvelle question");

    // masquage croix pour fermer
    $(".close").hide();

    // on vide les champs de saisie
    $("#intitule").val("");
    $("#reponse1").val("");
    $("#reponse2").val("");
    $("#radioButton1").attr("checked", "checked"); // on coche la réponse 1 par défaut

    // on cache le bouton de mise à jour de question, on le remplace par celui d'ajout
    $("#button-modifier").hide();
    $("#button-add").show();
  });

  // et on affiche un formulaire vierge d'ajout de question
  $("#form-question").fadeIn();
}


// ===== COOKIES =====

/**
  * Fonction pour lire la valeur d'un cookie,
  * à partir de la valeur d'une clef
*/
function getCookie(clefParam) {
  var cookiearrray = document.cookie.split(";"); // on récupère un tableau de "clef=valeur"
  for(var i=0; i<cookiearrray.length; ++i) {
    var clef = cookiearrray[i].split("=")[0];
    if(clef == clefParam) // on trouve qu'il y a une question en cours de modification
      return cookiearrray[i].split("=")[1]; // on retourne son id
  }
  // si on ne trouve pas de question modifiée, on retourne -1
  return -1;
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

function alertSuccessUpdate() {
  Lobibox.notify('success', {
    title: 'Mise à jour réussie !',
    msg: 'Votre question a bien été mise à jour.',
    delayIndicator: false // pas de barre timer
  });
}

function alertFailUpdate() {
  Lobibox.notify('error', {
    title: 'Erreur !',
    msg: 'La question n\'a pas pu être mise à jour.',
    delayIndicator: false // pas de barre timer
  });
}
