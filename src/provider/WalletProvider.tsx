import { PropsWithChildren } from "react";
import { WalletProvider as RazorWalletProvider } from "@razorlabs/razorkit";
import "@razorlabs/razorkit/style.css";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  return (
    <RazorWalletProvider autoConnect={true}>
      {children}
    </RazorWalletProvider>
  );
};
