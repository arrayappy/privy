import { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";

import Header1 from "src/components/text/Header1";
import ButtonWithText from "src/components/buttons/ButtonWithText";
import useBreakpoint from "src/hooks/useBreakpoint";
import useSolanaContext from "src/hooks/useSolanaContext";
import ColorClass from "src/types/enums/ColorClass";
import FontClass from "src/types/enums/FontClass";
import ButtonTheme from "src/types/enums/ButtonTheme";
import PlayFlipGameGeneric from "src/components/pages/home/PlayFlipGameGeneric";

interface ProfileFormData {
  username: string;
  password: string;
}

const defaultFormData: ProfileFormData = {
  username: "sunny",
  password: "sunny123",
};

export default function Profile() {
  const router = useRouter();
  const { connected } = useWallet();
  const { isTabletBreakpoint } = useBreakpoint();
  const [form] = Form.useForm<ProfileFormData>();
  const { privyClient } = useSolanaContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected) {
      router.push("/");
    }
  }, [connected, router]);

  useEffect(() => {
    form.setFieldsValue(defaultFormData);
  }, [form]);

  if (!connected) {
    return null;
  }

  const handleSubmit = async (values: ProfileFormData) => {
    try {
      setLoading(true);
      console.log("Saving profile data:", values);
      // Here you would typically call your update profile function
      // await updateProfile(values);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlayFlipGameGeneric fadeIn rowGap={isTabletBreakpoint ? 36 : 48}>
      <Header1
        colorClass={ColorClass.Navy}
        textAlign="center"
        textTransform="uppercase"
      >
        Profile Settings
      </Header1>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        style={{
          maxWidth: isTabletBreakpoint ? 400 : 500,
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <Form.Item
          label={<span className={FontClass.Header2}>Username</span>}
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            className={FontClass.Body1}
            size="large"
            placeholder="Enter your username"
          />
        </Form.Item>

        <Form.Item
          label={<span className={FontClass.Header2}>Password</span>}
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            className={FontClass.Body1}
            size="large"
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonWithText
              buttonTheme={ButtonTheme.Yellow}
              fontClass={FontClass.Header1}
              // loading={loading}
              type="submit"
              textTransform="uppercase"
              style={{ 
                width: isTabletBreakpoint ? 270 : 300,
                marginTop: '20px' 
              }}
            >
              Save Changes
            </ButtonWithText>
          </div>
        </Form.Item>
      </Form>
    </PlayFlipGameGeneric>
  );
}
