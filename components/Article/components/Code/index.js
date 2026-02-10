import styles from "./style.module.scss";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/cjs/prism";

export default function Code({ language, blocks }) {
  function parseAnnotations(text) {
    if (!text) return;

    return text.plain_text;
  }
  return (
    <div className={styles.codeContainer}>
      {/* <div className={styles.tagContainer}>
        <Tag color="yellow" name={language} />
      </div> */}
      <span className={styles.label}>{language} code</span>
      <code className={styles.code}>
        <SyntaxHighlighter language={language}>
          {blocks.map((text) => {
            return parseAnnotations(text);
          })}
        </SyntaxHighlighter>
      </code>
    </div>
  );
}
