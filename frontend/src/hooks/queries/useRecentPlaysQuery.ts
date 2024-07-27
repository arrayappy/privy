import { useQuery } from "@tanstack/react-query";
import getApiUrl from "src/utils/api/getApiUrl";

export default function useRecentPlaysQuery() {
  return useQuery<string>(
    ["recentPlays"],
    () =>
      fetch(`${getApiUrl()}/getRecentPlays?skip=0&take=10`).then((res) =>
        res.json()
      ),
    {}
  );
}
