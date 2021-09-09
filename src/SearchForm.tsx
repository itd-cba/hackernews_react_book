import React from "react";
import styles from "./App.module.css";
import { InputWithLabel } from "./InputWithLabel";
import { ReactComponent as Search } from "./search.svg";

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}: SearchFormProps) => (
  <form className={styles.searchForm} onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <button
      className={`${styles.button} ${styles.buttonLarge}`}
      type="submit"
      disabled={!searchTerm}
    >
      <Search width="18px" height="18px" />
    </button>
  </form>
);
