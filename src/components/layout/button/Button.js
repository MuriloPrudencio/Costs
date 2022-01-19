import styles from "./Button.module.css";

function Button( {text}) {
  return (
    <div>
      <button className={styles.btn}>{text}</button>
    </div>
  )
}

export default Button;

