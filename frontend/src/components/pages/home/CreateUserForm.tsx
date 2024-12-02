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
  const wallet = useWallet();
  const { connection, privyClient } = useSolanaContext();
  const { isTabletBreakpoint } = useBreakpoint();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string }) => {
    if (!wallet.publicKey || !privyClient) return;

    setIsLoading(true);
    try {
      const encryptedCategories = JSON.stringify([]);
      
      const tx = await privyClient.createUserTx(
        wallet.publicKey,
        values.username,
        encryptedCategories,
        new BN(0)
      );

      const signature = await wallet.sendTransaction(tx, connection!);
      await connection!.confirmTransaction(signature, "confirmed");

      await createUser(wallet.publicKey.toBase58(), values.username, values.password);
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
          maxWidth: isTabletBreakpoint ? 400 : 500,
          margin: '0 auto',
          padding: '20px'
        }}
      >
        <Form.Item
          label={
            <span className={FontClass.Header2}>
              Username
            </span>
          }
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input 
            className={FontClass.Body1}
            size="large"
            placeholder="Enter your username"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className={FontClass.Header2}>
              Password
            </span>
          }
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
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
              // loading={isLoading}
              type="submit"
              textTransform="uppercase"
              style={{ 
                width: isTabletBreakpoint ? 270 : 350,
                marginTop: '20px' 
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