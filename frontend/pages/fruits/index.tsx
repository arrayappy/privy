import type { NextPage } from "next";
import Header from "src/components/header/Header";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import styles from "@/css/header/HeaderDesktop.module.css";
import Header1 from "src/components/text/Header1";
import ColorClass from "src/types/enums/ColorClass";
import FontClass from "src/types/enums/FontClass";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";
import joinClasses from "src/utils/joinClasses";
import { useWallet } from "@solana/wallet-adapter-react";
import { Divider, List, Typography, Collapse, Modal, Input, Form } from "antd";
import ButtonWithText from "src/components/buttons/ButtonWithText";
import ButtonTheme from "src/types/enums/ButtonTheme";
import useSolanaContext from "../../src/hooks/useSolanaContext";

const { Panel } = Collapse;

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];

const items = [
  {
    key: "0",
    label: (
      <Typography.Text className={FontClass.Header2}>
        Header 0
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
    key: "1",
    label: (
      <Typography.Text className={FontClass.Header2}>
        Header 1
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
        Header 2
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

const parseDecryptedMessages = (messages: string) => {
  const groupedMessages: Record<string, string[]> = {};

  messages.split(",").forEach((message) => {
    const [headerIndex, text] = message.split(":");
    if (!groupedMessages[headerIndex]) {
      groupedMessages[headerIndex] = [];
    }
    groupedMessages[headerIndex].push(text);
  });

  return groupedMessages;
};

const Info: NextPage = ({
  children,
  fadeIn = false,
  rowGap,
}: Props) => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [passphrase, setPassphrase] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { privyUser, setPrivyUser } = useSolanaContext();
  const [decryptedMessages, setDecryptedMessages] = useState<string[]>([]);
  useEffect(() => {
    if (!connected) {
      router.push('/');
    } else {
      const storedPassphrase = localStorage.getItem(publicKey || "");
      if (!storedPassphrase) {
        setIsModalVisible(true);
      } else {
        setPassphrase(storedPassphrase);
        fetchDecryptedMessages(storedPassphrase);
      }
    }
  }, [connected, publicKey, router]);

  const handlePassphraseSubmit = async () => {
    if (!passphrase) return;
    localStorage.setItem(publicKey || "", passphrase);
    setIsModalVisible(false);
    await fetchDecryptedMessages(passphrase);
  };

  const fetchDecryptedMessages = async (passphrase: string) => {
    try {
      const response = await fetch("/api/getDecryptedMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase, messages: privyUser?.messages }),
      });
      const { decryptedMessages } = await response.json();
      setDecryptedMessages(decryptedMessages);

      console.log("Decrypted Messages:", decryptedMessages);
    } catch (error) {
      console.error("Error fetching decrypted messages:", error);
    }
  };

  console.log("decryptedMessages", decryptedMessages);
  // const groupedMessages = parseDecryptedMessages(decryptedMessages);
  const groupedMessages = parseDecryptedMessages("0:hi,1:by,1:hey");

  // Filter items to only include those with messages
  const filteredItems = items.filter(item => groupedMessages[item.key]);

  if (!connected) {
    return null;
  }

  return (
    <>
      <Modal
        // title="Decrypt your messages"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item
            label={<span className={FontClass.Header2}>Enter passphrase to decrypt messages!</span>}
            name="passphrase"
            rules={[{ required: true, message: "Please input your passphrase!" }]}
          >
            <Input.Password
              className={FontClass.Body1}
              size="large"
              placeholder="Enter your passphrase"
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ButtonWithText
                buttonTheme={ButtonTheme.Yellow}
                fontClass={FontClass.Body1}
                onClick={handlePassphraseSubmit}
                textTransform="uppercase"
                style={{
                  width: "100px",
                  marginTop: "10px",
                }}
              >
                Submit
              </ButtonWithText>
            </div>
          </Form.Item>
        </Form>
      </Modal>
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
              {filteredItems.map((item) => (
                <Panel header={item.label} key={item.key}>
                  <List
                    size="small"
                    bordered
                    dataSource={groupedMessages[item.key]}
                    renderItem={(message) => (
                      <List.Item>
                        <Typography.Text className={FontClass.Body1}>
                          {message}
                        </Typography.Text>
                      </List.Item>
                    )}
                  />
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
