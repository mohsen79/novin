interface Form {
    id: string,
    questions: Question[]
}

interface Answer {
    answerId: number
    answer: number | string
    score: number
}

interface Question {
    question: string
    answers: Answer[]
}

type CheckedAnswers = Map<number, { question: string, score: number, formId: number }>

type Average = Record<string, number>;

export type { Form, Answer, Question, Average, CheckedAnswers };