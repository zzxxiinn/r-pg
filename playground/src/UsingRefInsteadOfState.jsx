import React, { useRef } from 'react';

export const UsingRefInsteadOfState = () => {
  // 滥用 useState，非受控组件可以直接通过 ref 从 dom 上取值
  // 如果你定义的 state 没有其他渲染用途，完全可以用 ref 替代。
  const emailRef = useRef('');
  const passwordRef = useRef('');

  function onSubmit(e) {
    e.preventDefault();
    console.log({
      email: emailRef.current.value,
      passwor: passwordRef.current.value
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="email">Email</label>
      <input ref={emailRef} type="email" id="email" />
      <label htmlFor="password">Password</label>
      <input ref={passwordRef} type="password" id="password" />
      <button type="submit">Submit</button>
    </form>
  );
};
