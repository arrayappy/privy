import type { NextPage } from "next";
import Header from "src/components/header/Header";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import styles from "@/css/header/HeaderDesktop.module.css";
import Header1 from "src/components/text/Header1";
import ColorClass from "src/types/enums/ColorClass";
import { Suspense } from "react";

import joinClasses from "src/utils/joinClasses";

// import PageBody from "src/components/containers/PageBody";
// import React from "react";
import { Divider, List, Typography, Collapse } from "antd";




// todo add LoadingSpinner
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
    label: "This is panel header 1",
    content: (
      <List
        size="small"
        // header={<div>Header 1</div>}
        // footer={<div>Footer 1</div>}
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    ),
  },
  {
    key: "2",
    label: "This is panel header 2",
    content: (
      <List
        size="small"
        // header={<div>Header 2</div>}
        // footer={<div>Footer 2</div>}
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    ),
  },
  {
    key: "3",
    label: "This is panel header 3",
    content: (
      <List
        size="small"
        // header={<div>Header 3</div>}
        // footer={<div>Footer 3</div>}
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    ),
  },
];
// eslint-disable-next-line react/function-component-definition
const Info: NextPage = ({
    children,
    fadeIn = false,
    rowGap,
  }: Props) => (
  <>
    <Header />
    <ResponsiveContainer>
    <div
        className={joinClasses(styles.container, fadeIn ? styles.fadeIn : null)}
        style={{ rowGap }}
      >
      <div className={styles.container}>
        <Header1
          colorClass={ColorClass.Navy}
          textAlign="center"
          textTransform="uppercase"
        >
          Fruits
        </Header1>
        <div className={styles.rows}>
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
      </div>
      </div>
    </ResponsiveContainer>
  </>
);

export default Info;
