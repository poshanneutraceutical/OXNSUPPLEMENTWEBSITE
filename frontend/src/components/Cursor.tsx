import { useEffect, useState } from "react";

export default function Cursor() {

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });


  useEffect(() => {

    const moveCursor = (event: MouseEvent) => {

      setPosition({
        x: event.clientX,
        y: event.clientY,
      });

    };


    window.addEventListener(
      "mousemove",
      moveCursor
    );


    return () => {

      window.removeEventListener(
        "mousemove",
        moveCursor
      );

    };


  }, []);



  return (

    <>

      {/* Outer Glow */}

      <div

        className="
        fixed
        pointer-events-none
        z-[9999]
        w-10
        h-10
        rounded-full
        border
        border-[#1976C5]/40
        transition-transform
        duration-150
        "

        style={{

          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",

        }}

      />



      {/* Main Cursor */}

      <div

        className="
        fixed
        pointer-events-none
        z-[10000]
        w-3
        h-3
        rounded-full
        bg-[#1976C5]
        shadow-[0_0_20px_rgba(25,118,197,0.8)]
        "

        style={{

          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",

        }}

      />


    </>

  );

}