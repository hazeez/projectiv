            // enable speech recognition
    // The first thing we need to do is check if the user has access to the API
    // and show an appropriate error message. Unfortunately, the speech-to-text API is
    // supported only in Chrome and Firefox (with a flag)


    // The recognition variable will give us access to all the API's methods and properties.

    try {
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      var recognition = new SpeechRecognition();
    }
    catch(e) {
        console.error(e);
        $('.no-browser-support').show();
        $('.app').hide();
    }


    /*-----------------------------
          Voice Recognition
    ------------------------------*/

    // If false, the recording will stop after a few seconds of silence.
    // When true, the silence period is longer (about 15 seconds),
    // allowing us to keep recording even when the user pauses.
    recognition.continuous = false;

    // set the speech recognition language
    recognition.lang = 'en-US';

    // set the maximum alternatives
    recognition.maxAlternatives = 1;

    // set a global variable transcript that holds the speech to text object
    var transcript = "";

    //declare a global variable
    // we will be triggering the start and stop of speech recognition using the down arrow key
    // hence, the following variable
    var down_key_presses = 0;

    // This block is called every time the Speech APi captures a line.
    recognition.onresult = function(event) {

      // event is a SpeechRecognitionEvent object.
      // It holds all the lines we have captured so far.
      // We only need the current one.
      //var current = event.resultIndex;
        var current = event.results.length - 1;

      // Get a transcript of what was said.
      transcript = event.results[current][0].transcript;
      console.log(transcript);

      if (down_key_presses == 1){
          $("#fromstation").val(transcript);
          readOutLoud('Thank you. Press down arrow key to proceed');
      }

      if (down_key_presses == 2){
          $("#tostation").val(transcript);
          readOutLoud('Thank you. Press down arrow key to proceed');
      }
      //return transcript;

      // // Add the current transcript to the contents of our Note.
      // // There is a weird bug on mobile, where everything is repeated twice.
      // // There is no official solution so far so we have to handle an edge case.
      // var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
      //
      // if(!mobileRepeatBug) {
      //   noteContent += transcript;
      //   noteTextarea.val(noteContent);
      // }
    };


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

    // play audio function - this function will play the audio of the file given in the audio_path
    function fnplayaudio(audio_path){
           var audio_file = new Audio(audio_path);
           audio_file.play();
    }

    function playbeepsound(){
        fnplayaudio("../../static/audio/beep.wav");
    }


        // set time out will hold the message to be played for three seconds before playing it. a value of 3000 indicates three seconds
        setTimeout(function(){
            // fnplayaudio("../../static/audio/welcome_audio.wav");
            readOutLoud('you are successfully logged in');
        }, 2000);

        // $("#username").focus();

        setTimeout(function(){
            // fnplayaudio("../../static/audio/provide_login_credentials_audio.wav");
            readOutLoud('Please provide your source and destination stations');
        }, 7000);

        setTimeout(function(){
            // fnplayaudio("../../static/audio/login_submit_downkey_audio.wav")
            readOutLoud('Press down arrow key to proceed');
        }, 11000);

        var down_key_presses_mod = 0;

        $('body').keydown(function(e) {
    if (e.keyCode==40) {

        e.preventDefault();
        down_key_presses += 1;
        console.log('down key pressed : ' + down_key_presses);
        console.log('down key press mod : ' + down_key_presses_mod);

        var tostation_value = $("#tostation").val();
        var fromstation_value = $("#fromstation").val();

        down_key_presses_mod = down_key_presses % 3;

        if (down_key_presses_mod == 1) {
            $("#fromstation").focus();
              if (!fromstation_value) {
                var fromstation_speech_text = $("#fromstation").attr("speech-unset-text") + " " + "after the beep";
                readOutLoud(fromstation_speech_text);
                setTimeout(function(){
                    recognition.start();
                    playbeepsound();
                    console.log("speech recognition started");
                },3000);
            }
            else{
                var fromstation_speech_text = $("#fromstation").attr("speech-set-text") + ' ' + $("#fromstation").val();
                readOutLoud(fromstation_speech_text);
              }
        } // end of if down_key_presses

        if (down_key_presses_mod == 2) {
            $("#tostation").focus();
              if (!tostation_value) {
                var tostation_speech_text = $("#tostation").attr("speech-unset-text") + " " + "after the beep";
                readOutLoud(tostation_speech_text);
                setTimeout(function(){
                    recognition.start();
                    playbeepsound();
                    console.log("speech recognition started");
                },3000);
            }
            else{
                var tostation_speech_text = $("#tostation").attr("speech-set-text") + ' ' + $("#tostation").val();
                readOutLoud(tostation_speech_text);
              }
        } // end of if down_key_presses = 2

        console.log("from station given is: " + fromstation_value);
        console.log("to station given is : " + tostation_value);
        console.log('down_key_pressed:' + down_key_presses);
    }



    // $("#btn-submit").click(function(){
    //    // alert("Clicked Submit");
    //     var tostation_value = $("#tostation").val();
    //     var fromstation_value = $("#fromstation").val();
    //     $.post('/reservation/index',
    //         {
    //             fromstation:fromstation_value,
    //             tostation:tostation_value
    //         },
    //         function(data){
    //             console.log(data.message);
    //         });
    //     return false;
    // });

        //     $('#btn-submit').on('click',function(e){
        // e.preventDefault();
        // var tostation_value = $("#tostation").val();
        // var fromstation_value = $("#fromstation").val();
        //
        //
        // $.ajax({
        //         url: "/reservation/index",
        //         method: "POST",
        //         data: {
        //             fromstation:fromstation_value,
        //             tostation:tostation_value
        //         },
        //         success: function(data) {
        //             console.log(data);
        //         }
        // }); // end of ajax




}); // end of body key down function


        $('#form-journey').on('submit',function(e){
        e.preventDefault();
        // var tostation_value = $("#tostation").val();
        // var fromstation_value = $("#fromstation").val();
        frm_serialized = $(this).serialize();

        $.ajax({
                url: "/reservation/index",
                method: "POST",
                data : frm_serialized,
                success: function(data) {
                    console.log(data);
                }
        }); // end of ajax

   }); // end of btn submit

}); // end of document ready




