import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, Header, Title } from "../components/Components";
import { useQuery } from "@tanstack/react-query";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet-async";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

const CoinsList = styled.ul``;
const Coin = styled.li`
  background-color: white;
  color: black;
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    padding: 20px;
    transition: color 0.2s ease-in;
    display: flex;
    align-items: center;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;
const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

const ToggleButton = styled.button`
  display: block;
  margin-left: auto;
  margin-top: 12px;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background-color: ${props => props.theme.textColor};
  color: ${props => props.theme.bgColor};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
  }
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const Coins = () => {
  const { isLoading, data } = useQuery<ICoin[]>({
    queryKey: ["allCoins"],
    queryFn: fetchCoins
  });
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <Container>
      <Helmet>
        <title>Coins</title>
      </Helmet>
      <ToggleButton onClick={() => setDarkAtom((prev) => !prev)}>
        {isDark ? "Light" : "Dark"} Mode
      </ToggleButton>
      <Header>
        <Title>Coins</Title>
      </Header>
      {isLoading ? (
        "loading..."
      ) : (
        <CoinsList>
          {data?.map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={`${coin.id}`}
                state={{ name: coin.name }}
              >
                <Img
                  src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = "https://cryptoicon-api.vercel.app/api/icon";
                  }}
                />
                {coin.name.charAt(0).toUpperCase() + coin.name.slice(1)} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
};

export default Coins;
