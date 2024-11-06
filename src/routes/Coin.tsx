import { Link, useLocation, useMatch, Outlet, useNavigate } from "react-router-dom";
import { Container, Header, Title } from "../components/Components";
import styled from "styled-components";
import { useQueries } from "@tanstack/react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet-async";

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;
const Tab = styled.div<{ $isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.cardBgColor};
  border-radius: 10px;
  color: ${(props) =>
    props.$isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    padding: 7px 0px;
    display: block;
    text-decoration: none;
    color: inherit;
  }
  &:hover {
    color: ${(props) => props.theme.accentColor};
  }
`;
const BackButton = styled.button`
  display: block;
  margin-left: auto;
  margin-top: 12px;
  border: none;
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.accentColor};
  }
`;

interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  tags: {
    id: string;
    name: string;
    coin_counter: number;
    ico_counter: number;
  }[];
  team: {
    id: string;
    name: string;
    position: string;
  }[];
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  links: {
    explorer: string[];
    facebook: string[];
    reddit: string[];
    source_code: string[];
    website: string[];
    youtube: string[];
  };
  links_extended: {
    url: string;
    type: string;
    stats?: {
      subscribers?: number;
      contributors?: number;
      stars?: number;
      followers?: number;
    };
  }[];
  whitepaper: {
    link: string;
    thumbnail: string;
  };
  first_data_at: string;
  last_data_at: string;
}
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

const Coin = () => {
  const { state, pathname } = useLocation();
  const coinId = pathname.split("/")[1];
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const navigate = useNavigate();
  const [
    { data: info, isLoading: infoLoading },
    { data: tickers, isLoading: tickersLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["info", coinId],
        queryFn: () => fetchCoinInfo(coinId) as Promise<IInfoData>,
      },
      {
        queryKey: ["tickers", coinId],
        queryFn: () => fetchCoinTickers(coinId) as Promise<ITickersData>,
        // refetchInterval: 5000,
      },
    ],
  });
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : infoLoading ? "Loading..." : info?.name}
        </title>
      </Helmet>
      <BackButton onClick={() => navigate("/")}>← Back</BackButton>
      <Header>
        <Title>
          {state?.name ? state.name : infoLoading ? "Loading..." : info?.name}
        </Title>
      </Header>
      {infoLoading || tickersLoading ? (
        "Loading..."
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{info?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${info?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>${tickers?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{info?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Supply:</span>
              <span>{tickers?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickers?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab $isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
            <Tab $isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
          </Tabs>
          <Outlet context={{ coinId }} />
        </>
      )}
    </Container>
  );
};

export default Coin;
