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
  size = 600 
}) => {
  const center = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.15;
  const gridLevels = 5;

  // Calculate positions for outer labels
  const getOuterLabelPosition = (index: number, total: number) => {
    const angle = (index * 360 / total) - 90; // Start from top
    const radian = (angle * Math.PI) / 180;
    const radius = outerRadius + 30;
    return {
      x: center + Math.cos(radian) * radius,
      y: center + Math.sin(radian) * radius,
      angle
    };
  };

  // Calculate positions for inner labels
  const getInnerLabelPosition = (index: number, total: number) => {
    const angle = (index * 360 / total) - 90;
    const radian = (angle * Math.PI) / 180;
    const radius = outerRadius * 0.75;
    return {
      x: center + Math.cos(radian) * radius,
      y: center + Math.sin(radian) * radius,
      angle
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
              opacity="0.5"
            />
          ))}

          {/* Grid lines */}
          {gridLines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="hsl(var(--chart-grid))"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}

          {/* Outer segments */}
          {outerLabels.map((label, index) => {
            const startAngle = (index * 90) - 90;
            const endAngle = ((index + 1) * 90) - 90;
            const startRadian = (startAngle * Math.PI) / 180;
            const endRadian = (endAngle * Math.PI) / 180;
            
            const outerStartX = center + Math.cos(startRadian) * outerRadius;
            const outerStartY = center + Math.sin(startRadian) * outerRadius;
            const outerEndX = center + Math.cos(endRadian) * outerRadius;
            const outerEndY = center + Math.sin(endRadian) * outerRadius;
            
            const segmentRadius = outerRadius + 40;
            const segmentStartX = center + Math.cos(startRadian) * segmentRadius;
            const segmentStartY = center + Math.sin(startRadian) * segmentRadius;
            const segmentEndX = center + Math.cos(endRadian) * segmentRadius;
            const segmentEndY = center + Math.sin(endRadian) * segmentRadius;

            const pathD = [
              `M ${outerStartX} ${outerStartY}`,
              `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}`,
              `L ${segmentEndX} ${segmentEndY}`,
              `A ${segmentRadius} ${segmentRadius} 0 0 0 ${segmentStartX} ${segmentStartY}`,
              'Z'
            ].join(' ');

            const labelPos = getOuterLabelPosition(index, outerLabels.length);
            
            return (
              <g key={index}>
                <path
                  d={pathD}
                  fill="hsl(var(--chart-primary))"
                  stroke="none"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="14"
                  fontWeight="600"
                  className="font-sans"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Data area */}
          <path
            d={pathData}
            fill="hsl(var(--chart-accent))"
            fillOpacity="0.7"
            stroke="hsl(var(--chart-accent))"
            strokeWidth="2"
          />

          {/* Data points */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="hsl(var(--chart-accent))"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* Inner labels */}
          {data.map((item, index) => {
            const labelPos = getInnerLabelPosition(index, data.length);
            return (
              <text
                key={index}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="hsl(var(--chart-text))"
                fontSize="11"
                fontWeight="500"
                className="font-sans"
              >
                {item.segment}
              </text>
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
        </svg>
      </div>
    </div>
  );
};