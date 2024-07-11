export class Question{
    constructor(id,body,answers,correct_answer){
        this.id = id;
        this.question_body = body;
        this.answers = answers;
        this.correct_answer = correct_answer;
        this.selectedAnswer = null;
        this.flagged = false;
    }
}