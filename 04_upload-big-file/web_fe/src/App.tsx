import React, { FormEvent } from 'react';
import './App.css';

function App() {
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log(event);
    console.log(inputRef.current?.files);
    console.log(Object.prototype.toString.call(inputRef.current?.files));
    console.log(inputRef.current?.files?.[0] instanceof File);
  }

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='file'>选择文件</label>
      <input id='file' type='file' ref={inputRef} multiple={false} />
      <button type='submit'>提交</button>
    </form>
  );
}

export default App;
