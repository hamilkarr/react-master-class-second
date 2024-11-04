import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import { useQuery } from "@tanstack/react-query";

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

const Price = () => {
  const { coinId } = useOutletContext() as { coinId: string };
  const { isLoading, data } = useQuery({
    queryKey: ["ohlcv", coinId],
    queryFn: () => fetchCoinHistory(coinId) as Promise<IHistorical[]>,
  });
  return <h1>Price</h1>;
};

export default Price;
