import React, { useState } from "react";
import styles from "./BrowserBox.module.scss";

interface BrowserHeadProps {
  url: string;
  className?: string;
  onApply?: () => void;
  onClose?: () => void;
}

const BrowserHead: React.FC<BrowserHeadProps> = (props) => {
  const [url, setUrl] = useState<string>(props.url);

  return (
    <div className={props.className + " " + styles.browserHead}>
      <input
        value={url}
        className={styles.urlInput}
        onChange={({ target }) => setUrl(target.value)}
      />

      <button className={styles.applyButton} />

      <button className={styles.closeButton} />
    </div>
  );
};

export default BrowserHead;
