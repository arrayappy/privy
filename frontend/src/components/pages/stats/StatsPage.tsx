import styles from "@/css/pages/stats/StatsPage.module.css";
import PageBody from "src/components/containers/PageBody";
import LoadingSpinner from "src/components/loading/LoadingSpinner";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import useStatsQuery from "src/hooks/queries/useStatsQuery";
import ColorValue from "src/types/enums/ColorValue";
import { PieChart } from "react-minimal-pie-chart";
import Header2 from "src/components/text/Header2";
import ColorClass from "src/types/enums/ColorClass";
import Body1 from "src/components/text/Body1";
import HeadsOrTails from "src/types/HeadsOrTails";
import assertUnreachable from "src/utils/assertUnreachable";
import shortenAddress from "src/utils/solana/shortenAddress";
import pluralize from "src/utils/string/pluralize";

function getPieChartValue(
  numbers: { numHeads: number; numTails: number },
  headsOrTails: HeadsOrTails
) {
  switch (headsOrTails) {
    case "heads":
      return Math.round(
        (numbers.numHeads * 100) / (numbers.numHeads + numbers.numTails)
      );
    case "tails":
      return Math.round(
        (numbers.numTails * 100) / (numbers.numHeads + numbers.numTails)
      );
    default:
      return assertUnreachable(headsOrTails);
  }
}

function getPieChartData(numbers: { numHeads: number; numTails: number }) {
  return [
    {
      title: "Heads",
      value: getPieChartValue(numbers, "heads"),
      color: ColorValue.WinterGreen,
    },
    {
      title: "Tails",
      value: getPieChartValue(numbers, "tails"),
      color: ColorValue.Yellow,
    },
  ];
}

type DataEntry = {
  title?: string | number;
  value: number;
  color: string;
};
type Data = Array<DataEntry>;

function PieChartSectionLabel({ dataEntry }: { dataEntry: DataEntry }) {
  if (dataEntry.value === 0) {
    return null;
  }
  return `${dataEntry.title} ${dataEntry.value}%`;
}

function PieChartWithLabel({
  data,
  description,
  title,
}: {
  data: Data;
  description: string;
  title: string;
}) {
  const hasZeroValue = data.find(({ value }) => value === 0);

  return (
    <div className={styles.pieChartWithLabel}>
      <div className={styles.pieChartLabel}>
        <Header2
          colorClass={ColorClass.Navy}
          textAlign="center"
          textTransform="uppercase"
        >
          {title}
        </Header2>
        <Body1 colorClass={ColorClass.Navy} textAlign="center">
          {description}
        </Body1>
      </div>
      <PieChart
        className={styles.pieChart}
        data={data}
        label={PieChartSectionLabel}
        labelPosition={hasZeroValue ? 0 : 50}
        labelStyle={{
          // TODO: replace with ColorValue
          fill: "white",
          fontFamily: "Righteous",
          fontSize: "7px",
          wordBreak: "break-all",
        }}
        startAngle={90}
      />
    </div>
  );
}

function Streaks({
  streakType,
  streaks,
}: {
  streakType: "win" | "losing";
  streaks: Array<{ userId: string; streak: number }>;
}) {
  return (
    <div className={styles.streaks}>
      <Header2
        colorClass={ColorClass.Navy}
        textAlign="center"
        textTransform="uppercase"
      >
        Highest {streakType} streaks this week
      </Header2>
      <div className={styles.streakRows}>
        {streaks.map((streak, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.streakRow} key={index}>
            <Body1 colorClass={ColorClass.Navy}>
              {shortenAddress(streak.userId)}
            </Body1>
            <Body1 colorClass={ColorClass.Navy}>
              {streak.streak}{" "}
              {streakType === "win"
                ? pluralize("win", streak.streak)
                : streak.streak > 1
                ? "losses"
                : "loss"}{" "}
              in a row
            </Body1>
          </div>
        ))}
      </div>
    </div>
  );
}

function Inner() {
  const { data, isLoading } = useStatsQuery();

  if (isLoading || data == null) {
    return (
      <LoadingSpinner
        className={styles.loadingSpinner}
        colorValue={ColorValue.Navy}
      />
    );
  }

  const flipCount = data.flipResults.numHeads + data.flipResults.numTails;
  return (
    <div className={styles.container}>
      <PieChartWithLabel
        data={getPieChartData(data.flipResults)}
        description={`Results from ${flipCount} ${pluralize(
          "flip",
          flipCount
        )} this week`}
        title="Heads/Tails Results"
      />
      <PieChartWithLabel
        data={getPieChartData(data.flipPredictions)}
        description={`Choices from ${flipCount} ${pluralize(
          "flip",
          flipCount
        )} this week`}
        title="Heads/Tails Choices"
      />
      <Streaks streakType="win" streaks={data.winStreaks} />
      <Streaks streakType="losing" streaks={data.losingStreaks} />
    </div>
  );
}

export default function StatsPage() {
  return (
    <PageBody>
      <ResponsiveContainer>
        <Inner />
      </ResponsiveContainer>
    </PageBody>
  );
}
