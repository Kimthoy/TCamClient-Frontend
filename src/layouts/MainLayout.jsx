import React, { useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Support from "../components/Support.jsx";
import DemoRequestModal from "../components/DemoRequest.jsx";
import DemoRequestButton from "../components/DemoRequestButton.jsx";

const MainLayout = ({ children }) => {
  const [openDemo, setOpenDemo] = useState(false);

  return (
    <div className="battambang-regular">
      <div className="mb-17">
        <Header />
      </div>

      <div className="min-h-screen flex flex-col">
        <main className="grow">{children}</main>

        <Footer />
        <Support />

        {/* Floating Button */}
        <DemoRequestButton onClick={() => setOpenDemo(true)} />

        {/* Modal */}
        <DemoRequestModal open={openDemo} onClose={() => setOpenDemo(false)} />
      </div>
    </div>
  );
};

export default MainLayout;
