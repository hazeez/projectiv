import speech_recognition as sr
from app.reservation_app import speak

r = sr.Recognizer()

with sr.Microphone() as source:
    print('Say Something!')
    r.adjust_for_ambient_noise(source, duration=1)
    audio = r.listen(source)
    print('Done')

try:
    text = r.recognize_google(audio)
    print('Google thinks you said \n' + text)
    lang = 'en'
    speak.tts(text, lang)


except Exception as e:
    print(e)