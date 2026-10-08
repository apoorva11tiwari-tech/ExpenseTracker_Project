import React, { useEffect, useState } from "react";
import API_URL from "../../config/api";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const chartColors = [
  "#E98A72",
  "#9B8FF0",
  "#72C9A7",
  "#E7BD69",
  "#B8A9D9",
  "#A8B5C1",
];

const getArrayFromResponse = (data, possibleKeys = []) => {
  if (Array.isArray(data)) return data;

  for (const key of possibleKeys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          expenseResponse,
          incomeResponse,
          budgetResponse,
          goalResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/expenses`),
          fetch(`${API_URL}/api/income`),
          fetch(`${API_URL}/api/budgets`),
          fetch(`${API_URL}/api/goals`),
        ]);

        if (expenseResponse.ok) {
          const data = await expenseResponse.json();

          setExpenses(
            getArrayFromResponse(data, [
              "expenses",
              "data",
            ])
          );
        } else {
          console.error(
            "Failed to fetch expenses:",
            expenseResponse.status
          );

          setExpenses([]);
        }

        if (incomeResponse.ok) {
          const data = await incomeResponse.json();

          setIncomes(
            getArrayFromResponse(data, [
              "income",
              "incomes",
              "data",
            ])
          );
        } else {
          console.error(
            "Failed to fetch income:",
            incomeResponse.status
          );

          setIncomes([]);
        }

        if (budgetResponse.ok) {
          const data = await budgetResponse.json();

          const budgetArray = getArrayFromResponse(
            data,
            [
              "budgets",
              "budget",
              "data",
            ]
          );

          setBudgets(budgetArray);
        } else {
          console.error(
            "Failed to fetch budgets:",
            budgetResponse.status
          );

          setBudgets([]);
        }

        if (goalResponse.ok) {
          const data = await goalResponse.json();

          const goalArray = getArrayFromResponse(
            data,
            [
              "goals",
              "goal",
              "data",
            ]
          );

          setGoals(goalArray);
        } else {
          console.error(
            "Failed to fetch goals:",
            goalResponse.status
          );

          setGoals([]);
        }
      } catch (error) {
        console.error(
          "Error fetching dashboard data:",
          error
        );
      }
    };

    fetchDashboardData();
  }, []);

  const totalIncome = incomes.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );

  const totalExpense = expenses.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );

  const totalBalance =
    totalIncome - totalExpense;

  const totalBudget = budgets.reduce(
    (sum, item) =>
      sum +
      Number(
        item.amount ??
        item.budgetAmount ??
        item.limit ??
        item.budget ??
        0
      ),
    0
  );

  const budgetRemaining =
    totalBudget > 0
      ? totalBudget - totalExpense
      : totalBalance;

  const categoryMap = expenses.reduce(
    (acc, item) => {
      const category =
        item.category || "Other";

      acc[category] =
        (acc[category] || 0) +
        Number(item.amount || 0);

      return acc;
    },
    {}
  );

  const categoryData = Object.keys(
    categoryMap
  ).map((category) => ({
    name: category,
    value: categoryMap[category],
  }));

  const trendData = (() => {
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();

      date.setMonth(
        date.getMonth() - i
      );

      const monthName =
        date.toLocaleString(
          "en-IN",
          {
            month: "short",
          }
        );

      const monthNumber =
        date.getMonth();

      const year =
        date.getFullYear();

      const monthlyIncome =
        incomes
          .filter((item) => {
            const itemDate =
              new Date(
                item.date ||
                  item.createdAt ||
                  item.created_at
              );

            if (
              isNaN(
                itemDate.getTime()
              )
            ) {
              return false;
            }

            return (
              itemDate.getMonth() ===
                monthNumber &&
              itemDate.getFullYear() ===
                year
            );
          })
          .reduce(
            (sum, item) =>
              sum +
              Number(
                item.amount || 0
              ),
            0
          );

      const monthlyExpense =
        expenses
          .filter((item) => {
            const itemDate =
              new Date(
                item.date ||
                  item.createdAt ||
                  item.created_at
              );

            if (
              isNaN(
                itemDate.getTime()
              )
            ) {
              return false;
            }

            return (
              itemDate.getMonth() ===
                monthNumber &&
              itemDate.getFullYear() ===
                year
            );
          })
          .reduce(
            (sum, item) =>
              sum +
              Number(
                item.amount || 0
              ),
            0
          );

      months.push({
        month: monthName,
        income: monthlyIncome,
        expense: monthlyExpense,
      });
    }

    return months;
  })();

  const getBudgetName = (budget) =>
    budget.category ||
    budget.name ||
    budget.title ||
    "General Budget";

  const getBudgetAmount = (budget) =>
    Number(
      budget.amount ??
      budget.budgetAmount ??
      budget.limit ??
      budget.budget ??
      0
    );

  const getGoalTitle = (goal) =>
    goal.title ||
    goal.name ||
    goal.goalName ||
    "Savings Goal";

  const getGoalTarget = (goal) =>
    Number(
      goal.targetAmount ??
      goal.target ??
      goal.amount ??
      0
    );

  const getGoalSaved = (goal) =>
    Number(
      goal.savedAmount ??
      goal.saved ??
      goal.currentAmount ??
      0
    );

  return (
    <div className="dashboard-page">

      {/* Welcome Message */}

      <div className="dashboard-message">
        <div className="message-icon">
          ✨
        </div>

        <div>
          <strong>
            Welcome to CashMate!
          </strong>

          <p>
            Start adding your income and expenses
            to see your financial summary here.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="row g-4 mt-1">

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-card stat-card balance-card">

            <div className="stat-icon">
              💰
            </div>

            <div className="stat-value">
              ₹
              {totalBalance.toLocaleString(
                "en-IN"
              )}
            </div>

            <div className="stat-title">
              Total Balance
            </div>

            <div className="stat-subtitle">
              Available balance
            </div>

          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-card stat-card income-card">

            <div className="stat-icon">
              📈
            </div>

            <div className="stat-value">
              ₹
              {totalIncome.toLocaleString(
                "en-IN"
              )}
            </div>

            <div className="stat-title">
              Monthly Income
            </div>

            <div className="stat-subtitle">
              This month
            </div>

          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-card stat-card expense-card">

            <div className="stat-icon">
              📉
            </div>

            <div className="stat-value">
              ₹
              {totalExpense.toLocaleString(
                "en-IN"
              )}
            </div>

            <div className="stat-title">
              Total Expenses
            </div>

            <div className="stat-subtitle">
              This month
            </div>

          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="dashboard-card stat-card budget-card">

            <div className="stat-icon">
              🎯
            </div>

            <div className="stat-value">
              ₹
              {budgetRemaining.toLocaleString(
                "en-IN"
              )}
            </div>

            <div className="stat-title">
              Budget Remaining
            </div>

            <div className="stat-subtitle">
              {totalBudget > 0
                ? `of ₹${totalBudget.toLocaleString(
                    "en-IN"
                  )} budget`
                : "Set your budget"}
            </div>

          </div>
        </div>

      </div>

      {/* Charts */}

      <div className="row g-4 mt-1">

        {/* Income vs Expenses */}

        <div className="col-12 col-lg-8">
          <div className="dashboard-card chart-card">

            <h5 className="card-heading">
              Income vs Expenses
            </h5>

            <p className="dashboard-subtitle">
              Your financial activity
            </p>

            {trendData.every(
              (item) =>
                item.income === 0 &&
                item.expense === 0
            ) ? (

              <div className="empty-chart">

                <div className="empty-icon">
                  📊
                </div>

                <h5>
                  No financial data yet
                </h5>

                <p>
                  Add income and expenses to see
                  your chart.
                </p>

              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <AreaChart
                  data={trendData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E8EAF0"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: "#667085",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: "#667085",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      `₹${Number(
                        value
                      ).toLocaleString(
                        "en-IN"
                      )}`
                    }
                  />

                  <Tooltip
                    formatter={(value, name) => [
                      `₹${Number(
                        value
                      ).toLocaleString(
                        "en-IN"
                      )}`,
                      name === "income"
                        ? "Income"
                        : "Expenses",
                    ]}
                    contentStyle={{
                      backgroundColor:
                        "#ffffff",
                      border:
                        "1px solid #E5E7EB",
                      borderRadius:
                        "12px",
                      boxShadow:
                        "0 8px 24px rgba(15, 23, 42, 0.10)",
                    }}
                  />

                  <Legend />

                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    fill="var(--dash-mint)"
                    stroke="var(--dash-mint)"
                    fillOpacity={0.25}
                    strokeWidth={3}
                  />

                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Expenses"
                    fill="var(--dash-coral)"
                    stroke="var(--dash-coral)"
                    fillOpacity={0.25}
                    strokeWidth={3}
                  />

                </AreaChart>

              </ResponsiveContainer>
            )}

          </div>
        </div>

        {/* Categories */}

        <div className="col-12 col-lg-4">
          <div className="dashboard-card chart-card">

            <h5 className="card-heading">
              Categories
            </h5>

            <p className="dashboard-subtitle">
              Expense distribution
            </p>

            {categoryData.length === 0 ? (

              <div className="empty-chart">

                <div className="empty-icon">
                  🥧
                </div>

                <h5>
                  No categories yet
                </h5>

                <p>
                  Add an expense to see categories.
                </p>

              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                  >

                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            chartColors[
                              index %
                                chartColors.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>
            )}

          </div>
        </div>

      </div>

      {/* Recent Transactions */}

      <div className="dashboard-card mt-4">

        <div className="card-heading d-flex justify-content-between align-items-center mb-3">

          <div>

            <h5>
              Recent Transactions
            </h5>

            <p className="dashboard-subtitle mb-0">
              Sorted from newest to oldest
            </p>

          </div>

          <Link
            to="/app/expenses"
            className="view-link"
          >
            View All →
          </Link>

        </div>

        {expenses.length === 0 ? (

          <div className="empty-section">

            <div className="empty-icon">
              💳
            </div>

            <h5>
              No transactions yet
            </h5>

            <p>
              Your recent transactions will appear here.
            </p>

          </div>

        ) : (

          [...expenses]
            .sort(
              (a, b) =>
                new Date(b.date) -
                new Date(a.date)
            )
            .slice(0, 5)
            .map((item) => {

              const categoryKey = (
                item.category ||
                "other"
              ).toLowerCase();

              let categoryClass =
                "cat-other";

              let icon = "🛍️";

              if (
                categoryKey.includes("food") ||
                categoryKey.includes("dining")
              ) {
                categoryClass =
                  "cat-food";

                icon = "🍔";

              } else if (
                categoryKey.includes("shop") ||
                categoryKey.includes("store")
              ) {
                categoryClass =
                  "cat-shopping";

                icon = "🛍️";

              } else if (
                categoryKey.includes("travel") ||
                categoryKey.includes("transport")
              ) {
                categoryClass =
                  "cat-travel";

                icon = "✈️";

              } else if (
                categoryKey.includes("bill") ||
                categoryKey.includes("utility")
              ) {
                categoryClass =
                  "cat-bills";

                icon = "⚡";
              }

              return (

                <div
                  key={
                    item._id ||
                    `${item.title}-${item.date}`
                  }
                  className={`transaction-item ${categoryClass}`}
                >

                  <div
                    className={`transaction-icon-box ${categoryClass}`}
                  >
                    {icon}
                  </div>

                  <div className="transaction-info">

                    <h6>
                      {item.title ||
                        item.category ||
                        "Expense"}
                    </h6>

                    <div className="d-flex align-items-center gap-2 mt-1">

                      <span
                        className={`category-tag ${categoryClass}`}
                      >
                        {item.category ||
                          "General"}
                      </span>

                      <small className="text-muted">
                        •{" "}
                        {item.date
                          ? new Date(
                              item.date
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Date unavailable"}
                      </small>

                    </div>

                  </div>

                  <div className="expense-text fw-bold">
                    -₹
                    {Math.abs(
                      Number(
                        item.amount || 0
                      )
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </div>

                </div>

              );
            })
        )}

      </div>

      {/* Budgets and Goals */}

      <div className="row g-4 mt-1">

        {/* Budgets */}

        <div className="col-12 col-lg-6">

          <div className="dashboard-card">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h5 className="card-heading mb-0">
                Budgets
              </h5>

              {budgets.length > 0 && (

                <span className="budget-count">

                  {budgets.length}{" "}

                  {budgets.length === 1
                    ? "Budget"
                    : "Budgets"}

                </span>

              )}

            </div>

            {budgets.length === 0 ? (

              <div className="empty-section">

                <div className="empty-icon">
                  💰
                </div>

                <h5>
                  No budgets yet
                </h5>

                <p>
                  Create a budget to start tracking
                  your spending.
                </p>

                <button
                  type="button"
                  className="dashboard-action-btn"
                  onClick={() =>
                    navigate(
                      "/app/budget"
                    )
                  }
                >
                  Create Budget
                </button>

              </div>

            ) : (

              <div className="budget-list">

                {budgets
                  .slice(0, 4)
                  .map(
                    (
                      budget,
                      index
                    ) => {

                      const amount =
                        getBudgetAmount(
                          budget
                        );

                      const category =
                        getBudgetName(
                          budget
                        );

                      /*
                       * First check whether backend
                       * already provides spent amount.
                       */
                      const backendSpent =
                        Number(
                          budget.spent ??
                          budget.usedAmount ??
                          0
                        );

                      /*
                       * If backend gives 0,
                       * calculate spent amount from
                       * the expenses already fetched.
                       */
                      const expenseSpent =
                        expenses
                          .filter(
                            (expense) =>
                              String(
                                expense.category ||
                                  ""
                              )
                                .trim()
                                .toLowerCase() ===
                              String(
                                category ||
                                  ""
                              )
                                .trim()
                                .toLowerCase()
                          )
                          .reduce(
                            (
                              sum,
                              expense
                            ) =>
                              sum +
                              Number(
                                expense.amount ||
                                  0
                              ),
                            0
                          );

                      const spent =
                        backendSpent > 0
                          ? backendSpent
                          : expenseSpent;

                      const percentage =
                        amount > 0
                          ? Math.min(
                              Math.round(
                                (spent /
                                  amount) *
                                  100
                              ),
                              100
                            )
                          : 0;

                      return (

                        <div
                          key={
                            budget._id ||
                            `${category}-${index}`
                          }
                          className="budget-item"
                        >

                          <div className="d-flex justify-content-between align-items-center mb-2">

                            <strong>
                              {category}
                            </strong>

                          </div>

                          {/* Only spent amount */}

                          <div className="budget-spent-amount">
                            ₹
                            {spent.toLocaleString(
                              "en-IN"
                            )}
                          </div>

                          <div className="budget-progress">

                            <div
                              className="budget-progress-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                          {/* Only percentage */}

                          <div className="d-flex justify-content-between mt-2">

                            <small className="text-muted">
                              {percentage}% used
                            </small>

                          </div>

                        </div>

                      );
                    }
                  )}

                {budgets.length > 4 && (

                  <button
                    type="button"
                    className="dashboard-text-btn"
                    onClick={() =>
                      navigate(
                        "/app/budget"
                      )
                    }
                  >
                    View all budgets →
                  </button>

                )}

              </div>

            )}

          </div>

        </div>

        {/* Savings Goals */}

        <div className="col-12 col-lg-6">

          <div className="dashboard-card">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h5 className="card-heading mb-0">
                Savings Goals
              </h5>

              {goals.length > 0 && (

                <span className="goal-count">

                  {goals.length}{" "}

                  {goals.length === 1
                    ? "Goal"
                    : "Goals"}

                </span>

              )}

            </div>

            {goals.length === 0 ? (

              <div className="empty-section">

                <div className="empty-icon">
                  🎯
                </div>

                <h5>
                  No goals yet
                </h5>

                <p>
                  Create a savings goal to track
                  your progress.
                </p>

                <button
                  type="button"
                  className="dashboard-action-btn"
                  onClick={() =>
                    navigate(
                      "/app/goals"
                    )
                  }
                >
                  Create Goal
                </button>

              </div>

            ) : (

              <div className="goal-list">

                {goals
                  .slice(0, 4)
                  .map(
                    (
                      goal,
                      index
                    ) => {

                      const title =
                        getGoalTitle(
                          goal
                        );

                      const target =
                        getGoalTarget(
                          goal
                        );

                      const saved =
                        getGoalSaved(
                          goal
                        );

                      const percentage =
                        target > 0
                          ? Math.min(
                              Math.round(
                                (saved /
                                  target) *
                                  100
                              ),
                              100
                            )
                          : 0;

                      return (

                        <div
                          key={
                            goal._id ||
                            `${title}-${index}`
                          }
                          className="goal-item"
                        >

                          <div className="d-flex justify-content-between align-items-center mb-2">

                            <strong>
                              {title}
                            </strong>

                          </div>

                          {/* Only target amount */}

                          <div className="goal-target-amount">
                            ₹
                            {target.toLocaleString(
                              "en-IN"
                            )}
                          </div>

                          <div className="goal-progress">

                            <div
                              className="goal-progress-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                          {/* Only percentage */}

                          <div className="d-flex justify-content-between mt-2">

                            <small className="text-muted">
                              {percentage}% completed
                            </small>

                          </div>

                        </div>

                      );
                    }
                  )}

                {goals.length > 4 && (

                  <button
                    type="button"
                    className="dashboard-text-btn"
                    onClick={() =>
                      navigate(
                        "/app/goals"
                      )
                    }
                  >
                    View all goals →
                  </button>

                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}