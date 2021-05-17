import { render, screen } from "@testing-library/react";
import MyGroup from "../Components/MyGroup";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store";

test("renders MyGroup", () => {
  render(
    <Provider store={store}>
      <Router myGroup={MyGroup}>
        <MyGroup />
      </Router>
    </Provider>
  );
  const linkElement = screen.getByText(/Groups in which you are invited/);
  expect(linkElement).toBeInTheDocument();
});
