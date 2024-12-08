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
      "A trustless Solana app for receiving private messages securely and spam-free through a simple, sharable link.",
    title: "What is Privy?",
  },
  {
    description: (
      <>
        In Privy, messages are referred to as "fruits" and categories are called "crates".
      </>
    ),
    title: "What is the terminology used?",
  },
  {
    description:
      "The sender pays the transaction fees using a relayer backend service while ensuring client-side message encryption.",
    title: "How does it work?",
  },
  {
    description: (
      <>
        Privy currently operates on Devnet SOL. The exchange rate is 100 Privy tokens per Devnet SOL, with each Privy token allowing you to receive one message.
        <br />
        <br />
        Additionally, any account changes like updating settings or categories will require paying for an on-chain transaction.
      </>
    ),
    title: "What fees do you charge?",
  },
  // {
  //   description: (
  //     <>
  //       Please DM our Twitter account (
  //       <ExternalLink href="https://twitter.com/arrayappy">
  //         @arrayappy
  //       </ExternalLink>
  //       ) with any questions or concerns.
  //     </>
  //   ),
  //   title: "I need help, where do I go?",
  // },
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
