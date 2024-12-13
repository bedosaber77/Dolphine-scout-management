// import , { useEffect, useRef } from 'react';
// import ProgressBar from 'progressbar.js';

// const ProgressCircle = ({
//   progress = 0.0, // Progress value (0.0 to 1.0)
//   duration = 1400,
//   fromColor = '#aaa',
//   toColor = '#00ff00',
//   trailWidth = 10,
//   strokeWidth = 10,
//   size = '100px',
//   fontSize = '2rem',
// }) => {
//   const containerRef = useRef(null);
//   const progressBarRef = useRef(null);

//   useEffect(() => {
//     // Initialize ProgressBar.Circle
//     progressBarRef.current = new ProgressBar.Circle(containerRef.current, {
//       color: fromColor,
//       strokeWidth: strokeWidth,
//       trailWidth: trailWidth,
//       easing: 'easeInOut',
//       duration: duration,
//       text: {
//         autoStyleContainer: false,
//       },
//       from: { color: fromColor, width: strokeWidth },
//       to: { color: toColor, width: strokeWidth },
//       step: function (state, circle) {
//         circle.path.setAttribute('stroke', state.color);
//         circle.path.setAttribute('stroke-width', state.width);

//         const value = Math.round(circle.value() * 100);

//         if (value === 0) {
//           circle.setText('');
//         } else {
//           circle.setText(value);
//         }
//       },
//     });

//     // Style the text
//     const textStyle = progressBarRef.current.text.style;
//     textStyle.fontFamily = '"Raleway", Helvetica, sans-serif';
//     textStyle.fontSize = fontSize;

//     return () => {
//       // Cleanup on unmount
//       if (progressBarRef.current) {
//         progressBarRef.current.destroy();
//       }
//     };
//   }, [fromColor, toColor, duration, strokeWidth, trailWidth, fontSize]);

//   useEffect(() => {
//     // Animate progress whenever `progress` changes
//     if (progressBarRef.current) {
//       progressBarRef.current.animate(progress);
//     }
//   }, [progress]);

//   return (
//     <div
//       className="relative"
//       style={{ width: `${size}`, height: `${size}` }}
//       ref={containerRef}
//     ></div>
//   );
// };

// export default ProgressCircle;

import { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';

const ProgressCircle = ({
  progress = 0.0,
  duration = 1400,
  fromColor = '#ff0000',
  toColor = '#ff0000',
  trailWidth = 15,
  strokeWidth = 15,
  size = '70px',
  fontSize = '1rem',
}) => {
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    progressBarRef.current = new ProgressBar.Circle(containerRef.current, {
      color: '#000',
      strokeWidth,
      trailWidth,
      easing: 'easeInOut',
      duration,
      text: {
        autoStyleContainer: false,
      },
      from: { color: fromColor, width: strokeWidth },
      to: { color: toColor, width: strokeWidth },
      step: (state, circle) => {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        const value = Math.round(circle.value() * 100);
        circle.setText(value ? `${value}%` : '');
      },
    });

    const textStyle = progressBarRef.current.text.style;
    textStyle.fontFamily = '"Raleway", Helvetica, sans-serif';
    textStyle.fontSize = fontSize;

    return () => {
      if (progressBarRef.current) {
        progressBarRef.current.destroy();
      }
    };
  }, [duration, strokeWidth, trailWidth, fontSize, fromColor, toColor]);

  useEffect(() => {
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
