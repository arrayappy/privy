import Body1 from "src/components/text/Body1";
import Header2 from "src/components/text/Header2";
import ColorClass from "src/types/enums/ColorClass";
import styles from "@/css/pages/info/InfoPage.module.css";
import PageBody from "src/components/containers/PageBody";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import ExternalLink from "src/components/links/ExternalLink";

const ITEMS = [
  {
    description:
      "Hammyflip is a simple coin flip game that runs on Solana devnet. If you win, you receive double the SOL you initally bet!",
    title: "What is Hammyflip?",
  },
  {
    description: "You have a 50/50 chance of winning the coin flip.",
    title: "What are the odds of winning?",
  },
  {
    description: (
      <>
        Hammyflip takes a 3% fee on your coin flip bet (e.g. betting 1 SOL costs
        1.03 SOL).
        <br />
        <br />
        The first time you play, there is also a small one-time cost in order to
        pay for{" "}
        <ExternalLink href="https://docs.solana.com/terminology#rent">
          rent
        </ExternalLink>
        . Subsequent plays will not include this cost.
      </>
    ),
    title: "What fees do you charge?",
  },
  {
    description: (
      <>
        Please DM our Twitter account (
        <ExternalLink href="https://twitter.com/arrayappy">
          @pencilflip
        </ExternalLink>
        ) with any questions or concerns.
      </>
    ),
    title: "I need help, where do I go?",
  },
];

function InfoItem({
  description,
  title,
}: {
  description: string | JSX.Element;
  title: string;
}) {
  return (
    <div className={styles.infoItem}>
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
  );
}

export default function InfoPage() {
  return (
    <PageBody>
      <ResponsiveContainer>
        <div className={styles.container}>
          {ITEMS.map((item) => (
            <InfoItem
              key={item.title}
              description={item.description}
              title={item.title}
            />
          ))}
        </div>
      </ResponsiveContainer>
    </PageBody>
  );
}
