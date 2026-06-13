import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import classes from './Form.module.css';
import type { Average, CheckedAnswers, Question } from '../../types/form.types';
import { getSum } from '../../helpers/helperFunctions';

interface Props {
    questions: Question[]
    id: number
    setTotal: Dispatch<SetStateAction<Record<number, number>>>
    checkedAnswers: CheckedAnswers
    setCheckedAnswers: Dispatch<SetStateAction<CheckedAnswers>>
}

const storage = localStorage.getItem('checkedAnswers') as string;

const Form = ({ questions, id, setTotal, setCheckedAnswers, checkedAnswers }: Props) => {
    const [average, setAverage] = useState<Average>({});
    const result = getSum(average);

    const calculate = (checked: boolean, question: string, data: { answerId: number, score: number }, formId: number) => {
        const { answerId, score } = data;
        if (formId === id) {
            if (checked) setCheckedAnswers(prev => {
                const answers = new Map(prev);
                answers.set(answerId, { question, score, formId: id });
                return answers;
            });

            else setCheckedAnswers(prev => {
                const answers = new Map(prev);
                answers.delete(answerId);
                return answers;
            });

            setAverage(prev => {
                if (prev[question]) {
                    if (checked) return { ...prev, [question]: score + prev[question] }
                    else return { ...prev, [question]: average[question] - score }
                } else {
                    return { ...prev, [question]: score }
                }
            });
        }
    }

    useEffect(() => {
        localStorage.setItem('checkedAnswers', JSON.stringify([...checkedAnswers]));
        setTotal(prev => { return { ...prev, [id]: result } });
    }, [result]);

    useEffect(() => {
        const answers: CheckedAnswers = new Map(JSON.parse(storage));
        for (const [answerId, value] of answers) {
            const { question, score, formId } = value;
            calculate(true, question, { answerId, score }, formId);
        }
    }, []);

    return <div className={classes.form}>
        <div className={classes.title}>
            <h2>form {id}</h2>
            <h3>average: {result}</h3>
        </div>
        <form>
            <div className={classes.questions}>
                {questions.map((question) => <div key={question.question} className={classes.question}>
                    <h3>question {question.question}</h3>
                    <div className={classes.answers}>
                        {question.answers.map(answer => <div key={answer.answer} className={classes.answer}>
                            <input type='checkbox'
                                checked={checkedAnswers.has(answer.answerId) ? true : false}
                                id={String(answer.answer)} value={answer.score}
                                onChange={(e) => calculate(e.target.checked, question.question, answer, id)} />
                            <label htmlFor={String(answer.answer)}>answer {answer.answer}</label></div>)}
                    </div>
                </div>)}
            </div>
        </form>
    </div>;
}

export default Form;