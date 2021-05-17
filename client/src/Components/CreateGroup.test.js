import { render, screen } from "@testing-library/react";
import CreateGroup from "../Components/CreateGroup";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store";

test("renders Login", () => {
  render(
    <Provider store={store}>
      <Router createGroup={CreateGroup}>
        <CreateGroup />
      </Router>
    </Provider>
  );
  const linkElement = screen.getByText(/Create group/);
  expect(linkElement).toBeInTheDocument();
});
