// this script is intended to capture the key press event for the down arrow key
// this script also sends the key press event for down arrow key to the server - python backend


$(document).ready(function(){
    // initiate the key presses variable to keep a count on how many times down arrow is pressed
    var keypresses = 0;
    $("body").keydown(function(event){
        // 40 is the event code for down arrow
        if (event.which == 40) {
            //console.log("Key downarrow pressed");
            // increment the keypresses variable by 1 every time the down arrow is pressed
            keypresses += 1;

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
                //value: "1",
                message: "Listening ..."
            }, function (data) {
                    //console.log(data.message);
                    var message = data.message;
                    if (message){
                        // if the message is set, print it on the screen
                        $('#main-container').append('<div><h1>'+ data.message +'</h1></div>');
                    }
                    else {
                        // if the message is not set or undefined, print sorry try again on the screen
                        message = "Sorry, try again!";
                        $('#main-container').append('<div><h1>'+ message +'</h1></div>');
                    }
            });
        }
        // 13 is the event code for enter key; prevent any action if enter is pressed like automatic submit
        if (event.which == 13) {
            event.preventDefault();
        }
    });
});