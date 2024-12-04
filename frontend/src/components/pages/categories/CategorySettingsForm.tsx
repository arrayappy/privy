import { useEffect, useState } from "react";
import Header1 from "src/components/text/Header1";
import ButtonWithText from "src/components/buttons/ButtonWithText";
import useBreakpoint from "src/hooks/useBreakpoint";
import ColorClass from "src/types/enums/ColorClass";
import FontClass from "src/types/enums/FontClass";
import ButtonTheme from "src/types/enums/ButtonTheme";
import PlayFlipGameGeneric from "src/components/pages/home/PlayFlipGameGeneric";
import useSolanaContext from "src/hooks/useSolanaContext";
import Table from "src/components/containers/Table";
import TextInput from "src/components/input/TextInput";
import Switch from "src/components/input/Switch";
import { useWallet } from "@solana/wallet-adapter-react";

type Category = {
  cat_name: string;
  passkey: string;
  enabled: boolean;
  single_msg: boolean;
};

// Add a type definition for the table columns
type TableColumn<T> = {
  header: string;
  accessor: keyof T;
  mobileLabel?: string;
  width?: string;
  render: (value: any, item: T, index: number) => JSX.Element;
};

export default function CategorySettingsForm() {
  const { isTabletBreakpoint } = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const { connection, privyClient } = useSolanaContext();
  const { dbUser, privyUser } = useSolanaContext();
  const [categories, setCategories] = useState<Category[]>([]);

  const getDecryptedCategories = async () => {
    setLoading(true);
    try {
      const response2 = await fetch("/api/getDecryptedCategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: dbUser?.password_salt,
          categories: privyUser?.categories,
        }),
      });

      const data = await response2.json();
      let decryptedCategories;
      try {
        decryptedCategories =
          typeof data.decryptedCategories === "string"
            ? JSON.parse(data.decryptedCategories)
            : data.decryptedCategories;
      } catch (e) {
        console.error("Error parsing categories:", e);
        return;
      }

      if (!decryptedCategories) {
        console.error("No decryptedCategories in response");
        return;
      }

      const categoriesArray = Array.isArray(decryptedCategories)
        ? decryptedCategories.map((cat) => ({
            cat_name: cat.cat_name || "",
            passkey: cat.passkey || "",
            enabled: Boolean(cat.enabled),
            single_msg: Boolean(cat.single_msg),
          }))
        : [];

      if (categoriesArray.length > 0) {
        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (privyUser && dbUser && categories.length === 0) {
      getDecryptedCategories();
    }
  }, [privyUser, dbUser]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (!privyClient) return;

      const response1 = await fetch("/api/getEncryptedCategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories, key: dbUser?.password_salt }),
      });
      const { encryptedCategories } = await response1.json();
      const tx = await privyClient.updateCategoryTx(publicKey!, encryptedCategories); 
      const signature = await sendTransaction(tx, connection!);
      await connection!.confirmTransaction(signature, "confirmed");

      console.log("Categories updated successfully");
    } catch (error) {
      console.error("Error updating categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { cat_name: "", passkey: "", enabled: true, single_msg: true },
    ]);
  };

  const removeCategory = (index: number) => {
    if (index === 0) return;
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof Category, value: any) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      newCategories[index] = { ...newCategories[index], [field]: value };
      return newCategories;
    });
  };

  const columns: TableColumn<Category>[] = [
    {
      header: "Name",
      accessor: "cat_name",
      mobileLabel: "Name",
      width: "180px",
      render: (value: string, item: Category, index: number) => (
        <TextInput
          value={value}
          onChange={(val) => updateCategory(index, "cat_name", val)}
          placeholder="Enter category name"
        />
      ),
    },
    {
      header: "Passkey",
      accessor: "passkey",
      width: "180px",
      render: (value: string, item: Category, index: number) => (
        <TextInput
          value={value}
          onChange={(val) => updateCategory(index, "passkey", val)}
          placeholder="Enter passkey"
        />
      ),
    },
    {
      header: "Enabled",
      accessor: "enabled",
      render: (value: boolean, item: Category, index: number) => (
        <Switch
          checked={value}
          onChange={(checked) => updateCategory(index, "enabled", checked)}
        />
      ),
    },
    {
      header: "Single Message",
      accessor: "single_msg",
      render: (value: boolean, item: Category, index: number) => (
        <Switch
          checked={value}
          onChange={(checked) => updateCategory(index, "single_msg", checked)}
        />
      ),
    },
    {
      header: "Share Link",
      accessor: "cat_name" as "cat_name" & { _shareLink: true }, // Type assertion to make unique
      render: (_: any, item: Category, index: number) => {
        const url =
          index === 0
            ? `https://privy-devnet.vercel.app/${privyUser?.username || ""}`
            : `https://privy-devnet.vercel.app/${
                privyUser?.username || ""
              }/${index}`;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Link
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(url)}
              style={{ cursor: "pointer" }}
            >
              📋
            </button>
          </div>
        );
      },
    },
    {
      header: "Actions",
      accessor: "cat_name" as "cat_name" & { _actions: true }, // Type assertion to make unique
      render: (_: any, item: Category, index: number) => (
        <ButtonWithText
          buttonTheme={ButtonTheme.Yellow}
          fontClass={FontClass.Body1}
          onClick={() => removeCategory(index)}
          disabled={index === 0}
          style={{
            opacity: index === 0 ? 0.5 : 1,
            cursor: index === 0 ? "not-allowed" : "pointer",
          }}
        >
          ➖
        </ButtonWithText>
      ),
    },
  ];

  return (
    <PlayFlipGameGeneric fadeIn rowGap={isTabletBreakpoint ? 36 : 48}>
      <Header1
        colorClass={ColorClass.Navy}
        textAlign="center"
        textTransform="uppercase"
      >
        Category Settings
      </Header1>

      <div
        style={{
          width: "100%",
          maxWidth: isTabletBreakpoint ? 400 : 800,
          margin: "0 auto",
        }}
      >
        <Table
          columns={columns}
          data={categories}
          emptyMessage="No categories added yet"
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <ButtonWithText
            buttonTheme={ButtonTheme.Yellow}
            fontClass={FontClass.Header1}
            onClick={addCategory}
            textTransform="uppercase"
          >
            Add Category
          </ButtonWithText>
          <ButtonWithText
            buttonTheme={ButtonTheme.Yellow}
            fontClass={FontClass.Header1}
            onClick={handleUpdate}
            textTransform="uppercase"
          >
            Save Changes
          </ButtonWithText>
        </div>
      </div>
    </PlayFlipGameGeneric>
  );
}
