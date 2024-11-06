import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory, fetchCoinTickers } from "../api";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

// 스타일 컴포넌트 추가
const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const PriceItem = styled.div<{ $isPositive?: boolean }>`
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span:first-child {
    font-size: 16px;
  }
  span:last-child {
    color: ${(props) => (props.$isPositive ? "#1abc9c" : "#e74c3c")};
    font-size: 20px;
    font-weight: 600;
  }
`;

interface ITickersData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_15m: number;
      percent_change_30m: number;
      percent_change_1h: number;
      percent_change_6h: number;
      percent_change_12h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_1y: number;
      ath_price: number;
      ath_date: string;
      percent_from_price_ath: number;
    };
  };
}

const Price = () => {
  const { coinId } = useOutletContext() as { coinId: string };
  const { isLoading, data } = useQuery({
    queryKey: ["tickers", coinId],
    queryFn: () => fetchCoinTickers(coinId) as Promise<ITickersData>,
  });
  const isPositive = (value: number | undefined): boolean => {
    return !!value && value > 0;
  };

  return (
    <PriceContainer>
      {isLoading ? (
        "로딩중..."
      ) : (
        <>
          <PriceItem
            $isPositive={isPositive(data?.quotes.USD.percent_change_24h)}
          >
            <span>24시간 변동률</span>
            <span>{data?.quotes.USD.percent_change_24h}%</span>
          </PriceItem>
          <PriceItem
            $isPositive={isPositive(data?.quotes.USD.percent_change_7d)}
          >
            <span>7일 변동률</span>
            <span>{data?.quotes.USD.percent_change_7d}%</span>
          </PriceItem>
          <PriceItem
            $isPositive={isPositive(data?.quotes.USD.percent_change_30d)}
          >
            <span>30일 변동률</span>
            <span>{data?.quotes.USD.percent_change_30d}%</span>
          </PriceItem>
          <PriceItem>
            <span>역대 최고가 (ATH)</span>
            <span>${data?.quotes.USD.ath_price.toFixed(3)}</span>
          </PriceItem>
          <PriceItem $isPositive={false}>
            <span>ATH 대비 하락률</span>
            <span>{data?.quotes.USD.percent_from_price_ath}%</span>
          </PriceItem>
        </>
      )}
    </PriceContainer>
  );
};

export default Price;
