import { render, screen } from "@testing-library/react";
import ProfilePage from "../Components/ProfilePage";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store";

test("renders ProfilePage", () => {
  render(
    <Provider store={store}>
      <Router profilePage={ProfilePage}>
        <ProfilePage />
      </Router>
    </Provider>
  );
  const linkElement = screen.getByText(/Your Name:/);
  expect(linkElement).toBeInTheDocument();
});
