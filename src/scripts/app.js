$(document).ready(function() {
    var questions = [];
    var questionsBlock = $('#quiz_questions');

    createjs.Sound.registerSound("assets/sounds/thunder.mp3", 1);

    $.getJSON("questions.json", function(json) {
        questions = json;

        var readyForAction = buildDOMTree(questions);
        console.log(readyForAction);

        function buildDOMTree(questions) {
            // loop through questions and set the html up
            var block = questionsBlock;
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

        questionsBlock.fadeIn();

        // start quiz on user click
        $('#quiz_start').click(function () {
            createjs.Sound.play(1);
            // fade out intro text
            $('#quiz_intro').fadeOut(function () {
                createjs.Sound.stop(1);

                // fade in the questions
                questionsBlock.fadeIn();
            });
        });
    });


});
