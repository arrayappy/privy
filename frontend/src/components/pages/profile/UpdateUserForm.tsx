import { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

import Header1 from "src/components/text/Header1";
import ButtonWithText from "src/components/buttons/ButtonWithText";
import useBreakpoint from "src/hooks/useBreakpoint";
import useSolanaContext from "src/hooks/useSolanaContext";
import ColorClass from "src/types/enums/ColorClass";
import FontClass from "src/types/enums/FontClass";
import ButtonTheme from "src/types/enums/ButtonTheme";
import PlayFlipGameGeneric from "src/components/pages/home/PlayFlipGameGeneric";
import { updateUser } from "src/services/api";

interface ProfileFormData {
  username: string;
  password: string;
}

export default function Profile() {
  const router = useRouter();
  const { connected, publicKey, sendTransaction } = useWallet();
  const { isTabletBreakpoint } = useBreakpoint();
  const [form] = Form.useForm<ProfileFormData>();
  const { privyClient, connection, privyUser } = useSolanaContext();
  const [loading, setLoading] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    if (!connected) {
      router.push("/");
    } else {
      form.setFieldsValue({ username: privyUser?.username || "", password: "" });
    }
  }, [connected, privyUser]);

  const handleValuesChange = (changedValues: Partial<ProfileFormData>, allValues: ProfileFormData) => {
    const isUsernameChanged = allValues.username !== privyUser?.username;
    const isPasswordFilled = allValues.password.length > 0;
    setIsSubmitEnabled(isUsernameChanged || isPasswordFilled);
  };

  const handleSubmit = async (values: ProfileFormData) => {
    try {
      setLoading(true);
      const { username, password } = values;

      // Update username on-chain
      if (privyClient && publicKey && username !== privyUser?.username) {
        const tx = await privyClient.updateUsernameTx(publicKey, username);
        const signature = await sendTransaction(tx, connection!);
        await connection!.confirmTransaction(signature, "confirmed");
      }

      // Update password in the database
      if (password) {
        const response1 = await fetch('/api/getSaltAndPubkey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ passphrase: password }),
        });
        const { password_salt, publicKeyPem } = await response1.json();
        await updateUser(publicKey!.toBase58(), username, password_salt, publicKeyPem);
      }

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
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
        onValuesChange={handleValuesChange}
        layout="vertical"
        style={{
          width: '90%',
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ButtonWithText
              buttonTheme={ButtonTheme.Yellow}
              fontClass={FontClass.Header1}
              type="submit"
              textTransform="uppercase"
              disabled={!isSubmitEnabled}
              style={{
                width: '100%',
                maxWidth: isTabletBreakpoint ? 270 : 300,
              }}
            >
              Save
            </ButtonWithText>
          </div>
        </Form.Item>
      </Form>
    </PlayFlipGameGeneric>
  );
}
