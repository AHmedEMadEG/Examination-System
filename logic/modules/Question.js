export class Question{
    constructor(question){
        this.id = question.id;
        this.question_body = question.question_body;
        this.answers = question.answers;
        this.correctAnswer = question.correct_answer;
        this.selectedAnswer = null;
        this.isCorrect = false;
        this.flagged = false;
    }
}
