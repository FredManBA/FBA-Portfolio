import styles from './Wordmark.module.css';

/** Provisional FBA wordmark. Replace this component when the final logo exists. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={className ? `${styles.wordmark} ${className}` : styles.wordmark}
      aria-hidden="true"
    >
      FB<span className={styles.accent}>A</span>
    </span>
  );
}
