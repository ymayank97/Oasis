pragma solidity >=0.8.1;
contract QA {
    struct Question {
        string question;
        address asker;
        uint256[] answerIds;
    }

    struct Answer {
        string answer;
        address responder;
        uint256 questionId;
    }

    // Mapping from questionId to Question
    mapping(uint256 => Question) public questions;

    // Mapping from answerId to Answer
    mapping(uint256 => Answer) public answers;

    // Counters for creating unique question and answer IDs
    uint256 public questionIdCounter;
    uint256 public answerIdCounter;

    function askQuestion(string memory _question) public {
        questions[questionIdCounter] = Question(_question, msg.sender, new uint256[](0));
        questionIdCounter++;
    }

    function answerQuestion(uint256 _questionId, string memory _answer) public {
        require(_questionId < questionIdCounter, "Question does not exist");

        answers[answerIdCounter] = Answer(_answer, msg.sender, _questionId);
        questions[_questionId].answerIds.push(answerIdCounter);
        answerIdCounter++;
    }

    function getQuestion(uint256 _questionId) public view returns (string memory question, address asker, uint256[] memory answerIds) {
        require(_questionId < questionIdCounter, "Question does not exist");
        Question memory q = questions[_questionId];
        return (q.question, q.asker, q.answerIds);
    }

    function getAnswer(uint256 _answerId) public view returns (string memory answer, address responder, uint256 questionId) {
        require(_answerId < answerIdCounter, "Answer does not exist");
        Answer memory a = answers[_answerId];
        return (a.answer, a.responder, a.questionId);
    }

    function getQuestionCount() public view returns (uint256) {
        return questionIdCounter;
    }

    function getAnswerCount(uint256 _questionId) public view returns (uint256) {
        require(_questionId < questionIdCounter, "Question does not exist");
        return questions[_questionId].answerIds.length;
    }
}
