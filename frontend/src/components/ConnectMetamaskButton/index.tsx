import React from "react";

type MetaMaskButtonProps = {
  onClick: () => void;
  accounts: string[];
};

const MetaMaskButton: React.FC<MetaMaskButtonProps> = ({
  onClick,
  accounts,
}) => {
  const handleClick = function (): void {
    onClick();
  };

  return (
    <button
      className="bg-green-400 py-3 px-4 text-white rounded-2xl shadow-lg hover:bg-green-700 absolute bottom-4 left-4 uppercase font-bold z-50"
      onClick={() => handleClick()}
      onKeyDown={() => handleClick()}
      tabIndex={0}
      type="button"
      disabled={!!accounts.length}
    >
      {accounts.length > 0 ? "Connected" : "Connect wallet"}
    </button>
  );
};

export default MetaMaskButton;
