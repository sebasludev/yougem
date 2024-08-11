const AnimatedSVG = ({
  fillColor = "#FFFFFF",
  strokeColor = "#FFFFFF",
  width = 200,
}) => {
  // Calculate the scaling factor
  const scale = width / 200;

  // Adjust dimensions and positions based on the scale
  const rectWidth = 30 * scale;
  const rectHeight = 30 * scale;
  const rectX = 85 * scale;
  const rectY = 85 * scale;
  const strokeWidth = 15 * scale;

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`0 0 ${width} ${width}`}
      width={width}
      height={width}
    >
      <rect
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin='round'
        width={rectWidth}
        height={rectHeight}
        x={rectX}
        y={rectY}
        rx='0'
        ry='0'
      >
        <animate
          attributeName='rx'
          calcMode='spline'
          dur='2s'
          values={`${15 * scale};${15 * scale};${5 * scale};${15 * scale};${
            15 * scale
          }`}
          keySplines='.5 0 .5 1;.8 0 1 .2;0 .8 .2 1;.5 0 .5 1'
          repeatCount='indefinite'
        />
        <animate
          attributeName='ry'
          calcMode='spline'
          dur='2s'
          values={`${15 * scale};${15 * scale};${10 * scale};${15 * scale};${
            15 * scale
          }`}
          keySplines='.5 0 .5 1;.8 0 1 .2;0 .8 .2 1;.5 0 .5 1'
          repeatCount='indefinite'
        />
        <animate
          attributeName='height'
          calcMode='spline'
          dur='2s'
          values={`${30 * scale};${30 * scale};${1 * scale};${30 * scale};${
            30 * scale
          }`}
          keySplines='.5 0 .5 1;.8 0 1 .2;0 .8 .2 1;.5 0 .5 1'
          repeatCount='indefinite'
        />
        <animate
          attributeName='y'
          calcMode='spline'
          dur='2s'
          values={`${40 * scale};${170 * scale};${40 * scale};`}
          keySplines='.6 0 1 .4;0 .8 .2 1'
          repeatCount='indefinite'
        />
      </rect>
    </svg>
  );
};

export default AnimatedSVG;
