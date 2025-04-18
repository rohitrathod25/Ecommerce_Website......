import React from "react";
import Header from "../components/Common/Header"; // ✅ Ensure correct path
import FixedDeposit from "../components/FixedDeposit"; // ✅ Import Fixed Deposit component
function FixedDepositPage() {
  return (
    <>
      <Header /> {/* Fixed Header */}
      <div className="fixed-deposit-container">
        <FixedDeposit /> {/* This will render the FD calculator */}
      </div>
    </>
  );
}

export default FixedDepositPage;
