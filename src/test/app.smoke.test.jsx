import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";

describe("App smoke test", () => {
  it("renders either app chrome or API setup notice", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const found =
      screen.queryByText(/TMDB API key required/i) ||
      screen.queryByText(/CineMax/i);

    expect(found).toBeInTheDocument();
  });
});

