from .app import app, db
from .models import Question, InstanceQuestion, Reponse
from datetime import date
from flask import Flask, request,jsonify, render_template
import sys,datetime
import json


@app.route("/admin/")
def admin():
    return render_template("admin.html")

@app.route("/question/", methods=["POST"] )
def post_question():
    print("Vous avez effectué une requete post avec les paramètres:" + str(request.json))
    return "Bravo, vos données ont été postées" ## TODO : ne fait rien ici, si vous en avez besoin, modifiez ce code !

@app.route("/question/", methods=["PUT"] )
def put_question():
    print(request.json)
    if request.json and {"contenu","reponse1","reponse2","bonneReponse"}.issubset(request.json.keys()):
        q=Question(**request.json)
        db.session.add(q)
        db.session.commit()
        print("Question ajoutée")
        return jsonify( {"success": True, "question": q.toDict()} )
    else:
        return jsonify( {"success": False} )

@app.route("/question/", methods=["GET"] )
def get_questions():
    return jsonify({"Questions":[x.toDict() for x in Question.query.all()]})

@app.route("/question/<int:question>", methods=["DELETE"] )
def delete_question(question):
    q=Question.query.get(question)
    if not q:
        return jsonify( {"success": False} )
    db.session.delete(q)
    db.session.commit()
    return jsonify( {"success": True} )


@app.route("/reponse/", methods=["PUT"] )
def put_reponse():
    if request.json and {"id","reponse"}.issubset( request.json):
        reponse=Reponse(instancequestion_id=request.json["id"], reponse=request.json["reponse"])
        db.session.add(reponse)
        db.session.commit()
        return "Bravo, votre réponse est enregistrée"
    else:
        return "Probleme dans votre reponse"

@app.route("/instance/", methods=["GET"] )
def get_instance():
    recente=InstanceQuestion.query.filter(InstanceQuestion.date>=(datetime.datetime.now()-datetime.timedelta(minutes=1))).all()
    if (len(recente)>0):
        instance=recente[0]
    else:
        instance=InstanceQuestion(question_id=1, date=datetime.datetime.now())
        db.session.add(instance)
        db.session.commit()

    return jsonify(instance.toDict())

@app.route("/resultats/<int:instance_id>", methods=["GET"] )
def get_resultats(instance_id):
    instance=InstanceQuestion.query.get(instance_id)
    reponses=Reponse.query.filter(Reponse.instancequestion_id==instance_id).all()
    return jsonify({"reponses":[x.toDict() for x in reponses]})
