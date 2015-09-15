$(document).ready(function() {
    var quiz = {};
    quiz.questions = [];
    quiz.quizBlock = $('#quiz_block');
    quiz.questionsBlock = $('#quiz_questions');
    quiz.goToQuestion = function (number) {
        $('.quiz-question').map(function (idx) {
            // ++ cuz of zero index
            if (++idx != number) {
                $(this).hide();
            }
        });
    };

    createjs.Sound.registerSound("assets/sounds/thunder.mp3", 1);

    $.getJSON("questions.json", function(json) {
        quiz.questions = json;

        var readyForAction = buildDOMTree(quiz.questions);

        function buildDOMTree(questions) {
            // loop through questions and set the html up
            var block = quiz.questionsBlock;
            $.each(questions, function (idx, question) {
                var node = $('<div>').addClass('quiz-question');
                node.append($('<h1>').text(question.title));

                // loop through answers and set the element up
                var answersBlock = $('<div>').addClass('quiz-answers');
                $.each(question.answers, function (idx, answer) {
                    var answerDiv = $('<div>').addClass('quiz-answer');
                    answerDiv.append($('<button>').addClass('quiz-button').text(answer.text));
                    answersBlock.append(answerDiv);
                });
                node.append(answersBlock);

                block.append(node);
            });

            return block;
        }

        // start quiz on user click
        $('#quiz_start').click(function () {
            createjs.Sound.play(1);
            // fade out intro text
            $('#quiz_intro').fadeOut(function () {
                createjs.Sound.stop(1);

                // fade in the questions
                quiz.goToQuestion(1);
                quiz.quizBlock.fadeIn();
            });
        });
    });


});
