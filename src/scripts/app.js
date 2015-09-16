$(document).ready(function() {
    var quiz = {};
    quiz.loadSounds = function() {
        createjs.Sound.registerSound("assets/sounds/celebration.mp3", 1);
        createjs.Sound.registerSound("assets/sounds/goodbye.m4a", 2);
        createjs.Sound.registerSound("assets/sounds/fail.mp3", 3);
        createjs.Sound.registerSound("assets/sounds/cashing.mp3", 4);
    };
    quiz.loadQuestions = function() {
        $.getJSON("questions.json", function(json) {
            quiz.questions = json;

            var readyForAction = buildDOMTree(quiz.questions);

            function buildDOMTree(questions) {
                // loop through questions and set the html up
                var block = quiz.questionsBlock;
                $.each(questions, function(idx, question) {
                    var node = $('<div>').addClass('quiz-question');
                    node.append($('<h3>').text(question.title));

                    // loop through answers and set the element up
                    var answersBlock = $('<div>').addClass('row').addClass('quiz-answers');
                    $.each(question.answers, function(idx, answer) {
                        var answerDiv = $('<div>').addClass('col-sm-6').addClass('quiz-answer').attr('name', idx);
                        answerDiv.append($('<button>').addClass('quiz-button').text(answer.text));
                        answersBlock.append(answerDiv);
                    });
                    node.append(answersBlock);

                    block.append(node);
                });

                return block;
            }

            // listeners
            $('.quiz-answer').click(function() {
                quiz.checkAnswer(this);
            });

            $('.quiz-button-all-in').click(function() {
                quiz.reset();
            });

            $('.quiz-button-go-home').click(function() {
                window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
            });

            //debugging
            // quiz.correctAnswers = 0;
            // quiz.goToQuestion(4);

        });
    };
    quiz.goToQuestion = function(number) {
        // if we try to navigate to a question out of bounds
        if (number == quiz.questions.length + 1) {
            quiz.finishQuiz();
            return;
        }

        quiz.atQuestion = number;
        quiz.setTimeline();
        $('#quiz_block_panel h4')[0].innerHTML = 'QUESTION ' + number + ' OF ' + quiz.questions.length;
        $('.quiz-question').map(function(idx) {
            // ++ cuz of zero index
            if (++idx != number) {
                $(this).hide();
            } else {
                $(this).fadeIn();
            }
        });
    };
    quiz.setTimeline = function() {
        if (quiz.atQuestion == 1 && quiz.firstTime) {
            return;
        }

        var calcWidth = ((quiz.atQuestion - 1) / quiz.questions.length) * 100;
        $('#quiz_done_timeline').css('background-color', '#bfbfbf');
        $('#quiz_done_timeline').css('width', calcWidth + '%');

        if (quiz.hasEnded) {
            $('#quiz_done_timeline').css('background-color', '#F78F1E');
        }
    };
    quiz.checkAnswer = function(element) {
        // the element name holds the answerId
        if (quiz.processingAnswer === true) {
            console.log('Processing answer, please wait..');
            return;
        }

        quiz.processingAnswer = true;
        var answerId = $(element).attr('name');
        var timeoutL = 1000;

        if (quiz.questions[quiz.atQuestion - 1].answers[answerId].isCorrect) {
            //correct answer
            createjs.Sound.play(4);
            $(element).find('.quiz-button').addClass('quiz-button-correct');
            quiz.correctAnswers++;
        } else {
            createjs.Sound.play(3);
            $(element).find('.quiz-button').addClass('quiz-button-incorrect');
            // different timeoutL so ound can play out
            timeoutL = 3000;
        }

        setTimeout(function() {
            quiz.goToQuestion(++quiz.atQuestion);
            quiz.processingAnswer = false;
        }, timeoutL);
    };
    quiz.finishQuiz = function() {
        if (quiz.correctAnswers === 0) {
            createjs.Sound.play(2);
        }

        if (quiz.correctAnswers === quiz.questions.length) {
            createjs.Sound.play(1);
        }

        quiz.updateChart((quiz.correctAnswers / quiz.questions.length) * 100);
        quiz.setFinishText((quiz.correctAnswers / quiz.questions.length) * 100);

        $('#quiz_block_panel h4')[0].innerHTML = 'THAT\'S ALL FOLKS';
        quiz.hasEnded = true;
        quiz.setTimeline();
        // hide
        $('#quiz_questions').hide();
        // show finish
        $('#quiz_finish').fadeIn();
    };
    quiz.loadChart = function() {
        $('.chart').easyPieChart({
            barColor: '#F78F1E',
            lineWidth: '4',
        });
    };
    quiz.setFinishText = function(percentage) {
        if (percentage != 100 && percentage !== 0) {
            $('#quiz_finish h3')[0].innerText = 'MERELY AVERAGE.';
            $('#quiz_finish p')[0].innerText = 'Please go all in next time or give up trying!';
        } else if (percentage == 100) {
            $('#quiz_finish h3')[0].innerText = 'ALL HAIL THE QUIZMASTER!';
            $('#quiz_finish p')[0].innerHTML = 'You are the boss and you should be celebrating <strong>right now!</strong>';
        } else {
            $('#quiz_finish h3')[0].innerText = 'ZERO CORRECT ANSWERS IS ALSO AN ACHIEVEMENT ';
            $('#quiz_finish p')[0].innerHTML = 'Please try again. It can\'t get any worse than this.';
        }

    };
    quiz.updateChart = function(value) {
        $('.chart').data('easyPieChart').update(value);
        $('.chart span')[0].innerText = Math.round(value) + '%';
    };
    quiz.init = function(reset) {
        quiz.processingAnswer = false;
        quiz.questions = quiz.questions || [];
        quiz.atQuestion = 0;
        quiz.quizBlock = $('#quiz_block');
        quiz.questionsBlock = $('#quiz_questions');
        quiz.correctAnswers = 0;
        quiz.hasEnded = false;
        quiz.firstTime = false;


        if (!reset) {
            quiz.loadQuestions();
            quiz.loadSounds();
            quiz.loadChart();
            quiz.firstTime = true;
        }

    };
    quiz.reset = function() {
        quiz.init(reset = true);
        createjs.Sound.stop(1);
        createjs.Sound.stop(2);
        createjs.Sound.stop(3);
        createjs.Sound.stop(4);
        quiz.resetButtonStates();
        quiz.goToQuestion(1);
        quiz.setTimeline();
        $('#quiz_finish').hide();
        $('#quiz_questions').fadeIn();
    };
    quiz.resetButtonStates = function () {
        $('.quiz-button-correct').map(function () {
            $(this).attr('class', 'quiz-button');
        });

        $('.quiz-button-incorrect').map(function () {
            $(this).attr('class', 'quiz-button');
        });
    };



    // debugging
    // quiz.init();
    // $('#quiz_intro').fadeOut();
    // quiz.quizBlock.fadeIn();

    // start quiz on user click
    $('#quiz_start').click(function() {
        quiz.init();
        // fade out intro text
        $('#quiz_intro').fadeOut(function() {
            // fade in the questions
            quiz.goToQuestion(1);
            quiz.quizBlock.fadeIn();
        });
    });




});
