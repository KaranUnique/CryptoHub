//@@viewOn:imports
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { CHART_TEXT } from "../constants/charts";
//@@viewOff:imports

const LineChart = ({ historicalData }) => {
  //@@viewOn:private
  const [data, setData] = useState([[CHART_TEXT.DATE, CHART_TEXT.PRICES]]);

  useEffect(() => {
    let dataCopy = [[CHART_TEXT.DATE, CHART_TEXT.PRICES]];

    if (historicalData?.prices) {
      historicalData.prices.forEach((item) => {
        // Format as day/month (e.g., 25/6)
        const d = new Date(item[0]);
        const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
        dataCopy.push([dateStr, item[1]]);
      });
      setData(dataCopy);
    }
  }, [historicalData]);
  //@@viewOff:private

  //@@viewOn:render
  return (
    <Chart
      chartType="LineChart"
      data={data}
      height="100%"
      legendToggle
    />
  );
  //@@viewOff:render
};

//@@viewOn:exports
export default LineChart;
//@@viewOff:exports