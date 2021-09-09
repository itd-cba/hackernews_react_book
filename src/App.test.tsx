import React from "react";
import axios from "axios";
import renderer from "react-test-renderer";
import App, { InputWithLabel, Item, List, SearchForm } from "./App";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Item", () => {
  const item = {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: "0",
  };
  const handleRemoveItem = jest.fn();

  let component: renderer.ReactTestRenderer;

  beforeEach(() => {
    component = renderer.create(
      <Item item={item} onRemoveItem={handleRemoveItem} />
    );
  });

  it("should render all properties", () => {
    expect(component.root.findByType("a").props.href).toEqual(
      "https://reactjs.org/"
    );
    expect(component.root.findByType("a").props.children).toEqual("React");

    expect(
      component.root.findAllByProps({ children: "Jordan Walke" }).length
    ).toEqual(1);

    expect(component.root.findAllByProps({ children: 3 }).length).toEqual(1);

    expect(component.root.findAllByProps({ children: 4 }).length).toEqual(1);
  });

  it("should call onRemoveItem on button click", () => {
    component.root.findByType("button").props.onClick();
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(item);
    expect(component.root.findAllByType(Item).length).toEqual(1);
  });

  it("renders snapshot", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

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

describe("SearchForm", function () {
  const searchFormProps = {
    searchTerm: "React",
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };
  let component: renderer.ReactTestRenderer;

  beforeEach(function () {
    component = renderer.create(<SearchForm {...searchFormProps} />);
  });

  it("should render the input field with its value", () => {
    let value = component.root.findByType(InputWithLabel).props.value;
    expect(value).toEqual("React");

    value = component.root.findByType("input").props.value;
    expect(value).toEqual("React");
  });

  it("changes the input field", () => {
    const pseudoEvent = { target: "Redux" };
    component.root.findByType("input").props.onChange(pseudoEvent);

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchInput).toHaveBeenCalledWith(pseudoEvent);
  });

  it("submits the form", () => {
    const pseudoEvent = {};
    component.root.findByType("form").props.onSubmit(pseudoEvent);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledWith(pseudoEvent);
  });

  it("disables the button and prevents submit", () => {
    component.update(<SearchForm {...searchFormProps} searchTerm="" />);
    expect(component.root.findByType("button").props.disabled).toBeTruthy();
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
