import React from "react";
import axios from "axios";
import renderer from "react-test-renderer";
import App from "./App";
import { Item, List } from "./List";
import { InputWithLabel } from "./InputWithLabel";
import { SearchForm } from "./SearchForm";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("List", function () {
  const list = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: "0",
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: "1",
    },
  ];

  const handleRemoveItem = jest.fn();

  it("should render two items", () => {
    const component = renderer.create(
      <List list={list} onRemoveItem={handleRemoveItem} />
    );
    expect(component.root.findAllByType(Item).length).toBe(2);
  });
});

describe("App", function () {
  it("should succeed fetching data with a list", async () => {
    const list = [
      {
        title: "React",
        url: "https://reactjs.org/",
        author: "Jordan Walke",
        num_comments: 3,
        points: 4,
        objectID: "0",
      },
      {
        title: "Redux",
        url: "https://redux.js.org/",
        author: "Dan Abramov, Andrew Clark",
        num_comments: 2,
        points: 5,
        objectID: "1",
      },
    ];

    const promise = Promise.resolve({
      data: {
        hits: list,
      },
    });

    mockedAxios.get.mockImplementationOnce(() => promise);
    let component: renderer.ReactTestRenderer;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    // @ts-ignore
    expect(component.root.findByType(List).props.list).toEqual(list);
  });

  it("failes fetching data with a list", async () => {
    const promise = Promise.reject();
    mockedAxios.get.mockImplementationOnce(() => promise);
    let component;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    // @ts-ignore
    expect(component.root.findByType("p").props.children).toEqual(
      "Something went wrong..."
    );
  });
});
