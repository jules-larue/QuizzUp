#! /usr/bin/env python3
from flask import Flask
app = Flask(__name__)
app.debug = True
app.config['BOOTSTRAP_SERVE_LOCAL'] = True

from flask.ext.script import Manager
manager = Manager(app)

from flask.ext.bootstrap import Bootstrap
Bootstrap(app)

import os.path
def mkpath(p):
	return os.path.normpath(
		os.path.join(
			os.path.dirname(__file__),
			p))

from flask.ext.sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = ('sqlite:///'
+mkpath('../quest.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db=SQLAlchemy(app)
