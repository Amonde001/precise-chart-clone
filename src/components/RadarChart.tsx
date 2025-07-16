import React from 'react';

interface RadarChartData {
  segment: string;
  value: number;
  maxValue: number;
}

interface RadarChartProps {
  data: RadarChartData[];
  outerLabels: string[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  outerLabels, 
  size = 700 
}) => {
  const center = size / 2;
  const outerRadius = size * 0.3;
  const innerRadius = size * 0.06;
  const borderWidth = size * 0.08;
  const gridLevels = 5;

  // Calculate positions for outer labels (4 quadrants) - positioned in the blue border
  const getOuterLabelPosition = (index: number) => {
    const angles = [135, 45, -45, -135]; // Top-left, top-right, bottom-right, bottom-left (clockwise from top-left)
    const angle = angles[index];
    const radian = (angle * Math.PI) / 180;
    const radius = outerRadius + borderWidth / 2;
    return {
      x: center + Math.cos(radian) * radius,
      y: center + Math.sin(radian) * radius,
      angle
    };
  };

  // Calculate positions for inner labels (criteria)
  const getInnerLabelPosition = (index: number, total: number) => {
    const angle = (index * 360 / total) - 90; // Start from top
    const radian = (angle * Math.PI) / 180;
    const radius = outerRadius * 0.8;
    return {
      x: center + Math.cos(radian) * radius,
      y: center + Math.sin(radian) * radius,
      angle,
      textAnchor: Math.cos(radian) > 0.1 ? 'start' : Math.cos(radian) < -0.1 ? 'end' : 'middle'
    };
  };

  // Calculate data points for filled area
  const getDataPoint = (index: number, value: number, maxValue: number) => {
    const angle = (index * 360 / data.length) - 90;
    const radian = (angle * Math.PI) / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * (value / maxValue);
    return {
      x: center + Math.cos(radian) * radius,
      y: center + Math.sin(radian) * radius
    };
  };

  // Generate grid circles
  const gridCircles = Array.from({ length: gridLevels }, (_, i) => {
    const radius = innerRadius + (outerRadius - innerRadius) * ((i + 1) / gridLevels);
    return radius;
  });

  // Generate grid lines
  const gridLines = Array.from({ length: data.length }, (_, i) => {
    const angle = (i * 360 / data.length) - 90;
    const radian = (angle * Math.PI) / 180;
    return {
      x1: center + Math.cos(radian) * innerRadius,
      y1: center + Math.sin(radian) * innerRadius,
      x2: center + Math.cos(radian) * outerRadius,
      y2: center + Math.sin(radian) * outerRadius
    };
  });

  // Generate quadrant separators (4 main lines)
  const quadrantLines = Array.from({ length: 4 }, (_, i) => {
    const angle = (i * 90) - 45; // 45, 135, 225, 315 degrees
    const radian = (angle * Math.PI) / 180;
    return {
      x1: center + Math.cos(radian) * innerRadius,
      y1: center + Math.sin(radian) * innerRadius,
      x2: center + Math.cos(radian) * (outerRadius + 40),
      y2: center + Math.sin(radian) * (outerRadius + 40)
    };
  });

  // Generate data path
  const dataPoints = data.map((item, index) => getDataPoint(index, item.value, item.maxValue));
  const pathData = dataPoints.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '') + ' Z';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
      <div className="relative">
        <svg width={size} height={size} className="drop-shadow-lg">
          {/* Outer blue border ring */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius + borderWidth}
            fill="#3B82F6"
            stroke="none"
          />

          {/* Inner white background */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="white"
            stroke="none"
          />

          {/* Grid circles */}
          {gridCircles.map((radius, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}

          {/* Grid lines for each criterion */}
          {gridLines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}

          {/* Quadrant separator lines extending to blue border */}
          {quadrantLines.map((line, index) => (
            <line
              key={index}
              x1={center + Math.cos((((index * 90) - 45) * Math.PI) / 180) * innerRadius}
              y1={center + Math.sin((((index * 90) - 45) * Math.PI) / 180) * innerRadius}
              x2={center + Math.cos((((index * 90) - 45) * Math.PI) / 180) * (outerRadius + borderWidth)}
              y2={center + Math.sin((((index * 90) - 45) * Math.PI) / 180) * (outerRadius + borderWidth)}
              stroke="#E5E7EB"
              strokeWidth="2"
            />
          ))}

          {/* Data area */}
          <path
            d={pathData}
            fill="#0F766E"
            fillOpacity="0.8"
            stroke="#0F766E"
            strokeWidth="2"
          />

          {/* Data points */}
          {dataPoints.map((point, index) => {
            const item = data[index];
            if (item.value > 0) {
              return (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="#0F766E"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })}

          {/* Inner criterion labels */}
          {data.map((item, index) => {
            const labelPos = getInnerLabelPosition(index, data.length);
            // Split text by newlines for multi-line labels
            const lines = item.segment.split('\n');
            return (
              <g key={index}>
                {lines.map((line, lineIndex) => (
                  <text
                    key={lineIndex}
                    x={labelPos.x}
                    y={labelPos.y + (lineIndex - (lines.length - 1) / 2) * 11}
                    textAnchor={labelPos.textAnchor}
                    dominantBaseline="central"
                    fill="#374151"
                    fontSize="9"
                    fontWeight="400"
                    className="font-sans"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Outer quadrant labels in blue border */}
          {outerLabels.map((label, index) => {
            const labelPos = getOuterLabelPosition(index);
            return (
              <text
                key={index}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="14"
                fontWeight="700"
                className="font-sans"
              >
                {label}
              </text>
            );
          })}

          {/* Center circle */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="white"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};