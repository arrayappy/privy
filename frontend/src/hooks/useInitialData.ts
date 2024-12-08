import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useSolanaContext from './useSolanaContext';
import { getDbUser } from '../services/api';

export default function useInitialData() {
  const { publicKey } = useWallet();
  const { 
    privyClient, 
    setPrivyUser, 
    setDbUser, 
    setDecryptedCategories,
    privyUser,
    dbUser 
  } = useSolanaContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userExists, setUserExists] = useState<boolean | null>(null);

  const fetchInitialData = async () => {
    if (!publicKey || !privyClient) {
      setIsLoading(false);
      setUserExists(null);
      setPrivyUser(null);
      setDecryptedCategories([]);
      return;
    }

    try {
      const privyUserPDA = await privyClient.getPrivyUserPda(publicKey);
      const privyUserAccount = await privyClient.program.account.privyUser.fetch(privyUserPDA);
      
      setPrivyUser(privyUserAccount);
      setUserExists(!!privyUserAccount);

      const dbUserData = await getDbUser(publicKey.toBase58());
      setDbUser(dbUserData);

      if (dbUserData && privyUserAccount.categories) {
        try {
          const response = await fetch("/api/getDecryptedCategories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              key: dbUserData.password_salt,
              categories: privyUserAccount.categories,
            }),
          });

          const data = await response.json();
          const decryptedCategories = typeof data.decryptedCategories === "string"
            ? JSON.parse(data.decryptedCategories)
            : data.decryptedCategories;

          const categoriesArray = Array.isArray(decryptedCategories)
            ? decryptedCategories.map((cat) => ({
                cat_name: cat.cat_name || "",
                passkey: cat.passkey || "",
                enabled: Boolean(cat.enabled),
                single_msg: Boolean(cat.single_msg),
              }))
            : [];

          setDecryptedCategories(categoriesArray);
        } catch (error) {
          console.error("Error fetching categories:", error);
          setDecryptedCategories([]);
        }
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setUserExists(false);
      setDecryptedCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [publicKey]);

  return { isLoading, userExists, refreshData: fetchInitialData };
} 