from flask import Flask, render_template
import speech_recognition as sr
import speak, pyglet, time, os

app = Flask(__name__)
r = sr.Recognizer()
# select the driver for pyglet to play audio files
# These must be installed at the client machines
pyglet.options['audio'] = ['openal', 'pulse', 'silent']


@app.route("/")
def speech_to_text():
    # when the page loads, the following file should be played

    # music = pyglet.media.load('D:/Code/PythonProjects/projectiv/tostation.wav')
    # music.play()

    # prolong further execution of the code till the music plays
    # time.sleep(1)

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


if __name__ == '__main__':
    app.run(debug=True)
