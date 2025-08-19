
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AddTransactionForm from "../../components/AddTransactionForm";

describe("AddTransactionForm", () => {
  it("submits and calls postTransaction with the entered values", async () => {
    const user = userEvent.setup();
    const postTransaction = vi.fn();

    const { container } = render(
      <AddTransactionForm postTransaction={postTransaction} />
    );

    // Fill inputs
    await user.type(screen.getByPlaceholderText(/description/i), "Lunch");
    await user.type(screen.getByPlaceholderText(/category/i), "Food");
    await user.type(screen.getByPlaceholderText(/amount/i), "12.50");

    // The date input has no label/placeholder; select by name
    const dateInput = container.querySelector('input[name="date"]');
    await user.type(dateInput, "2024-05-04"); // yyyy-mm-dd

    // Submit the form
    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    // Called once with the right payload
    expect(postTransaction).toHaveBeenCalledTimes(1);

    // Note: <input type="number"> normalizes "12.50" to "12.5" in JSDOM
    expect(postTransaction).toHaveBeenCalledWith({
      date: "2024-05-04",
      description: "Lunch",
      category: "Food",
      amount: "12.5",
    });
  });
});
