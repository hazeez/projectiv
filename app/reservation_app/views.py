# import dependencies

from flask import request, jsonify, render_template, Blueprint, flash, g, session, redirect, url_for
import speech_recognition as sr
from flask_login import login_required, current_user, login_user, logout_user
from flask_migrate import Migrate
import pyglet, os
from app import app, db, login


#import module forms
from app.reservation_app.forms import LoginForm, StationsForm, PassengerForm

#import models
from app.reservation_app.models import Users

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
    form = LoginForm(request.form)

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


@reservation_app.route("/index", defaults={'value':0})
@reservation_app.route("/index/<int:value>", methods=['GET','POST'])
@login_required
def index(value):

    form = StationsForm(request.form)

    if form.validate_on_submit():
        fromstation = form.fromstation.data
        tostation = form.tostation.data
        fromstation = fromstation.lower()
        tostation = tostation.lower()

        if fromstation is None or tostation is None:
            flash('Please provide From station and To station')
            return redirect(url_for('reservation.index'))

        try:
            train = Trains.query.filter_by(fromstation=fromstation,tostation=tostation).first()

        # get from station, and the to station from the database

            get_db_from_station = train.fromstation
            get_db_to_station = train.tostation
            # validate both fromstation and tostation matches with the db username and db password
            if (fromstation == get_db_from_station and tostation == get_db_to_station):
                pass
            else:
                flash('No trains exists between from and to stations')
                pass
        except AttributeError:
            flash('No train information exists')
    return render_template('reservation_app/index.html',form=form)

@reservation_app.route("/passenger", defaults={'value':0})
@reservation_app.route("/passenger/<int:value>", methods=['GET','POST'])
@login_required
def passenger(value):

    form = PassengerForm(request.form)

    if form.validate_on_submit():
        passengername = form.passengername.data
        passengerage = form.passengerage.data
        passengersex = form.passsengersex.data
        passengerpreference = form.passengerpreference.data
        passengername = passengername.upper()
        passengersex = passengersex.upper()
        passengerpreference = passengerpreference.upper()

        if passengername is None or passengerage is None or passengersex is None or passengerpreference is None:
            flash('Please provide Passenger Booking Details')
            return redirect(url_for('reservation.passenger'))
        else:
            flash('Booking Successful')

    return render_template('reservation_app/passenger.html',form=form)


@reservation_app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('reservation.login'))