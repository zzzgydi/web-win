import React, { useState } from "react";
import Logo from "@/assets/favicon.svg";
import styles from "./UrlInput.module.scss";

interface UrlInputProps {
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = (props) => {
  const { value: pvalue = "", className = "", onChange = () => {} } = props;

  const [value, setValue] = useState<string>(pvalue);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onChange(value);
  };

  return (
    <div className={styles.container + " " + className}>
      <input
        className={styles.input}
        value={value}
        onKeyDown={onKeyDown}
        onChange={({ target }) => setValue(target.value)}
      />

      <button className={styles.button} onClick={() => onChange(value)} />
    </div>
  );
};

export default UrlInput;
