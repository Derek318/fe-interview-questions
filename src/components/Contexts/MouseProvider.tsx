import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
  FC,
} from "react";

// Define the types for isMouseDown and setIsMouseDown
type MouseContextType = {
  isMouseDown: boolean;
  setIsMouseDown: Dispatch<SetStateAction<boolean>>;
};

const MouseContext = createContext<MouseContextType>({
  isMouseDown: false,
  setIsMouseDown: () => {},
});

export const useMouse = () => {
  return useContext(MouseContext);
};

interface MouseProviderProps {
  children: ReactNode;
}

export const MouseProvider: FC<MouseProviderProps> = ({ children }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleDown = () => setIsMouseDown(true);
    const handleUp = () => setIsMouseDown(false);

    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
    };
  }, []); // Empty dependency array ensures the effect runs once on mount

  const value: MouseContextType = {
    isMouseDown,
    setIsMouseDown,
  };

  return (
    <MouseContext.Provider value={value}>{children}</MouseContext.Provider>
  );
};
