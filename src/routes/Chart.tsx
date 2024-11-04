import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import { useQuery } from "@tanstack/react-query";
import ApexChart from "react-apexcharts";

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

const Chart = () => {
  const { coinId } = useOutletContext() as { coinId: string };
  const { isLoading, data } = useQuery({
    queryKey: ["ohlcv", coinId],
    queryFn: () => fetchCoinHistory(coinId) as Promise<IHistorical[]>,
  });

  return (
    <>
      {isLoading ? (
        "Loading..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: data?.map((price) => ({
                x: new Date(price.time_close * 1000),
                y: [
                  parseFloat(price.open),
                  parseFloat(price.high),
                  parseFloat(price.low),
                  parseFloat(price.close),
                ]
              })) ?? [],
            },
          ]}
          options={{
            theme: {
              mode: "dark",
            },
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#0be881",   // 상승 시 색상
                  downward: "#ff5555"  // 하락 시 색상
                },
                wick: {
                  useFillColor: true
                }
              }
            },
            grid: { show: false },
            xaxis: {
              type: "datetime",
            },
            yaxis: {
              show: false,
              tooltip: {
                enabled: true
              }
            },
          }}
        />
      )}
    </>
  );
};

export default Chart;
