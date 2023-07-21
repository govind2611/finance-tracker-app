import { Select, Table, Radio } from "antd";
import React, { useState } from "react";
import searchImg from "../../assets/search.svg";
import { parse, unparse } from "papaparse";
import "./style.css";
import { toast } from "react-toastify";

const TransactionsTable = ({
  transactions,
  addTransaction,
  fetchTransactions,
}) => {
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "dateAsc") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "dateDesc") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortKey === "amountAsc") {
      return a.amount - b.amount;
    } else if (sortKey === "amountDesc") {
      return b.amount - a.amount;
    } else {
      return 0;
    }
  });

  function exportCSV() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  const sortingOptions = [
    { value: "", label: "No Sort" },
    { value: "dateAsc", label: "Sort by Date : (Ascending)" },
    { value: "dateDesc", label: "Sort by Date : (Descending)" },
    { value: "amountAsc", label: "Sort by Amount : (Ascending)" },
    { value: "amountDesc", label: "Sort by Amount : (Descending)" },
  ];

  return (
    <div
      style={{
        width: "95%",
        padding: "0rem 2rem",
      }}
    >
      <div className="input-wrapper">
        <div className="input-flex">
          <img src={searchImg} width="16" alt="" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name"
          />
        </div>

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
        <h2>My Transactions</h2>
        <div className="table-wrapper">
          {/* <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="dateAsc">
              Sort by Date (Ascending)
            </Radio.Button>
            <Radio.Button value="dateDesc">
              Sort by Date (Descending)
            </Radio.Button>
            <Radio.Button value="amountAsc">
              Sort by Amount (Ascending)
            </Radio.Button>
            <Radio.Button value="amountDesc">
              Sort by Amount (Descending)
            </Radio.Button>
          </Radio.Group> */}

          <Select
            className="select-input"
            onChange={(value) => setSortKey(value)}
            value={sortKey}
            placeholder="Sort by"
          >
            {sortingOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          <div
          className="btn-wrapper-new"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn custom-btn-new-1" onClick={exportCSV}>
              Export to CSV
            </button>
            <label htmlFor="file-csv" className="btn btn-blue custom-btn-new-2">
              Import from CSV
            </label>
            <input
              id="file-csv"
              type="file"
              accept=".csv"
              required
              onChange={importFromCsv}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table
          dataSource={sortedTransactions}
          columns={columns}
          className="table"
        />
      </div>
    </div>
  );
};

export default TransactionsTable;
