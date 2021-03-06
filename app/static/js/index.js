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
    var right_key_presses = -1;


    // This block is called every time the Speech APi captures a line.
    recognition.onresult = function(event) {

      // event is a SpeechRecognitionEvent object.
      // It holds all the lines we have captured so far.
      // We only need the current one.
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
        var right_key_presses_mod = 0;
        var right_key_divisor;


        $('body').keydown(function(e) {

            //declare global variables


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
                },4000);
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
                },4000);
            }
            else{
                var tostation_speech_text = $("#tostation").attr("speech-set-text") + ' ' + $("#tostation").val();
                readOutLoud(tostation_speech_text);
              }
        } // end of if down_key_presses = 2

        if (down_key_presses_mod == 0) {
            $("#btn-submit").focus();
            readOutLoud("Press Down arrow key to verify the provided source and destination stations");
            readOutLoud("or else press enter key to display the trains between source and destination station")


        } // end of if down_key_presses = 3


        console.log("from station given is: " + fromstation_value);
        console.log("to station given is : " + tostation_value);
        console.log('down_key_pressed:' + down_key_presses);
    }

    if (e.keyCode == 39){

        e.preventDefault();
        right_key_presses += 1;

        right_key_presses_mod = right_key_presses % right_key_divisor;

        for(var i=0; i<right_key_divisor;i++){
            if (right_key_presses_mod == i) {
            var elementid = '#'+i;
            $(elementid).focus();
            var thistrainname = $(elementid).attr('trainname');
            var thisavailability = $(elementid).attr('availability');
            if (thisavailability.toLowerCase() == "yes"){
                var readmessage = "Ticket is available in " + thistrainname;
                var readmessage1 = "Hit Enter to book the ticket in "+ thistrainname;
                var readmessage2 = "Or else, press right arrow key to see next available trains";
                    readOutLoud(readmessage);
                    readOutLoud(readmessage1);
                    readOutLoud(readmessage2);



            }
            else {
                var readmessage = 'Ticket is not available in ' + thistrainname;
                var readmessage1 = "press right arrow key to see next available trains";
                readOutLoud(readmessage);
                readOutLoud(readmessage1);

            } // end of if else statement

        } // end of if construct right key presses mod
        } // end of for loop

    } // end of key code 39 if construct


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

}); // end of body key down function


        var table_element = "";

        $('#form-journey').on('submit',function(e){
        e.preventDefault();
        var tostation_value = $("#tostation").val();
        var fromstation_value = $("#fromstation").val();
        frm_serialized = $(this).serialize();


        $.ajax({
                url: "/reservation/index",
                method: "POST",
                data : frm_serialized,
                success: function(data) {
                    if (data.trains.length == 0) {
                        var readmessage = 'There are no trains running between ' + fromstation_value  + ' and ' + tostation_value;
                        var readmessage1 = "Press down key to try again!";
                        readOutLoud(readmessage);
                        readOutLoud(readmessage1);
                        $('#fromstation').val("");
                        $('#tostation').val("");
                    }
                    else{

                    right_key_divisor = data.trains.length;
                    console.log(right_key_presses_mod);

                    table_element = "<table class='table table-striped'>" +
                        "<thead><tr>" +
                        "<th scope='col'>S.No</th>" +
                        "<th scope='col'>Train Number</th>" +
                        "<th scope='col'>Train Name</th>" +
                        "<th scope='col'>Availability</th>" +
                        "<th scope='col'>From Station</th>" +
                        "<th scope='col'>To Station</th>" +
                        "<th scope='col'>Action</th>" +
                        "</tr>" +
                        "</thead>" +
                        "<tbody>";


                    for (var i = 0; i < data.trains.length; i++) {
                        var j = i + 1;
                        table_element += "<tr> <th scope='row'>" + j + "</th>" +
                            "<td>" + data.trains[i].trainnumber + "</td>" +
                            "<td>" + data.trains[i].trainname + "</td>" +
                            "<td>" + data.trains[i].availability + "</td>" +
                            "<td>" + data.trains[i].fromstation + "</td>" +
                            "<td>" + data.trains[i].tostation + "</td>" +
                            "<td> <a type='button' class='btn btn-primary' id='"+ i + "' dbid='" + data.trains[i].id + "' trainname='" + data.trains[i].trainname + "' availability='" + data.trains[i].availability + "' href='/reservation/passenger/" + data.trains[i].id + "'> Book Ticket</a></td></tr>";
                            // "<td> <input class='btn btn-primary'id='" + i + "' dbid='" + data.trains[i].id + "' type='submit' value='Book ticket' trainname='" + data.trains[i].trainname + "' availability='" + data.trains[i].availability + "'> </td></tr>";
                    }
                    table_element += "</tbody></table>";
                    // noinspection JSAnnotator
                    document.getElementById("train-details-div").innerHTML = table_element;

                    var readmessage = 'There are ' + data.trains.length + 'trains running between' + data.trains[0].fromstation + ' and ' + data.trains[0].tostation;
                    var readmessage1 = 'Press right arrow key to check availability in these trains';
                    readOutLoud(readmessage);
                    readOutLoud(readmessage1);
                } // end of else statement

                } // success function ends here
        }); // end of ajax

   }); // end of btn submit

}); // end of document ready




