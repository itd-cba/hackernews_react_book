import styles from "./App.module.css";
import { ReactComponent as Check } from "./check.svg";
import React from "react";
import { Stories, Story } from "./App";
import { sortBy } from "lodash";
import { lstat } from "fs";

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

export const List = ({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = React.useState(SortKey.NONE);
  const handleSort = (sortKey: SortKey) => setSort(sortKey);

  const sortFunction = SORTS(sort);

  const sortedList = sortFunction(list);

  return (
    <div>
      <div className={styles.listHeader}>
        <span style={{ width: "40%" }}>
          <button
            className={`${styles.button} ${styles.buttonSmall}`}
            type="button"
            onClick={() => handleSort(SortKey.TITLE)}
          >
            Title
          </button>
        </span>
        <span style={{ width: "30%", fontWeight: "bold" }}>
          <button
            className={`${styles.button} ${styles.buttonSmall}`}
            type="button"
            onClick={() => handleSort(SortKey.AUTHOR)}
          >
            Author
          </button>
        </span>
        <span style={{ width: "10%", fontWeight: "bold" }}>
          <button
            className={`${styles.button} ${styles.buttonSmall}`}
            type="button"
            onClick={() => handleSort(SortKey.COMMENT)}
          >
            Comments
          </button>
        </span>
        <span style={{ width: "10%", fontWeight: "bold" }}>
          <button
            className={`${styles.button} ${styles.buttonSmall}`}
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
