#! /usr/bin/env python3
from flask import Flask
app = Flask(__name__)
app.debug = True

from flask.ext.script import Manager
manager = Manager(app)
