import React from "react";
import Header from "../components/Header.jsx"; // Adjust path if needed
import Footer from "../components/Footer.jsx"; // Adjust path if needed

// Assume 'children' is the content from your pages (like HomePage.jsx)
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content Area - Expands to fill available space */}
      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;
