import styles from "./App.module.css";
import { ReactComponent as Check } from "./check.svg";
import React from "react";
import { Stories, Story } from "./App";
import { sortBy } from "lodash";

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

export const Item = ({ item, onRemoveItem }: ItemProps) => {
  return (
    <div className={styles.item}>
      <span style={{ width: "40%" }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
      </span>
      <span style={{ width: "30%" }}>{item.author}</span>
      <span style={{ width: "10%" }}>{item.num_comments}</span>
      <span style={{ width: "10%" }}>{item.points}</span>
      &nbsp;
      <span style={{ width: "10%" }}>
        <button
          className={`${styles.button} ${styles.buttonSmall}`}
          type="button"
          onClick={() => onRemoveItem(item)}
        >
          <Check height="18px" width="18px" />
        </button>
      </span>
    </div>
  );
};

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

enum SortKey {
  NONE = "NONE",
  TITLE = "TITLE",
  AUTHOR = "AUTHOR",
  COMMENT = "NUM_COMMENTS",
  POINT = "POINTS",
}

/**
 * Returns a sorting function
 * @param key Key for the sorting function
 * @constructor
 */
const SORTS: (key: SortKey) => (list: Stories) => Stories = (key) => {
  switch (key) {
    case SortKey.TITLE:
      return (list) =>
        sortBy(list, [
          (story: Story) => story.title.toLowerCase(),
          SortKey.TITLE.toLowerCase(),
        ]);

    case SortKey.COMMENT:
      return (list) => sortBy(list, SortKey.COMMENT.toLowerCase()).reverse();

    case SortKey.POINT:
      return (list) => sortBy(list, SortKey.POINT.toLowerCase()).reverse();

    case SortKey.NONE:
      return (list) => list;

    case SortKey.AUTHOR:
      return (list) =>
        sortBy(list, [
          (story: Story) => story.author.toLowerCase(),
          SortKey.AUTHOR.toLowerCase(),
        ]);

    default:
      return (list) => list;
  }
};

const activeButtonClassName = `${styles.button} ${styles.buttonSmall} ${styles.buttonActive}`;
const inactiveButtonClassName = `${styles.button} ${styles.buttonSmall}`;

export const List = ({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = React.useState({
    sortKey: SortKey.NONE,
    isReverse: false,
  });

  const handleSort = (sortKey: SortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse });
  };

  const sortFunction = SORTS(sort.sortKey);

  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);

  const getButtonClass = (key: SortKey) =>
    sort.sortKey === key ? activeButtonClassName : inactiveButtonClassName;

  return (
    <div>
      <div className={styles.listHeader}>
        <span style={{ width: "40%" }}>
          <button
            className={getButtonClass(SortKey.TITLE)}
            type="button"
            onClick={() => handleSort(SortKey.TITLE)}
          >
            Title
          </button>
        </span>
        <span style={{ width: "30%", fontWeight: "bold" }}>
          <button
            className={getButtonClass(SortKey.AUTHOR)}
            type="button"
            onClick={() => handleSort(SortKey.AUTHOR)}
          >
            Author
          </button>
        </span>
        <span style={{ width: "10%", fontWeight: "bold" }}>
          <button
            className={getButtonClass(SortKey.COMMENT)}
            type="button"
            onClick={() => handleSort(SortKey.COMMENT)}
          >
            Comments
          </button>
        </span>
        <span style={{ width: "10%", fontWeight: "bold" }}>
          <button
            className={getButtonClass(SortKey.POINT)}
            type="button"
            onClick={() => handleSort(SortKey.POINT)}
          >
            Points
          </button>
        </span>
        <span style={{ width: "10%" }}>Actions</span>
      </div>

      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </div>
  );
};
