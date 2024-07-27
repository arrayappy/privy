import stripTrailingDecimals from "src/utils/number/stripTrailingDecimals";

/**
 * e.g.,
 *   formatDecimals(2.19e9, 9) -> 2.19
 *   formatDecimals(216000, 6) -> 0.22 (since we round to nearest hundredth)
 */
export default function formatDecimals(
  amount: number,
  decimals: number
): string {
  return stripTrailingDecimals(amount / 10 ** decimals);
}
