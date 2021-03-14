import React, { useState } from "react";
import Changeable from "@/components/Changeable/Changeable";
import UrlInput from "@/components/UrlInput/UrlInput";
import styles from "./BrowserBox.module.scss";

interface BrowserBoxProps {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  onClose?: () => void;
}

const BrowserBox: React.FC<BrowserBoxProps> = (props) => {
  const { top = 120, left = 120, width = 300, height = 400 } = props;

  const [url, setUrl] = useState<string>("");

  return (
    <Changeable
      top={top}
      left={left}
      width={width}
      height={height}
      minWidth={200}
      minHeight={200}
      resizerWidth={4}
      className={styles.container}
      dragger={`.${styles.header}`}
    >
      <header className={styles.header}>
        <UrlInput value={url} onChange={setUrl} />

        <a className={styles.closeBtn} onClick={() => props?.onClose?.()} />
      </header>

      <main className={styles.main}>
        <iframe src={url} frameBorder="0" width="100%" height="100%" />
      </main>
    </Changeable>
  );
};

export default BrowserBox;
