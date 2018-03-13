//declare a global variable
var down_key_presses = 0;

// play audio function - this function will play the audio of the file given in the audio_path
function fnplayaudio(audio_path){
       var audio_file = new Audio(audio_path);
       audio_file.play();
}

// once the document is ready, wait for three seconds before playing the welcome message
    $(document).ready(function(){

        // set time out will hold the message to be played for three seconds before playing it. a value of 3000 indicates three seconds
        setTimeout(function(){
            fnplayaudio("../../static/audio/welcome_audio.wav");
        }, 3000);

        $("#username").focus();

        setTimeout(function(){
            fnplayaudio("../../static/audio/provide_login_credentials_audio.wav");
        }, 8000);

        setTimeout(function(){
            fnplayaudio("../../static/audio/login_submit_downkey_audio.wav")
        }, 12000);

        $('input').keydown(function(e) {
    if (e.keyCode==40) {

        e.preventDefault();
        down_key_presses += 1;

        var password_value = $("#password").val();
        var username_value = $("#username").val();

        if (down_key_presses == 1) {
            $("#username").focus();
            if (!username_value) {
                fnplayaudio("../../static/audio/username_audio.wav");
            }
        }


        // send a post request to the backend indicating the server to switch on the mic
        $.post("/reservation/login/1",
            {
                message: "mic is on",
                downkeypresses: down_key_presses,
                username: username_value,
                password: password_value
            }, function(data){
                if (data.downkeypresses == 1){
                    $("#username").val(data.message);
                    $("#password").focus()
                    if (!password_value) {
                        fnplayaudio("../../static/audio/pressing_downkey_password_audio.wav");
                    }
                }
                if (data.downkeypresses == 2){
                    console.log("password response is :" + data.message)
                    $("#password").val(data.message);
                    fnplayaudio("../../static/audio/login_submit_downkey_audio.wav")
                }
            });


        if(down_key_presses == 3){
            $("#submit").focus();
           // fnplayaudio("../../static/audio/login_submit_downkey_audio.wav")
        }
        console.log("password given is: " + password_value);
        console.log("username give is : " + username_value);
        console.log('down_key_pressed:' + down_key_presses);
    }


});

});




