import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TransactionsList from "../../components/TransactionsList";

const sampleTransactions = [
  { id: 1, date: "2024-05-01", description: "Amazon Prime", category: "Subscription", amount: 15.99 },
  { id: 2, date: "2024-05-02", description: "Coffee", category: "Food", amount: 4.5 },
];

describe("TransactionsList", () => {
  it("renders transaction rows with correct values", () => {
    render(<TransactionsList transactions={sampleTransactions} />);

    expect(screen.getByText("Amazon Prime")).toBeInTheDocument();
    expect(screen.getByText("Coffee")).toBeInTheDocument();

    expect(screen.getByText("Subscription")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();

    expect(screen.getByText("15.99")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });
});
