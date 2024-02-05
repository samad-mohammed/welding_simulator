import React from "react";

function Alert(props) {
  const capitalize = (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };
  return  (
    <div>

    {props.alert && 
        <div
        className={`alert alert-${props.alert.type} alert-dismissible fade show m-0 p-0`}
        role="alert"
        >
          <strong>

            {props.alert.msg}
          </strong>
        </div>}
    </div>
  );
}

export default Alert;