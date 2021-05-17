import { render, screen } from "@testing-library/react";
import RecentActivity from "../Components/RecentActivity";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store";

test("renders ProfilePage", () => {
  render(
    <Provider store={store}>
      <Router recentActivity={RecentActivity}>
        <RecentActivity />
      </Router>
    </Provider>
  );
  const linkElement = screen.getByText(/Filter by:/);
  expect(linkElement).toBeInTheDocument();
});
