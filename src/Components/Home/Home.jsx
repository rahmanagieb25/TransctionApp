import axios from "axios";
import React, { useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { useQuery } from "react-query";
import TransactionChart from "../Transiction/TransactionChart";

export default function Home() {
  const [nameFilter, setNameFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [chartType, setChartType] = useState("line");  


const jsonDbUrl = "https://basselzeidan80.github.io/Customers-Transaction-server/db.json";


  async function getCustomers() {
    const res = await axios.get(`${jsonDbUrl}`);
    return res.data.customers
  }

  async function getTransactions() {
    const res = await axios.get(`${jsonDbUrl}`);
    return res.data.transactions
  }

  const {
    data: customersData,
    isLoading: customersLoading,
    isError: customersError,
  } = useQuery("getCustomers", getCustomers);

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    isError: transactionsError,
  } = useQuery("getTransactions", getTransactions);

  if (customersLoading || transactionsLoading) {
    return (
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    );
  }

  if (customersError || transactionsError) {
    return (
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    );
  }

  const customers = customersData;
  const transactions = transactionsData;

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown";
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const customerName = getCustomerName(transaction.customer_id);
    const amount = parseFloat(transaction.amount);

    const nameMatch = customerName
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const amountMatch =
      isNaN(amount) || amount.toString().includes(amountFilter);

    return nameMatch && amountMatch;
  });

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomerId(customerId);
    console.log("=======id", customerId);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0">
        <div className="mx-5 w-full md:w-1/3 bg-white p-6 rounded-lg shadow-slate-400 shadow-xl">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                Name
              </label>
              <div className="mt-1 relative rounded-md  shadow-slate-400 shadow-sm">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md pl-3 pr-10 transition duration-300 ease-in-out transform focus:scale-x-100"
                  placeholder="Enter name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium" htmlFor="amount">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-slate-400 shadow-sm">
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  className="outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md pl-3 pr-10 transition duration-300 ease-in-out transform focus:scale-x-102"
                  placeholder="Enter amount"
                  value={amountFilter}
                  onChange={(e) => setAmountFilter(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-dollar-sign text-gray-400"></i>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="w-full rounded-lg shadow-slate-400 shadow-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-green-600">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <span className="font-bold">Customer Name</span>
                    <i className="fas fa-user ml-2"></i>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <span className="font-bold">Date</span>
                    <i className="fas fa-calendar-alt ml-2"></i>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <span className="font-bold">Amount</span>
                    <i className="fas fa-money-bill ml-2"></i>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr
                  onClick={() => handleCustomerSelect(transaction.customer_id)}
                  style={{ cursor: "pointer" }}
                  key={transaction.id}
                  className="hover:bg-green-200 transition duration-300 ease-in-out transform hover:scale-x-100"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <i className="fa-solid fa-user text-green-600"></i>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getCustomerName(transaction.customer_id)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <i className="fa-solid fa-calendar-days text-green-600"></i>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.date}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <i className="fa-solid fa-dollar-sign text-green-600"></i>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          ${transaction.amount}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-10 shadow-slate-400 shadow-xl">
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-md ${chartType === "line" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setChartType("line")}
          >
            Line Chart
          </button>
          <button
            className={`px-4 py-2 rounded-md ml-2 ${chartType === "bar" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setChartType("bar")}
          >
            Bar Chart
          </button>
        </div>
        <TransactionChart
          filteredTransactions={filteredTransactions}
          selectedCustomerId={selectedCustomerId}
          chartType={chartType}
        />
      </div>
    </div>
  );
}
