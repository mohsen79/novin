import classes from './Button.module.css';

const Button = ({ text, action }: { text: string, action: (result: React.MouseEvent<HTMLButtonElement>) => void }) => {
    return <button onClick={action} className={classes.button}>{text}</button>
}

export default Button;