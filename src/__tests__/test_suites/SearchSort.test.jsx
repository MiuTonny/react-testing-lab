import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, beforeEach, expect } from "vitest";
import AccountContainer from "../../components/AccountContainer";

const sampleTransactions = [
  { id: 1, date: "2024-05-01", description: "Amazon Prime", category: "Subscription", amount: 15.99 },
  { id: 2, date: "2024-05-02", description: "Coffee", category: "Food", amount: 4.5 },
  { id: 3, date: "2024-05-03", description: "Groceries", category: "Food", amount: 42.1 },
];

beforeEach(() => {
  global.setFetchResponse(sampleTransactions);
});

describe("Search & Sort in AccountContainer", () => {
  it("filters transactions when searching by description", async () => {
    render(<AccountContainer />);

    
    await screen.findByText("Amazon Prime");

    await userEvent.type(
      screen.getByPlaceholderText(/search your recent transactions/i),
      "amazon"
    );

    expect(await screen.findByText("Amazon Prime")).toBeInTheDocument();
    expect(screen.queryByText("Coffee")).not.toBeInTheDocument();
  });

  it("sorts transactions by description", async () => {
    render(<AccountContainer />);

    await screen.findByText("Amazon Prime"); // data loaded

    await userEvent.selectOptions(
      screen.getByRole("combobox"),
      "description"
    );

    const rows = await screen.findAllByRole("row");
    const descriptions = rows.slice(1).map((row) => row.cells[1].textContent);

    expect(descriptions).toEqual(["Amazon Prime", "Coffee", "Groceries"]);
  });

  it("sorts transactions by category", async () => {
    render(<AccountContainer />);

    await screen.findByText("Amazon Prime"); // data loaded

    await userEvent.selectOptions(
      screen.getByRole("combobox"),
      "category"
    );

    const rows = await screen.findAllByRole("row");
    const categories = rows.slice(1).map((row) => row.cells[2].textContent);

    expect(categories).toEqual(["Food", "Food", "Subscription"]);
  });
});
