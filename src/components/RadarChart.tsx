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
  const outerRadius = size * 0.35;
  const innerRadius = size * 0.08;
  const gridLevels = 5;

  // Calculate positions for outer labels (4 quadrants)
  const getOuterLabelPosition = (index: number) => {
    const angles = [-45, 45, 135, -135]; // Top-right, bottom-right, bottom-left, top-left
    const angle = angles[index];
    const radian = (angle * Math.PI) / 180;
    const radius = outerRadius + 60;
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
    <div className="flex justify-center items-center min-h-screen bg-chart-background p-8">
      <div className="relative">
        <svg width={size} height={size} className="drop-shadow-lg">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius + 50}
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
              stroke="hsl(var(--chart-grid))"
              strokeWidth="1"
              opacity="0.4"
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
              stroke="hsl(var(--chart-grid))"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}

          {/* Quadrant separator lines */}
          {quadrantLines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="hsl(var(--chart-primary))"
              strokeWidth="3"
              opacity="0.8"
            />
          ))}

          {/* Outer quadrant labels */}
          {outerLabels.map((label, index) => {
            const labelPos = getOuterLabelPosition(index);
            return (
              <text
                key={index}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="hsl(var(--chart-primary))"
                fontSize="16"
                fontWeight="700"
                className="font-sans"
              >
                {label}
              </text>
            );
          })}

          {/* Data area */}
          <path
            d={pathData}
            fill="hsl(var(--chart-accent))"
            fillOpacity="0.6"
            stroke="hsl(var(--chart-accent))"
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
                  r="4"
                  fill="hsl(var(--chart-accent))"
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
                    y={labelPos.y + (lineIndex - (lines.length - 1) / 2) * 12}
                    textAnchor={labelPos.textAnchor}
                    dominantBaseline="central"
                    fill="hsl(var(--chart-text))"
                    fontSize="10"
                    fontWeight="500"
                    className="font-sans"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Center circle */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="white"
            stroke="hsl(var(--chart-grid))"
            strokeWidth="2"
          />

          {/* Level indicators */}
          {gridCircles.map((radius, index) => (
            <text
              key={index}
              x={center + radius + 5}
              y={center - 3}
              fill="hsl(var(--chart-text))"
              fontSize="8"
              fontWeight="400"
              className="font-sans"
            >
              {index + 1}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};