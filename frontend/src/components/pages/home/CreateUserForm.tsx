import { useState } from "react";
import styles from "@/css/pages/home/PlayFlipGameStart.module.css";
import Header1 from "src/components/text/Header1";
import ColorClass from "src/types/enums/ColorClass";
import Header2 from "src/components/text/Header2";
import ButtonWithText from "src/components/buttons/ButtonWithText";
import FontClass from "src/types/enums/FontClass";
import ButtonTheme from "src/types/enums/ButtonTheme";
import { useWallet } from "@solana/wallet-adapter-react";
import useSolanaContext from "src/hooks/useSolanaContext";
import { BN } from "@coral-xyz/anchor";
import useBreakpoint from "src/hooks/useBreakpoint";
import PlayFlipGameGeneric from "src/components/pages/home/PlayFlipGameGeneric";
import { Form, Input } from "antd";
import { createUser } from "../../../services/api";

interface CreateUserFormProps {
  onSuccess: () => void;
}

export default function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const { connection, privyClient, setPrivyUser } = useSolanaContext();
  const { isTabletBreakpoint } = useBreakpoint();
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    if (!publicKey || !privyClient) return;

    setIsLoading(true);
    try {
      const response1 = await fetch("/api/getSaltAndKeys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passphrase: values.password }),
      });
      const { password_salt, publicKeyPem } = await response1.json();
      console.log("password_salt", password_salt);
      console.log("publicKeyPem", publicKeyPem);
      console.log(
        await createUser(
          publicKey.toBase58(),
          values.username,
          password_salt,
          publicKeyPem
        )
      );

      const categories = [
        {
          cat_name: values.username,
          passkey: "",
          enabled: true,
          single_msg: false,
        },
      ];
      const response2 = await fetch("/api/getEncryptedCategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: password_salt, categories }),
      });
      const { encryptedCategories } = await response2.json();
      console.log("encryptedCategories", encryptedCategories);
      const tx = await privyClient.createUserTx(
        publicKey,
        values.username,
        encryptedCategories,
        new BN(0)
      );
      const signature = await sendTransaction(tx, connection!);
      await connection!.confirmTransaction(signature, "confirmed");

      onSuccess();
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PlayFlipGameGeneric fadeIn rowGap={isTabletBreakpoint ? 36 : 48}>
      <Header1
        colorClass={ColorClass.Navy}
        textAlign="center"
        textTransform="uppercase"
      >
        Create Your Account
      </Header1>

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
              // loading={isLoading}
              type="submit"
              textTransform="uppercase"
              style={{
                width: "100%",
                maxWidth: isTabletBreakpoint ? 270 : 350,
                marginTop: "20px",
              }}
            >
              Create Account
            </ButtonWithText>
          </div>
        </Form.Item>
      </Form>
    </PlayFlipGameGeneric>
  );
}
