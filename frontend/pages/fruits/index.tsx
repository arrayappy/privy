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
import withInitialData from "src/components/hoc/withInitialData";
import Body2 from "../../src/components/text/Body2";

const { Panel } = Collapse;

interface Props {
  children?: React.ReactNode;
  fadeIn?: boolean;
  rowGap?: number;
}

const FruitsPage: NextPage = ({ children, fadeIn = false, rowGap }: Props) => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [passphrase, setPassphrase] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { privyUser, decryptedCategories } = useSolanaContext();
  const [decryptedMessages, setDecryptedMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noMessages, setNoMessages] = useState(false);
  const [groupedMessages, setGroupedMessages] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (connected && privyUser && publicKey) {
      const storedPassphrase = localStorage.getItem(publicKey.toString());
      if (storedPassphrase) {
        console.log("Auto-fetching messages with stored passphrase");
        setPassphrase(storedPassphrase);
        fetchDecryptedMessages(storedPassphrase);
      }
    }
  }, [privyUser, connected, publicKey]);

  useEffect(() => {
    if (!connected) {
      router.push("/");
    } else if (!isModalVisible) {
      const storedPassphrase = localStorage.getItem(publicKey?.toString() || "");
      if (!storedPassphrase) {
        console.log("No stored passphrase, showing modal");
        setIsModalVisible(true);
      }
    }
  }, [connected, publicKey, router]);

  useEffect(() => {
    const grouped = parseDecryptedMessages(decryptedMessages);
    setGroupedMessages(grouped);

    const hasMessages = Object.values(grouped).some((messages) => messages.length > 0);
    setNoMessages(!hasMessages);
  }, [decryptedMessages]);

  const handlePassphraseSubmit = async () => {
    if (!passphrase) return;
    
    const success = await fetchDecryptedMessages(passphrase);
    if (success && decryptedMessages.length > 0) {
      localStorage.setItem(publicKey?.toString() || "", passphrase);
      setIsModalVisible(false);
      setNoMessages(false);
    } else if (success) {
      setIsModalVisible(false);
      setNoMessages(true);
    } else {
      alert("Incorrect passphrase, please try again.");
    }
  };

  const fetchDecryptedMessages = async (passphrase: string) => {
    setIsLoading(true);
    try {
      if (!privyUser?.messages || privyUser.messages.length === 0) {
        console.log("No messages found in privyUser");
        setDecryptedMessages([]);
        return true;
      }


      const response = await fetch("/api/getDecryptedMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passphrase,
          messages: privyUser.messages
        }),
      });
      
      const data = await response.json();
      console.log("API Response:", {
        status: response.status,
        hasDecryptedMessages: !!data.decryptedMessages,
        messageCount: data.decryptedMessages?.length
      });

      if (response.status === 401) {
        console.error("Incorrect passphrase");
        return false;
      }
      
      setDecryptedMessages(data.decryptedMessages);
      return true;

    } catch (error) {
      console.error("Error in fetchDecryptedMessages:", error);
      setDecryptedMessages([]);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const parseDecryptedMessages = (messages: string[]) => {
    const groupedMessages: Record<string, string[]> = {};

    messages.forEach((message) => {
      const [headerIndex, text] = message.split(":");
      if (!groupedMessages[headerIndex]) {
        groupedMessages[headerIndex] = [];
      }
      groupedMessages[headerIndex].push(text);
    });

    return groupedMessages;
  };

  const items = decryptedCategories?.map((category, index) => ({
    key: index.toString(),
    label: (
      <Typography.Text className={FontClass.Header2}>
        {category.cat_name}
      </Typography.Text>
    ),
    content: (
      <List
        size="small"
        bordered
        dataSource={groupedMessages[index.toString()] || []}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text className={FontClass.Body1}>
              {item}
            </Typography.Text>
          </List.Item>
        )}
      />
    ),
  }));

  const filteredItems = items?.filter(
    (item) => groupedMessages[item.key] && groupedMessages[item.key].length > 0
  );

  if (!connected) {
    return null;
  }

  if (!privyUser || !decryptedCategories) {
    return (
      <>
        <Header />
        <ResponsiveContainer>
          <div className={styles.container}>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
              <Body2
                colorClass={ColorClass.Navy}
                textAlign="center"
                textTransform="uppercase"
                style={{
                  width: "200px",
                }}
              >
                Loading user data...
              </Body2>
            </div>
          </div>
        </ResponsiveContainer>
      </>
    );
  }

  return (
    <>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item
            label={
              <span className={FontClass.Header2}>
                Enter passphrase to decrypt messages!
              </span>
            }
            name="passphrase"
            rules={[
              { required: true, message: "Please input your passphrase!" },
            ]}
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
          <Suspense fallback={null}>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <Body2
                  colorClass={ColorClass.Navy}
                  textAlign="center"
                  textTransform="uppercase"
                  style={{
                    width: "200px",
                  }}
                >
                  Loading...
                </Body2>
              </div>
            ) : (
              <>
                {noMessages ? (
                  <Typography.Text className={FontClass.Body1} style={{ textAlign: "center", display: "block", marginTop: "20px" }}>
                    No messages yet.
                  </Typography.Text>
                ) : (
                  <>
                    <Header1
                      colorClass={ColorClass.Navy}
                      textAlign="center"
                      textTransform="uppercase"
                    >
                      Fruits
                    </Header1>
                    <Collapse defaultActiveKey={["0"]}>
                      {filteredItems?.map((item) => (
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
                  </>
                )}
              </>
            )}
          </Suspense>
        </div>
      </ResponsiveContainer>
    </>
  );
};

export default withInitialData(FruitsPage);
