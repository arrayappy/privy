import { useQuery } from "@tanstack/react-query";
import getApiUrl from "src/utils/api/getApiUrl";

export default function useStatsQuery() {
  return useQuery<{
    flipPredictions: {
      numHeads: number;
      numTails: number;
    };
    flipResults: {
      numHeads: number;
      numTails: number;
    };
    losingStreaks: Array<{ userId: string; streak: number }>;
    winStreaks: Array<{ userId: string; streak: number }>;
  }>(["stats"], () =>
    fetch(`${getApiUrl()}/getStats`).then((res) => res.json())
  );
}
