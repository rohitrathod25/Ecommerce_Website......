import { convertDate } from "./convertDate";

export const settingChartData = (setChartData, prices) => {
  if (prices && prices.length > 0) {
    setChartData({
      labels: prices.map((price) => convertDate(price[0])),
      datasets: [{ 
        data: prices.map((price) => price[1]), 
        borderColor: "#3a80e9" 
      }],
    });
  } else {
    setChartData({ labels: [], datasets: [] });
  }
};
