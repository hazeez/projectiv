#statement for enabling the development environment
DEBUG=True

#Define the application directory
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))


#Define the database we are working with
#SQLite for an example
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'app.db')
DATABASE_CONNECT_OPTIONS = {}
SQLALCHEMY_TRACK_MODIFICATIONS = False

#Enable protection against CSRF
CSRF_ENABLED = True

#Use a secure, unique and absolutely secret for signing the data
CSRF_SESSION_KEY = "secret"

#Secret key for signing cookies
SECRET_KEY = "secret"