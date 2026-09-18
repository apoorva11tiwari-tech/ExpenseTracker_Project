
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";




import {
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";


// Empty data for now.
// Later you can get this data from Firebase/MongoDB/API.

const trendData = [];

const categoryData = [];

const transactions = [];

const budgets = [];

const goals = [];




// Colors for category chart
const chartColors = [
  "#E85D2E",
  "#9B8AFB",
  "#6FCF97",
  "#F4A261",
  "#B8A9D9",
  "#A8B5C1"
];


// ================= STAT CARD =================

function StatCard({ title, value, subtitle, icon, trend, className }) {
  return (
    <div className={`dashboard-card stat-card ${className || ""}`}>

      <div className="stat-top">

        <div className="stat-icon">
          {icon}
        </div>

        {trend !== undefined && (
          <span className="stat-trend">
            {trend > 0 ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}

            {Math.abs(trend)}%
          </span>
        )}

      </div>

      <h3 className="stat-value">
        {value}
      </h3>

      <p className="stat-title">
        {title}
      </p>

      {subtitle && (
        <p className="stat-subtitle">
          {subtitle}
        </p>
      )}

    </div>
  );
}


// ================= DASHBOARD =================

export default function Dashboard() {

const navigate = useNavigate();
  return (
    <>

    <div>
      <button
  className="btn btn-primary"
  onClick={() => navigate("/app/add-expense")}
>
  + Add Expense
</button>
    </div>

    <div className="dashboard-page">

      <div className="container-fluid">

        {/* ================= HEADER ================= */}

        <div className="dashboard-header">

          <div>

            <h1 className="dashboard-title">
              Dashboard
            </h1>

            <p className="dashboard-subtitle">
              Manage and track your finances easily.
            </p>

          </div>

        </div>


        {/* ================= STATUS MESSAGE ================= */}

        <div className="dashboard-message">

          <span className="message-icon">
            ✨
          </span>

          <div>

            <strong>
              Welcome to CashMate!
            </strong>

            <p>
              Start adding your income and expenses to see
              your financial summary here.
            </p>

          </div>

        </div>


        {/* ================= STAT CARDS ================= */}

        <div className="row g-4 mb-4">

          <div className="col-12 col-sm-6 col-lg-3">

            <StatCard
              title="Total Balance"
              value="₹0"
              subtitle="Available balance"
              icon="💰"
              className="balance-card"
            />

          </div>


          <div className="col-12 col-sm-6 col-lg-3">

            <StatCard
              title="Monthly Income"
              value="₹0"
              subtitle="This month"
              icon="📈"
              className="income-card"
            />

          </div>


          <div className="col-12 col-sm-6 col-lg-3">

            <StatCard
              title="Total Expenses"
              value="₹0"
              subtitle="This month"
              icon="📉"
              className="expense-card"
            />

          </div>


          <div className="col-12 col-sm-6 col-lg-3">

            <StatCard
              title="Budget Remaining"
              value="₹0"
              subtitle="Set your budget"
              icon="🎯"
              className="budget-card"
            />

          </div>

        </div>


        {/* ================= CHARTS ================= */}

        <div className="row g-4 mb-4">

          {/* Income vs Expense */}

          <div className="col-12 col-lg-8">

            <div className="dashboard-card chart-card">

              <div className="card-heading">

                <div>

                  <h2>
                    Income vs Expenses
                  </h2>

                  <p>
                    Your financial activity
                  </p>

                </div>

                <span className="card-emoji">
                  📊
                </span>

              </div>


              {trendData.length === 0 ? (

                <div className="empty-chart">

                  <div className="empty-icon">
                    📊
                  </div>

                  <h5>
                    No financial data yet
                  </h5>

                  <p>
                    Add income and expenses to view your chart.
                  </p>

                </div>

              ) : (

                <ResponsiveContainer width="100%" height={280}>

                  <AreaChart data={trendData}>

                    <defs>

                      <linearGradient
                        id="incomeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#6FCF97"
                          stopOpacity={0.3}
                        />

                        <stop
                          offset="95%"
                          stopColor="#6FCF97"
                          stopOpacity={0}
                        />

                      </linearGradient>


                      <linearGradient
                        id="expenseGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#E85D2E"
                          stopOpacity={0.3}
                        />

                        <stop
                          offset="95%"
                          stopColor="#E85D2E"
                          stopOpacity={0}
                        />

                      </linearGradient>

                    </defs>


                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Legend />


                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#6FCF97"
                      fill="url(#incomeGradient)"
                      strokeWidth={2}
                      name="Income"
                    />


                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#E85D2E"
                      fill="url(#expenseGradient)"
                      strokeWidth={2}
                      name="Expenses"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>


          {/* Categories */}

          <div className="col-12 col-lg-4">

            <div className="dashboard-card chart-card">

              <div className="card-heading">

                <div>

                  <h2>
                    Categories
                  </h2>

                  <p>
                    Expense distribution
                  </p>

                </div>

                <span className="card-emoji">
                  🥧
                </span>

              </div>


              {categoryData.length === 0 ? (

                <div className="empty-chart">

                  <div className="empty-icon">
                    🥧
                  </div>

                  <h5>
                    No categories yet
                  </h5>

                  <p>
                    Add an expense to see category details.
                  </p>

                </div>

              ) : (

                <>

                  <ResponsiveContainer
                    width="100%"
                    height={200}
                  >

                    <PieChart>

                      <Pie
                        data={categoryData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                      >

                        {categoryData.map((entry, index) => (

                          <Cell
                            key={index}
                            fill={
                              chartColors[
                                index % chartColors.length
                              ]
                            }
                          />

                        ))}

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>


                  <div className="category-list">

                    {categoryData.map((category) => (

                      <div
                        key={category.name}
                        className="category-item"
                      >

                        <span>
                          {category.name}
                        </span>

                        <strong>
                          ₹{category.value}
                        </strong>

                      </div>

                    ))}

                  </div>

                </>

              )}

            </div>

          </div>

        </div>


        {/* ================= BOTTOM SECTION ================= */}

        <div className="row g-4">

          {/* Recent Transactions */}

          <div className="col-12 col-lg-8">

            <div className="dashboard-card">

              <div className="card-heading">

                <div>

                  <h2>
                    Recent Transactions
                  </h2>

                  <p>
                    Your latest income and expenses
                  </p>

                </div>

                <a
                  href="/app/transactions"
                  className="view-link"
                >
                  View all →
                </a>

              </div>


              {transactions.length === 0 ? (

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

                <div>

                  {transactions.map((transaction) => (

                    <div
                      key={transaction.id}
                      className="transaction-item"
                    >

                      <div className="transaction-icon">
                        {transaction.icon}
                      </div>


                      <div className="transaction-info">

                        <h6>
                          {transaction.name}
                        </h6>

                        <p>
                          {transaction.category}
                        </p>

                      </div>


                      <strong
                        className={
                          transaction.amount > 0
                            ? "income-text"
                            : "expense-text"
                        }
                      >

                        {transaction.amount > 0
                          ? "+"
                          : "-"}₹
                        {Math.abs(
                          transaction.amount
                        ).toLocaleString()}

                      </strong>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>


          {/* Budget */}

          <div className="col-12 col-lg-4">

            <div className="dashboard-card">

              <div className="card-heading">

                <div>

                  <h2>
                    Budget Progress
                  </h2>

                  <p>
                    Track your spending limits
                  </p>

                </div>

                <span className="card-emoji">
                  🎯
                </span>

              </div>


              {budgets.length === 0 ? (

                <div className="empty-section">

                  <div className="empty-icon">
                    🎯
                  </div>

                  <h5>
                    No budget set
                  </h5>

                  <p>
                    Create a budget to start tracking your spending.
                  </p>

                </div>

              ) : (

                <div>

                  {budgets.map((budget) => {

                    const percentage =
                      Math.round(
                        (budget.used / budget.total) * 100
                      );

                    return (

                      <div
                        key={budget.category}
                        className="budget-item"
                      >

                        <div className="budget-top">

                          <span>
                            {budget.category}
                          </span>

                          <strong>
                            {percentage}%
                          </strong>

                        </div>


                        <div className="progress">

                          <div
                            className="progress-bar"
                            style={{
                              width: `${percentage}%`
                            }}
                          ></div>

                        </div>

                      </div>

                    );

                  })}

                </div>

              )}

            </div>


            {/* Financial Goals */}

            <div className="dashboard-card mt-4">

              <div className="card-heading">

                <div>

                  <h2>
                    Financial Goals
                  </h2>

                  <p>
                    Save towards your goals
                  </p>

                </div>

                <span className="card-emoji">
                  🏆
                </span>

              </div>


              {goals.length === 0 ? (

                <div className="empty-section">

                  <div className="empty-icon">
                    🏆
                  </div>

                  <h5>
                    No goals yet
                  </h5>

                  <p>
                    Create a financial goal to track your savings.
                  </p>

                </div>

              ) : (

                <div>

                  {goals.map((goal) => (

                    <div
                      key={goal.name}
                      className="goal-item"
                    >

                      <div className="budget-top">

                        <span>
                          {goal.name}
                        </span>

                        <span>
                          ₹{goal.saved} / ₹{goal.target}
                        </span>

                      </div>


                      <div className="progress">

                        <div
                          className="progress-bar goal-progress"
                          style={{
                            width: `${goal.percentage}%`
                          }}
                        ></div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
</>
  );
}