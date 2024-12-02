import type { NextPage } from "next";
import Header from "src/components/header/Header";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import styles from "@/css/header/HeaderDesktop.module.css";
import Header1 from "src/components/text/Header1";
import ColorClass from "src/types/enums/ColorClass";
import FontClass from "src/types/enums/FontClass";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/router";
import joinClasses from "src/utils/joinClasses";
import { useWallet } from "@solana/wallet-adapter-react";
import { Divider, List, Typography, Collapse } from "antd";

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];

const items = [
  {
    key: "1",
    label: (
      <Typography.Text className={FontClass.Header2}>
        This is panel header 1
      </Typography.Text>
    ),
    content: (
      <List
        size="small"
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text className={FontClass.Body1}>
              {item}
            </Typography.Text>
          </List.Item>
        )}
      />
    ),
  },
  {
    key: "2",
    label: (
      <Typography.Text className={FontClass.Header2}>
        This is panel header 2
      </Typography.Text>
    ),
    content: (
      <List
        size="small"
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text className={FontClass.Body1}>
              {item}
            </Typography.Text>
          </List.Item>
        )}
      />
    ),
  },
  {
    key: "3",
    label: (
      <Typography.Text className={FontClass.Header2}>
        This is panel header 3
      </Typography.Text>
    ),
    content: (
      <List
        size="small"
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text className={FontClass.Body1}>
              {item}
            </Typography.Text>
          </List.Item>
        )}
      />
    ),
  },
];

interface Props {
  children?: React.ReactNode;
  fadeIn?: boolean;
  rowGap?: number;
}

const Info: NextPage = ({
  children,
  fadeIn = false,
  rowGap,
}: Props) => {
  const router = useRouter();
  const { connected } = useWallet();

  useEffect(() => {
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  if (!connected) {
    return null;
  }

  return (
    <>
      <Header />
      <ResponsiveContainer>
        <div className={styles.container}>
          <Header1
            colorClass={ColorClass.Navy}
            textAlign="center"
            textTransform="uppercase"
          >
            Fruits
          </Header1>
          <Suspense fallback={null}>
            <Collapse defaultActiveKey={["1"]}>
              {items.map((item) => (
                <Panel header={item.label} key={item.key}>
                  {item.content}
                </Panel>
              ))}
            </Collapse>
          </Suspense>
        </div>
      </ResponsiveContainer>
    </>
  );
};

export default Info;
