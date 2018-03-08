#This is the app.py file that has various functions attached to the application route

from flask import Flask, render_template
import speech_recognition as sr
import speak, pyglet, time, os

app = Flask(__name__)
r = sr.Recognizer()
# select the driver for pyglet to play audio files
# These must be installed at the client machines
pyglet.options['audio'] = ['openal', 'pulse', 'silent']

def dummytext():
    print("I am inside dummy text function")
    return render_template('base.html')


@app.route("/<int:value>")
def speech_to_text(value):

    # This function displays an .html page when the application starts
    # When the user speaks, the speech is converted into text and then displayed in the browser

    #print dummy text
    #dummytext()

    # Value = 1 is when the microphone will switch on else, it will return the standard text which is 'Say something'
    if (value == 1):
    # Now get the user input
        with sr.Microphone() as source:
            r.adjust_for_ambient_noise(source, duration=1)
            audio = r.listen(source)

            try:
                text = r.recognize_google(audio)
                print(text)
                #pathname = speak.tts(text, lang='en')
                #print(pathname)
                #play the audio file
                #play_audio_file(pathname)
                #speak.tts(text, lang='en')

                return render_template('index.html', message=text)

            except Exception as e:
                return render_template('index.html', message='Something went wrong! ' + str(e))

            # speak.tts(text, lang)
    else:
        return render_template('index.html', message='Say something!')

if __name__ == '__main__':
    app.run(debug=True)
