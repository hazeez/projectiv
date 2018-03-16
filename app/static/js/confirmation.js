
    // function to convert text into speech
    function readOutLoud(message) {
      var speech = new SpeechSynthesisUtterance();

      // Set the text and voice attributes.
      speech.text = message;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;

      window.speechSynthesis.speak(speech);
    }


// once the document is ready, wait for three seconds before playing the welcome message
    $(document).ready(function(){




        // set time out will hold the message to be played for three seconds before playing it. a value of 3000 indicates three seconds
        setTimeout(function(){
            // fnplayaudio("../../static/audio/welcome_audio.wav");
            var trainname=$("#confirmation-div").attr('trainname');
            readOutLoud('You have successfully booked the train ticket in '+ trainname);

        }, 1000);

        setTimeout(function(){


            readOutLoud('Press left arrow key to go to home page ');
            readOutLoud('Press right arrow key to logout');

        }, 2000);

        $('body').keydown(function(e) {


    if (e.keyCode==39)
    {
        e.preventDefault();
        $("#logout").focus();
        readOutLoud('hit enter to logout and redirect to sign in page');
    }


    if (e.keyCode==37)
    {
        e.preventDefault();
        $("#home").focus();
        readOutLoud('hit enter to book another ticket');
    }

});

});




