import { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";

const Loader: React.FC = () => {
  const { state } = useContext(GlobalContext);
  const { isLoading } = state;

  if (!isLoading) return null;
  return (
    <div className="overlay">
      <div className="spinner" />
    </div>
  );
};

export default Loader;
