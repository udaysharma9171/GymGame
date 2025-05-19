import React from 'react';

interface ProgressChartProps {
  data: number[];
  labels: string[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, labels }) => {
  const maxValue = Math.max(...data) || 1;
  
  return (
    <div className="flex flex-col h-64">
      <div className="flex flex-1 items-end space-x-2">
        {data.map((value, index) => {
          const height = `${(value / maxValue) * 100}%`;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full relative group">
                <div
                  style={{ height }}
                  className="bg-primary-500 rounded-t-md transition-all duration-500 ease-in-out group-hover:bg-primary-600"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {value}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex mt-2 space-x-2">
        {labels.map((label, index) => (
          <div key={index} className="flex-1 text-center text-xs text-gray-600">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;