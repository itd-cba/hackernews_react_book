import React from "react";
import axios from "axios";
import styles from "./App.module.css";
import { List } from "./List";
import { SearchForm } from "./SearchForm";
import { LastSearches } from "./LastSearches";

export type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};
export type Stories = Array<Story>;

type StoryState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

interface StoriesFetchInitAction {
  type: "STORIES_FETCH_INIT";
}

interface StoriesFetchSuccessAction {
  type: "STORIES_FETCH_SUCCESS";
  payload: Stories;
}

interface StoriesFetchFailureAction {
  type: "STORIES_FETCH_FAILURE";
}

interface StoriesRemoveAction {
  type: "REMOVE_STORY";
  payload: Story;
}

const useSemiPersistentState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state: StoryState, action: StoriesAction) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return { ...state, isError: false, isLoading: true };

    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isError: false,
      };
    case "STORIES_FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };

    case "REMOVE_STORY":
      const data = state.data.filter(
        (story) => action.payload.objectID !== story.objectID
      );
      return { ...state, data };
    default:
      throw new Error();
  }
};
const getSumComments = (stories: StoryState) => {
  return stories.data.reduce((result, value) => result + value.num_comments, 0);
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const extractSearchTerm = (url: string) => url.replace(API_ENDPOINT, "");
const getLastSearches = (urls: string[]) => {
  const urlsSet = Array.from(new Set(urls));
  return urlsSet.slice(-6).slice(0, -1).map(extractSearchTerm);
};

function getUrl(searchTerm: string) {
  return `${API_ENDPOINT}${searchTerm}`;
}

const App = () => {
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    handleSearch(searchTerm);
    event.preventDefault();
  };

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const sumComments = React.useMemo(() => getSumComments(stories), [stories]);

  const handleLastSearch = (searchTerm: string) => {
    handleSearch(searchTerm);
    setSearchTerm(searchTerm);
  };

  const handleSearch = (searchTerm: string) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  };

  const lastSearches = getLastSearches(urls);

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>
        My Hacker Stories with {sumComments} comments
      </h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <div className={styles.lastSearchBlock}>
        <LastSearches
          lastSearches={lastSearches}
          onLastSearch={handleLastSearch}
        />
      </div>
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

export default App;
