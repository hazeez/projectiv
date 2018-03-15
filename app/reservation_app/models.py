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

class Trains(db.Model):
    __tablename__ = 'trains'
    id = db.Column(db.Integer, primary_key=True)
    trainnumber = db.Column(db.Integer)
    trainname = db.Column(db.String(64))
    availablity = db.Column(db.String(64))
    fromstation = db.Column(db.String(64))
    tostation = db.Column(db.String(64))

# new instance instantiation procedure
    def __init__(self, id,trainnumber,trainname,availablity,fromstation,tostation):
        self.id = id
        self.trainnumber = trainnumber
        self.trainname = trainname
        self.availablity = availablity
        self.fromstation = fromstation
        self.tostation = tostation

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return dict(id=self.id, trainnumber=self.trainnumber, trainname=self.trainname, availability=self.availablity,
                    fromstation=self.fromstation, tostation=self.tostation)

#this function will provide the serial number,train name,train name, and availblity when the table trains is queried
    def __repr__(self):
        return '<train_name {}>'.format(self.trainname)


class Passengers(db.Model):
    __tablename__ = 'passengers'
    id = db.Column(db.Integer, primary_key=True)
    passengername = db.Column(db.String(64))
    passengerage = db.Column(db.Integer)
    passengersex = db.Column(db.String(64))
    passengerpreference = db.Column(db.String(64))

# new instance instantiation procedure
    def __init__(self, id,trainnumber,trainname,availablity,fromstation,tostation):
        self.id = id
        self.passengername = passengername
        self.passengerage = passengerage
        self.passengersex = passengersex
        self.passengerpreference = passengerpreference


#this function will provide the serial number,train name,train name, and availblity when the table trains is queried
    def __repr__(self):

        return '<passenger_name {}>'.format(self.passengername)