import React from "react";
import styles from "./App.module.css";
type Props = {
  lastSearches: string[];
  onLastSearch: (searchTerm: string) => void;
};
export const LastSearches = ({ lastSearches, onLastSearch }: Props) => (
  <>
    {lastSearches.map((searchTerm, index) => (
      <button
        className={styles.button}
        key={searchTerm + index}
        type="button"
        onClick={() => onLastSearch(searchTerm)}
      >
        {searchTerm}
      </button>
    ))}
  </>
);
