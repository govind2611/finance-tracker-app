import React from "react";
import { Line, Pie } from "@ant-design/charts";

const ChartComponent = ({ sortedTransactions }) => {
  const data = sortedTransactions.map((item) => {
    return {
      date: item.date,
      amount: item.amount,
    };
  });

  const config = {
    data: data,
    autoFit: false,
    xField: "date",
    yField: "amount",
  };

  // eslint-disable-next-line array-callback-return
  const spendingData = sortedTransactions.filter((transaction) => {
    if (transaction.type === "expense") {
      return { tag: transaction.tag, amount: transaction.amount };
    }
  });
  let finalSpending = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if(!acc[key]){
      acc[key] = {tag:obj.tag, amount:obj.amount}
    }else{
      acc[key].amount=obj.amount
    }
    return acc;
  }, {})

  const spendingConfig = {
    data: Object.values(finalSpending),
    angleField: "amount",
    colorField: "tag",
  };

  // eslint-disable-next-line no-unused-vars
  let chart;
  // eslint-disable-next-line no-unused-vars
  let pie;
  return (
    <div className="charts-wrappper">
      <div className="line-chart">
        <h1>Your Analytics</h1>
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      </div>

      <div className="pie-chart">
        <h1>Your Spendings</h1>
        <Pie
          {...spendingConfig}
          onReady={(chartInstance) => (pie = chartInstance)}
        />
      </div>
    </div>
  );
};

export default ChartComponent;
