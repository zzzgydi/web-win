import React, { useState } from "react";
import { getSimpleRandStr } from "@/utils/browser";
import BrowserBox from "@/components/BrowserBox/BrowserBox";
import Changeable from "@/components/Changeable/Changeable";
import styles from "@/assets/App.module.scss";

function App() {
  const [browsers, setBrowsers] = useState<any[]>([
    getSimpleRandStr(),
    getSimpleRandStr(),
    getSimpleRandStr(),
  ]);

  const onAddBrowser = () => {
    setBrowsers([...browsers, getSimpleRandStr()]);
  };

  const onDeleteBrowser = (key: string) => {
    let index = -1;
    browsers.forEach((bkey, idx) => {
      if (bkey === key) index = idx;
    });
    if (index >= 0) {
      browsers.splice(index, 1);
      setBrowsers([...browsers]);
    }
  };

  return (
    <div className="App">
      <Changeable
        dragger="self"
        top={50}
        left={500}
        width={250}
        height={60}
        className={styles.title}
      >
        <h1>A Title</h1>
      </Changeable>

      <Changeable
        dragger={`.${styles.btnEar}`}
        top={80}
        left={900}
        width={120}
        height={36}
        className={styles.addBtnBox}
      >
        <div className={styles.btnEar}>=</div>
        <button className={styles.addBtn} onClick={onAddBrowser}>
          新增窗口
        </button>
      </Changeable>

      {browsers.map((key, index) => (
        <BrowserBox
          key={key}
          top={index * 50 + 150}
          left={index * 50 + 100}
          onClose={() => onDeleteBrowser(key)}
        />
      ))}
    </div>
  );
}

export default App;
