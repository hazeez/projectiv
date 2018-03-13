# import dependencies

from flask import request, jsonify, render_template, Blueprint, flash, g, session, redirect, url_for
import speech_recognition as sr
from flask_login import login_required, current_user, login_user
from flask_migrate import Migrate
import pyglet, os
from app import app, db, login

#import module forms
from app.reservation_app.forms import LoginForm

#import models
from app.reservation_app.models import Users

#Define the blueprint
reservation_app = Blueprint('reservation', __name__, url_prefix='/reservation')

# instantiate the migration utility
# Flask migrate will help to update the db as and when it is needed without the data being lost
migrate = Migrate(app, db)

# if an user is not authenticated, then login page should be shown
login.login_view = 'reservation.login'

#instantiate the recognizer
r = sr.Recognizer()

# select the driver for pyglet to play audio files
# These must be installed at the client machines
pyglet.options['audio'] = ['openal', 'pulse', 'silent']


@reservation_app.route("/login/", defaults={'value':0})
@reservation_app.route("/login/<int:value>", methods=['GET','POST'] )
def login(value):

    # initiate the down key presses variable to 3 to keep the mic switched off
    downkeypresses = 3

    if request.method == 'POST':
        print("I am here")
        mic_status = request.form['message']
        downkeypresses = int(request.form['downkeypresses'])
        print(mic_status)

    print("Downkeypresses :", downkeypresses)

    # Value = 1 is when the microphone will switch on else, it will return the standard text which is 'Say something'
    # if the down key is pressed for more than 2 times, the mic should not be switched on
    if (value == 1 and downkeypresses <=2):
        print("I am inside the mic construct")
        # Now get the user input via the microphone
        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source, duration=1)
            audio = r.listen(source)
            print(audio)
            try:
                text = r.recognize_google(audio)
                print(text)
                return jsonify(message=text, downkeypresses=downkeypresses)
            except Exception as e:
                return render_template('reservation_app/login.html', message='Please try again! ' + str(e))
                #return jsonify(message="Please try again!" + str(e))


    if current_user.is_authenticated:
        return redirect(url_for('reservation.index'))
    form = LoginForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        try:
            user = Users.query.filter_by(username=username).first()
        # get user id, name and the password from the database

            get_db_user_name = user.username
            get_db_user_password = user.password
            # validate both username and password matches with the db username and db password
            if (username == get_db_user_name and password == get_db_user_password):
                next_page = request.args.get('next')
                print(next_page)
                #return redirect(next_page)
                return redirect(url_for('reservation.index'))
            else:
                flash('Invalid username or password')
        except AttributeError:
            flash('Invalid username or password')

    return render_template('reservation_app/login.html',form=form)



@reservation_app.route("/", defaults={'value':0})
@reservation_app.route("/<int:value>", methods=['GET','POST'])
#@login_required
def index(value):

    # This function displays an .html page when the application starts
    # When the user speaks, the speech is converted into text and then displayed in the browser


    if request.method == 'POST':
        status_message = request.form['message']
        from_station = request.form['from_station']
        to_station = request.form['to_station']
        key_presses = request.form['key_presses']
        #value = request.form['value']
        print (status_message)
        print ('From station: ', from_station, ' ', 'To station: ', to_station)

    # Value = 1 is when the microphone will switch on else, it will return the standard text which is 'Say something'
    if (value == 1):
    # Now get the user input via the microphone
        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source, duration=1)
            audio = r.listen(source)

            try:
                text = r.recognize_google(audio)
                print(text)
                return jsonify(message=text, fromstation=from_station, tostation=to_station, key_presses=key_presses)

            except Exception as e:
                return render_template('reservation_app/index.html', message='Something went wrong! ' + str(e))

            # speak.tts(text, lang)
    else:
        return render_template('reservation_app/index.html', message='Say something!')

