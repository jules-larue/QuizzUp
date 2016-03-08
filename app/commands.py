from .app import manager, db
from .models import Question, InstanceQuestion, Reponse

@manager.command
def loaddb():
	'''
	Cree les tables
	'''

	#Création des tables
	db.create_all()
