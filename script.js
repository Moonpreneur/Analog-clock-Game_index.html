$(document).ready(function() {
    let isGameActive = false;
    let intervalID;
    let timeRemaining = 60;
    const GAME_MINUTES = 1;
    let countdown_interval;
    let game1;
    let clock1 = new Analog_clock(document.getElementById('analog_clock_canvas'));

    $('#timeremaining').hide();
    $('#instructions').hide();

    function startGame() {
        const gameDiv = document.getElementById('game');
        const gameOverDiv = document.getElementById('gameOver');
        const timeremainingvalue = document.getElementById('timeremainingvalue');
        
        if (isGameActive) {
            clearInterval(intervalID);
            clearInterval(countdown_interval);
            timeremainingvalue.textContent = '60'; 
            gameOverDiv.style.display = 'none';
            $("#play_again").text('Play Again');
            isGameActive = false;
            $("#student").prop("disabled", true);
            $("#check_answer").prop("disabled", true);
            $('#game').hide(); 
            $('#timeremaining').hide(); 
            $('#how_to_play').show(); 
            $('#instructions').hide(); 
        } else {
            $('#game').show(); 
            $('#timeremaining').show(); 
            $('#instructions').hide(); 
            $('#how_to_play').hide(); 
            timeRemaining = 60;
            intervalID = setInterval(updateTimer, 1000); 
            $("#play_again").text('Reset Game');
            isGameActive = true;
            $("#student").prop("disabled", false);
            $("#check_answer").prop("disabled", false);
            game1 = new Clock_game(clock1, $("#student_name").val());
            game1.start_round(); 
            $("#level").text("Level " + game1.curr_level);
            $("#correct_answers").text("Correct answers: " + game1.total_correct);
            $("#grade").text("");
            startCountdown(GAME_MINUTES);
        }
    }

    function updateTimer() {
        timeRemaining--;
        document.getElementById('timeremainingvalue').textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            clearInterval(intervalID);
            document.getElementById('gameOver').style.display = 'block';
            document.getElementById('score').textContent = game1.total_correct;
            isGameActive = false;
            $("#play_again").text('Play Again');
            clearInterval(countdown_interval);
            $("#student").prop("disabled", true);

            let gameOverSound = document.getElementById('gameover-sound');
            gameOverSound.currentTime = 0; 
            gameOverSound.play();

            setTimeout(function() {
                window.location.href = 'index.html'; 
            }, 3000);
        }
    }

    function startCountdown(minutes) {
        let countdown = minutes * 60;
    
        $("#timeremainingvalue").text(countdown);
        countdown_interval = setInterval(function() {
            countdown--;
            
            $("#timeremainingvalue").text(countdown);
            if (countdown <= 0) {
                clearInterval(countdown_interval);
                $("#play_again").click();
            }
        }, 1000);
    }

    function updateInfo() {
        let inputValue = $("#student").val();
        inputValue = formatTimeInput(inputValue);
        let correct = game1.process_answer(inputValue);
        $("#correct_answers").text("Correct answers: " + game1.total_correct);

        if (correct == 1) {
            $("#grade").html("✅ Correct!");
            $("#grade").css("color", "green");
            $("#student").attr("placeholder", "h:mm");
            document.getElementById('correct-sound').play();
        } else if (correct == 0) {
            $("#grade").html("❌ Incorrect!"); 
            $("#grade").css("color", "red"); 
            $("#student").attr("placeholder", $("#student").val());
            document.getElementById('incorrect-sound').play();
        } else if (correct == 2) {
            $("#grade").css("color", "green");
            $("#grade").html("✅ You finished the game! Well done!");
            setTimeout(function() {
                $("#play_again").click();
            }, 1500);
            return;
        } else {
            $("#grade").html("❌ Incorrect");
            $("<p>The time is " + game1.clock.time.toLocaleTimeString().substr(0, 8) + "<br>Click the clock to continue</p>")
                .hide().insertAfter($("#grade")).toggle(1000);
            $("#student").prop("disabled", true);
            $("#check_answer").prop("disabled", true);
            $("#analog_clock_canvas").click(function() {
                game1.start_round();
                $("#student").prop("disabled", false);
                $("#check_answer").prop("disabled", false);
                $("#student").val("");
                $("#student").attr("placeholder", "hmm");
                $("#grade + p").remove();
                $("#student").focus();
                $("#analog_clock_canvas").off("click");
            });
        }
        $("#student").val("");
        $("#grade").animate({fontSize: '1.5em'}, 200, function() { 
            $("#grade").animate({fontSize: '2.2em'}, 200) 
        });
        $("#level").text("Level " + game1.curr_level);
    }

    function formatTimeInput(input) {
        if (input.length === 3) {
            input = input[0] + ':' + input.substring(1);
        } else if (input.length === 4) {
            input = input.substring(0, 2) + ':' + input.substring(2);
        }
        return input;
    }

    $(window).keypress(function(e) {
        let key = e.keyCode || e.which;
        if ($("#student").get(0) === document.activeElement && key == 13) {
            updateInfo();
        } else if ($("#student_name").get(0) === document.activeElement && key == 13) {
            $("#play_again").click();
        }
    });

    $("#check_answer").click(function() {
        updateInfo();
    });

    $("#play_again").click(function() {
        startGame();
    });

    $("#how_to_play").click(function() {
        $('#instructions').show(); 
        $('#how_to_play').hide(); 
    });
});
