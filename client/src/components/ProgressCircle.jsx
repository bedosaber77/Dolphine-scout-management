// import { useEffect, useRef } from 'react';
// import ProgressBar from 'progressbar.js';

// const ProgressCircle = ({
//   progress = 0.0,
//   duration = 1400,
//   color = '#FFEA82',
// }) => {
//   const containerRef = useRef(null);
//   const progressBarRef = useRef(null);

//   useEffect(() => {
//     // Initialize ProgressBar.Circle only once
//     progressBarRef.current = new ProgressBar.Circle(containerRef.current, {
//       strokeWidth: 6,
//       easing: 'easeInOut',
//       duration: duration,
//       color: color,
//       trailColor: '#eee',
//       trailWidth: 1,
//       svgStyle: null,
//     });

//     return () => {
//       // Cleanup on component unmount
//       if (progressBarRef.current) {
//         progressBarRef.current.destroy();
//       }
//     };
//   }, [duration, color]);

//   useEffect(() => {
//     // Animate progress whenever `progress` changes
//     if (progressBarRef.current) {
//       progressBarRef.current.animate(progress); // Progress: 0.0 to 1.0
//     }
//   }, [progress]);

//   return <div ref={containerRef}></div>;
// };

// export default ProgressCircle;

import React, { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';

const ProgressCircle = ({
  progress = 0.0, // Progress value (0.0 to 1.0)
  duration = 1400,
  fromColor = '#aaa',
  toColor = '#00ff00',
  trailWidth = 10,
  strokeWidth = 10,
  size = '100px',
  fontSize = '2rem',
}) => {
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    // Initialize ProgressBar.Circle
    progressBarRef.current = new ProgressBar.Circle(containerRef.current, {
      color: fromColor,
      strokeWidth: strokeWidth,
      trailWidth: trailWidth,
      easing: 'easeInOut',
      duration: duration,
      text: {
        autoStyleContainer: false,
      },
      from: { color: fromColor, width: strokeWidth },
      to: { color: toColor, width: strokeWidth },
      step: function (state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        const value = Math.round(circle.value() * 100);

        if (value === 0) {
          circle.setText('');
        } else {
          circle.setText(value);
        }
      },
    });

    // Style the text
    const textStyle = progressBarRef.current.text.style;
    textStyle.fontFamily = '"Raleway", Helvetica, sans-serif';
    textStyle.fontSize = fontSize;

    return () => {
      // Cleanup on unmount
      if (progressBarRef.current) {
        progressBarRef.current.destroy();
      }
    };
  }, [fromColor, toColor, duration, strokeWidth, trailWidth, fontSize]);

  useEffect(() => {
    // Animate progress whenever `progress` changes
    if (progressBarRef.current) {
      progressBarRef.current.animate(progress);
    }
  }, [progress]);

  return (
    <div
      className="relative"
      style={{ width: `${size}`, height: `${size}` }}
      ref={containerRef}
    ></div>
  );
};

export default ProgressCircle;
