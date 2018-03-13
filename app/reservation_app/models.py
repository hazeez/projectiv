from app import db, login
from flask_login import UserMixin

class Users(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    password = db.Column(db.String(64))

# new instance instantiation procedure
    def __init__(self, name, password):
        self.username = name
        self.password = password

#this function will provide the username when the table users is queried
    def __repr__(self):
        return '<user {}>'.format(self.username)


@login.user_loader
def load_user(id):
    return Users.query.get(int(id))
