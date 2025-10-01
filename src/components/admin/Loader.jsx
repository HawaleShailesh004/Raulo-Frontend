import React from "react";

const Loader = ({ size = 40, color = "white", message = "" }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50">
      <div
        className="animate-spin rounded-full border-4 border-t-4 border-gray-200"
        style={{ width: size, height: size, borderTopColor: color }}
      ></div>
      {message && <p className="mt-4 text-white text-sm">{message}</p>}
    </div>
  );
};

export default Loader;
