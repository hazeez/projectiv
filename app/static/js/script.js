// this script is intended to capture the key press event for the down arrow key
// this script also sends the key press event for down arrow key to the server - python backend


$(document).ready(function(){
    // initiate the key presses variable to keep a count on how many times down arrow is pressed
    var keypresses = 1;

    // declare a variable for the speech to text message.
    var message;

    // declare a couple of variables for from_station and to_station
    var fromstation = "";
    var tostation = "";

    // declare a variable for choice (yes / no); yes to proceed to booking and no to cancel the booking
    var booking_choice;

    console.log(message, ' ',keypresses);

    $("body").keydown(function(event){

        // 40 is the event code for down arrow
        // event.which will return the event code for the key pressed.
        if (event.which == 40) {

            //console.log("Key downarrow pressed");
            // increment the keypresses variable by 1 every time the down arrow is pressed if the message is successful.
            // else, do not increment
            if (message){
                keypresses += 1;
            }



            //  if the down arrow is pressed the first time, ask for the from station details
            if (keypresses == 1){
                $('#main-container').append('<div><h1> '+ 'From Station' + '</h1></div>');
                // play the audio to let the blind user know that the system is listening
                var audio_fromstation = new Audio('../static/audio/fromstation.wav');
                audio_fromstation.play();
            }
            //  if the down arrow is pressed the second time, ask for the to station details
            if (keypresses == 2){
                $('#main-container').append('<div><h1> '+ 'To Station' + '</h1></div>');
                // play the audio to let the blind user know that the system is listening
                var audio_tostation = new Audio('../static/audio/tostation.wav');
                audio_tostation.play();
            }
            //post the event and the message to the server side - python flask
            // the following will send the key press value and message value to the app route localhost:5000/1
            // the following javascript object can be accessed by the python backend as request.form['message'] and request.form['key_pressed']
            $.post("/1",
            {
                key_pressed: "down arrow",
                key_presses: keypresses,
                from_station: fromstation,
                to_station: tostation,
                //value: "1",
                message: "Listening ..."
            }, function (data) {
                    //console.log(data.message);
                    message = data.message;
                    console.log('data.message :', message);

                    if (message){
                        // if the message is set, print it on the screen
                        $('#main-container').append('<div><h1>'+ data.message +'</h1></div>');
                        // if key presses = 1 set the from station object to data.message
                        // if key presses = 2, set the to station object to data.message
                        // if key presses = 3, set the choice to data.message

                        console.log("data.key_presses: ", data.key_presses);

                        if (data.key_presses == 1){
                            fromstation = data.message;
                        }
                        if (data.key_presses == 2){
                            tostation = data.message;
                            console.log('To station :', tostation);
                        }

                    }
                    else {
                        // if the message is not set or undefined, print sorry try again on the screen
                        // and play the audio.
                        // this should only play for the from and to stations.
                        //so check if the keypresses are less than or equal to 2

                        console.log("KeyPresses: ", keypresses);
                        if (keypresses <=2) {
                            $('#main-container').append('<div><h1>'+ "Sorry, try again!" +'</h1></div>');
                            var audio_tryagain = new Audio('../static/audio/sorrypleasetryagain.wav');
                            audio_tryagain.play();
                        }

                        // unset the message variable
                        delete(message);
                    }
            });
        }
        // 13 is the event code for enter key; prevent any action if enter is pressed like automatic submit
        if (event.which == 13) {
            event.preventDefault();
        }
    });
});