#import form
# from flask_wtf import Form
from flask_wtf import FlaskForm

#import form elements such as text field and password field
from wtforms import StringField, PasswordField, SubmitField

#import form validators
from wtforms.validators import DataRequired

# Define the login form

class LoginForm(FlaskForm):
    username = StringField('User Name', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Sign In')


# Define the stations form

class StationsForm(FlaskForm):
    fromstation = StringField('From Station', validators=[DataRequired()])
    tostation = StringField('To Station', validators=[DataRequired()])
    submit = SubmitField('Submit')
