from .app import db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contenu=db.Column(db.String)
    reponse1=db.Column(db.String)
    reponse2=db.Column(db.String)
    bonneReponse=db.Column(db.Integer)
    instances=relationship("InstanceQuestion")
    def toDict(self):
        return {"id":self.id,"contenu":self.contenu,"reponse1":self.reponse1, "reponse2":self.reponse2}

    """ SETTERS """
    def setContenu(self, newContenu):
        self.contenu = newContenu

    def setReponse1(self, newReponse1):
        self.reponse1 = newReponse1

    def setReponse2(self, newReponse2):
        self.reponse2 = newReponse2

    def setBonneReponse(self, newBonneReponse):
        self.bonneReponse = newBonneReponse

    @staticmethod
    def getRandomId():
        import random
        from sqlalchemy.sql.expression import func
        results = Question.query.all()
        nbQuestions = db.session.query(Question).count()
        randomIndex = random.randint(0, nbQuestions) # indice aléatoire pour la question à sélectionner
        print("randomIndex = "+str(randomIndex))
        print("Nombre de questions trouvées : "+str(nbQuestions))
        i = 0
        for question in results:
            if i==randomIndex:
                return question.id
            else:
                i += 1


class InstanceQuestion(db.Model):
    __tablename__ = 'instancequestion'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, ForeignKey('question.id'))
    date = db.Column(db.DateTime)
    reponses=relationship("Reponse")
    def toDict(self):
        return {"id":self.id,"question_id":self.question_id, "date":self.date.strftime("%d/%m %H:%M:%S")}

    def __repr__(self):
        return self.id


class Reponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    instancequestion_id= db.Column(db.Integer, ForeignKey('instancequestion.id'))
    reponse=db.Column(db.Integer)
    user=db.Column(db.Integer)
    date = db.Column(db.Date)
    def toDict(self):
        instanceQ=InstanceQuestion.query.get(self.instancequestion_id)
        q=Question.query.get(instanceQ.question_id)
        return {"question":q.contenu,"reponse":q.reponse1 if self.reponse==1 else q.reponse2, "bonneReponse":q.reponse1 if q.bonneReponse==1 else q.reponse2 }
