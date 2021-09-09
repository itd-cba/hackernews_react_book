import renderer from "react-test-renderer";
import { Item } from "./List";
import React from "react";

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
