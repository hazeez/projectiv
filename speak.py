from gtts import gTTS
from pydub import AudioSegment

import pyglet
import time,os



def tts(text, lang):
    file = gTTS(text=text, lang=lang)
    output_path = 'D:/Code/PythonProjects/projectiv/'
    filename = text.replace(" ","")
    extension = '.wav'
    pathname = output_path + filename + extension
    print(pathname)
    file.save(pathname)
    os.system(pathname)
    audio = AudioSegment.from_wav(pathname)
    converted_audio = audio.export(filename+'.mp3', format="mp3")
    music = pyglet.media.load(pathname + converted_audio)
    music.play()
    #os.remove(pathname)
