const Alert = ({ type, message, hidden }) => {
  return (
    <>{hidden ? <></> : <div className={`alert ${type}`}>{message}</div>}</>
  );
};

export default Alert;
