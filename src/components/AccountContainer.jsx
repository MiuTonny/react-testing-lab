import React, { useEffect, useMemo, useState } from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(null); // "description" | "category" | null

  useEffect(() => {
    fetch("http://localhost:6001/transactions")
      .then((r) => r.json())
      .then((data) => setTransactions(data));
  }, []);

  function postTransaction(newTransaction) {
    return fetch("http://localhost:6001/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    })
      .then((r) => r.json())
      .then((created) => {
        setTransactions((prev) => [...prev, created]);
        return created;
      });
  }

  function onSort(value) {
    setSortBy(value || null);
  }

  const visibleTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();

    let filtered = q
      ? transactions.filter((t) => {
          const haystack = [
            t.description ?? "",
            t.category ?? "",
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(q);
        })
      : transactions;

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const av = (a[sortBy] ?? "").toString().toLowerCase();
        const bv = (b[sortBy] ?? "").toString().toLowerCase();
        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
      });
    }
    return filtered;
  }, [transactions, search, sortBy]);

  return (
    <div>
      <Search setSearch={setSearch} />
      <AddTransactionForm postTransaction={postTransaction} />
      <Sort onSort={onSort} />
      <TransactionsList transactions={visibleTransactions} />
    </div>
  );
}

export default AccountContainer;

