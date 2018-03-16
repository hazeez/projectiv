# import dependencies

from flask import request, jsonify, render_template, Blueprint, flash, g, session, redirect, url_for
import speech_recognition as sr
from flask_login import login_required, current_user, login_user, logout_user
from flask_migrate import Migrate
import pyglet, os
from app import app, db


#import module forms
from app.reservation_app.forms import LoginForm, StationsForm, PassengerForm

#import models
from app.reservation_app.models import Users, Trains, Passengers

#Define the blueprint
reservation_app = Blueprint('reservation', __name__, url_prefix='/reservation')

# instantiate the migration utility
# Flask migrate will help to update the db as and when it is needed without the data being lost
migrate = Migrate(app, db)


#instantiate the recognizer
r = sr.Recognizer()

# select the driver for pyglet to play audio files
# These must be installed at the client machines
pyglet.options['audio'] = ['openal', 'pulse', 'silent']


@reservation_app.route("/login", methods=['GET','POST'])
def login():

    if current_user.is_authenticated:
        return redirect(url_for('reservation.index'))
    form = LoginForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        username = username.lower()
        password = password.lower()

        if username is None or password is None:
            flash('Invalid username or password')
            return redirect(url_for('reservation.login'))

        try:
            user = Users.query.filter_by(username=username).first()
        # get user id, name and the password from the database

            get_db_user_name = user.username
            get_db_user_password = user.password
            # validate both username and password matches with the db username and db password
            if (username == get_db_user_name and password == get_db_user_password):
                login_user(user, remember=None)
                return redirect(url_for('reservation.index'))
            else:
                flash('Invalid username or password')
                return redirect(url_for('reservation.login'))
        except AttributeError:
            flash('Invalid username or password')
    return render_template('reservation_app/login.html',form=form)


@reservation_app.route("/index", methods=['GET','POST'])
@login_required
def index():

    form = StationsForm()

    try:
        if request.method == 'POST':
            fromstation = request.form['fromstation']
            tostation = request.form['tostation']
            print('from station :', fromstation, 'to station :', tostation)
            trains = Trains.query.filter_by(fromstation=fromstation,tostation=tostation)
            return jsonify(trains=[i.serialize for i in trains.all()])
    except AttributeError:
        flash('No train information exists')

    return render_template('reservation_app/index.html',form=form)


@reservation_app.route("/passenger/<int:value>", methods=['GET','POST'])
@login_required
def passenger(value):

    form = PassengerForm()

    selectedtrain = Trains.query.filter_by(id=value).first()

    trainnumber = selectedtrain.trainnumber
    trainname = selectedtrain.trainname
    fromstation = selectedtrain.fromstation
    tostation = selectedtrain.tostation
    print(trainname)

    if form.validate_on_submit():
        passengername = form.passengername.data
        passengerage = form.passengerage.data
        passengersex = form.passengersex.data
        passengerpreference = form.passengerpreference.data
        passengername = passengername.upper()
        passengersex = passengersex.upper()
        passengerpreference = passengerpreference.upper()

        new_passenger = Passengers(passengername=passengername,passengerage=passengerage,passengersex=passengersex,passengerpreference=passengerpreference)
        db.session.add(new_passenger)
        db.session.commit()
        return render_template('reservation_app/confirmation.html', message=trainname)


    return render_template('reservation_app/passenger.html',form=form,trainnumber=trainnumber,trainname=trainname,fromstation=fromstation,tostation=tostation)


@reservation_app.route("/confirmation", methods=['GET','POST'])
@login_required
def confirmation():
    return render_template('reservation_app/confirmation.html')




@reservation_app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('reservation.login'))