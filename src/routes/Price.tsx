import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
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

  const calculatePriceChange = (fromIndex: number, toIndex: number) => {
    if (!data) return 0;
    const fromPrice = parseFloat(data[fromIndex].close);
    const toPrice = parseFloat(data[toIndex].close);
    return ((toPrice - fromPrice) / fromPrice) * 100;
  };

  return (
    <PriceContainer>
      {isLoading ? (
        "로딩중..."
      ) : (
        <>
          <PriceItem $isPositive={calculatePriceChange(1, 0) > 0}>
            <span>24시간 변동률:</span>
            <span>{calculatePriceChange(1, 0).toFixed(2)}%</span>
          </PriceItem>
          <PriceItem $isPositive={calculatePriceChange(7, 0) > 0}>
            <span>7일 변동률:</span>
            <span>{calculatePriceChange(7, 0).toFixed(2)}%</span>
          </PriceItem>
          <PriceItem $isPositive={calculatePriceChange(14, 0) > 0}>
            <span>14일 변동률:</span>
            <span>{calculatePriceChange(14, 0).toFixed(2)}%</span>
          </PriceItem>
        </>
      )}
    </PriceContainer>
  );
};

export default Price;
