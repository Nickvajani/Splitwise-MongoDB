import { render, screen } from "@testing-library/react";
import Login from "../Components/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store";

it("checks Login button", () => {
  const { queryByTitle } = render(
    <Provider store={store}>
      <Router login={Login}>
        <Login />
      </Router>
    </Provider>
  );
  const btn = queryByTitle("loginButton");
  expect(btn).toBeTruthy();
});

test("renders Login", () => {
  render(
    <Provider store={store}>
      <Router login={Login}>
        <Login />
      </Router>
    </Provider>
  );
  const linkElement = screen.getByText(/Welcome to Splitwise/);
  expect(linkElement).toBeInTheDocument();
});
