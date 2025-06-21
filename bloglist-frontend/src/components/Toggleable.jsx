import { useState } from "react";
const Toggleable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(true);
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>cancel</button>
        {children}
      </div>
    </>
  );
};

export default Toggleable;
