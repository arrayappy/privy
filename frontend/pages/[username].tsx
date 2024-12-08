import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Input } from "antd";
import Header from "src/components/header/Header";
import ResponsiveContainer from "src/components/ResponsiveContainer";
import Header1 from "src/components/text/Header1";
import ButtonWithText from "src/components/buttons/ButtonWithText";
import PlayFlipGameGeneric from "src/components/pages/home/PlayFlipGameGeneric";
import useBreakpoint from "src/hooks/useBreakpoint";
import { getUser, insertMessage } from "src/services/api";
import { getFingerprintId } from "src/services/fingerprint";
import ColorClass from "src/types/enums/ColorClass";
import FontClass from "src/types/enums/FontClass";
import ButtonTheme from "src/types/enums/ButtonTheme";
import HeaderLogo from "src/components/header/HeaderLogo";
import Link from "next/link";
import Body1 from "src/components/text/Body1";
import TextArea from "../src/components/input/TextArea";

interface MessageFormData {
  message: string;
  passkey?: string;
}

export default function UserMessagePage() {
  const router = useRouter();
  const { username } = router.query;
  const { isTabletBreakpoint } = useBreakpoint();
  const [form] = Form.useForm<MessageFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    user_addr: string;
    user_password_pubkey: string;
    passkey_enabled: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!username || typeof username !== 'string') return;

      try {
        const catIdx = parseInt(router.asPath.split("/")[2]) || 0;
        const fingerprintId = typeof window !== 'undefined' ? await getFingerprintId() : '';
        const response = await getUser(username, catIdx, fingerprintId);

        if (typeof response === "string") {
          setError(response);
        } else {
          setUserInfo(response);
        }
      } catch (err) {
        setError("Failed to fetch user information");
        console.error(err);
      }
    };

    fetchUserInfo();
  }, [username, router.asPath]);

  const handleSubmit = async (values: MessageFormData) => {
    if (!userInfo || !username || typeof username !== 'string') return;

    try {
      setLoading(true);
      setError(null);

      const fingerprintId = typeof window !== 'undefined' ? await getFingerprintId() : '';
      const catIdx = parseInt(router.asPath.split("/")[2]) || 0;

      // Encrypt message
      const response = await fetch("/api/getEncryptedMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${catIdx}:${values.message}`,
          userPubkey: userInfo.user_password_pubkey,
        }),
      });
      const { encryptedMessage } = await response.json();

      // Send message
      const result = await insertMessage(
        userInfo.user_addr,
        catIdx,
        encryptedMessage,
        values.passkey || "",
        fingerprintId
      );

      if (result.error) {
        setError(result.error);
      } else {
        form.resetFields();
        setSuccess("Message sent successfully!");
      }
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const shouldHideForm = success || (error && !userInfo?.passkey_enabled);

  return (
    <ResponsiveContainer>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Link href="/">
          <a>
            <HeaderLogo />
          </a>
        </Link>
        <Body1 colorClass={ColorClass.Navy} textAlign="center">
          A secure channel to send private messages.
        </Body1>
      </div>

      <PlayFlipGameGeneric fadeIn rowGap={isTabletBreakpoint ? 36 : 48}>
        <Header1
          colorClass={ColorClass.Navy}
          textAlign="center"
          textTransform="uppercase"
        >
          {`Send Message to ${username || ''}`}
        </Header1>

        {!shouldHideForm && (
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{
              width: "90%",
              maxWidth: isTabletBreakpoint ? 400 : 500,
              margin: "0 auto",
              padding: "20px",
            }}
          >
            <Form.Item
              label={<span className={FontClass.Header2}>Enter your message</span>}
              name="message"
              rules={[
                { required: true, message: "Please input your message!" },
              ]}
            >
              <TextArea
                className={FontClass.Body1}
                placeholder="Type your message here"
                rows={4}
                onChange={() => {}}
                value={form.getFieldValue('message') || ''}
              />
            </Form.Item>

            {userInfo?.passkey_enabled && (
              <Form.Item
                label={<span className={FontClass.Header2}>Passkey</span>}
                name="passkey"
                rules={[
                  { required: true, message: "Please input the passkey!" },
                ]}
              >
                <Input
                  className={FontClass.Body1}
                  size="large"
                  placeholder="Enter passkey"
                />
              </Form.Item>
            )}

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ButtonWithText
                  buttonTheme={ButtonTheme.Yellow}
                  fontClass={FontClass.Header1}
                  onClick={form.submit}
                  textTransform="uppercase"
                  disabled={loading}
                  style={{
                    width: "100%",
                    maxWidth: isTabletBreakpoint ? 270 : 300,
                  }}
                >
                  Send Message
                </ButtonWithText>
              </div>
            </Form.Item>
          </Form>
        )}

        {error && (
          <Body1 textAlign="center" colorClass={ColorClass.Rust}>{error}</Body1>
        )}

        {success && (
          <Body1 textAlign="center">{success}</Body1>
        )}
      </PlayFlipGameGeneric>
    </ResponsiveContainer>
  );
}
