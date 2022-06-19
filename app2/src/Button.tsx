import React from "react";

const Button = ({ text }: { text: string }) => {
  return (
    <div>
      <p>Text passed in to TypeScript button: {text}</p>
      <button>App 2 (TypeScript) Button</button>
    </div>
  );
};

export default Button;
