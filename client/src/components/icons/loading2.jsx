const AnimatedCircles = ({
  fillColor = "#FFFFFF",
  strokeColor = "#FFFFFF",
  width = 100,
}) => {
  const scale = width / 200;
  const strokeWidth = 15 * scale;
  const radius = 15 * scale;

  const circleProps = [
    { cx: 40 * scale, begin: "-0.4s" },
    { cx: 100 * scale, begin: "-0.2s" },
    { cx: 160 * scale, begin: "0s" },
  ];

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`0 0 ${width} ${width}`}
      width={width}
      height={width}
    >
      {circleProps.map((props, index) => (
        <circle
          key={index}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          r={radius}
          cx={props.cx}
          cy={width / 2}
        >
          <animate
            attributeName='opacity'
            calcMode='spline'
            dur='2s'
            values='1;0;1;'
            keySplines='.5 0 .5 1;.5 0 .5 1'
            repeatCount='indefinite'
            begin={props.begin}
          />
        </circle>
      ))}
    </svg>
  );
};

export default AnimatedCircles;
