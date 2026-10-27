import { createContext, useContext } from "react";

// true once the intro loader has finished, so page intros can start in sync
export const IntroContext = createContext(true);
export const useIntroDone = () => useContext(IntroContext);
