interface WalletBalance {
  currency: string;
  amount: number;
  formatted?: string;
  blockchain: string;
}

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const filteredAndSortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount <= 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances]);

  const rows = useMemo(() => {
    return filteredAndSortedBalances.map(
      (balance: WalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        const formattedAmount = balance.formatted;
        return (
          <WalletRow
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={formattedAmount}
          />
        );
      }
    );
  }, [filteredAndSortedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};

/*
 * Problem 1: I combined WalletBalance and FormattedWalletBalance to avoid code duplication
 * Problem 2: The issue is actually at line 33 when referring to balance.blockchain.
 * Problem 3: We can optimize the code by performing filtering and sorting earlier in the useWalletBalances and usePrices hooks to minimize computational work in useMemo.
 */
