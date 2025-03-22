import Footer from "./Footer";
import Navbar from "./Navbar";

const DefaultLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">{children}</div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default DefaultLayout;
