// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

export interface Challenge {
  slug: string;
  title: string;
  level: "easy" | "medium" | "hard";
  xp: number;
  ordered: boolean;
  prompt: string;
  tables: string[];
  hints: string[];
  solution: string;
}

export const CHALLENGES: Challenge[] = [
  {
    slug: "c1",
    title: "High earners",
    level: "easy",
    xp: 60,
    ordered: true,
    prompt: "List the <b>name</b> and <b>salary</b> of every employee earning more than <b>120,000</b>, highest salary first.",
    tables: ["employees"],
    hints: ["You need two columns, one filter, one sort.", "WHERE salary > 120000, then ORDER BY salary DESC."],
    solution: "SELECT name, salary FROM employees WHERE salary > 120000 ORDER BY salary DESC;",
  },
  {
    slug: "c2",
    title: "Customers per country",
    level: "easy",
    xp: 60,
    ordered: false,
    prompt: "Show each <b>country</b> and the <b>number of customers</b> in it.",
    tables: ["customers"],
    hints: ["One row per country sounds like GROUP BY.", "COUNT(*) per group."],
    solution: "SELECT country, COUNT(*) AS customers FROM customers GROUP BY country;",
  },
  {
    slug: "c3",
    title: "Affordable electronics",
    level: "easy",
    xp: 60,
    ordered: true,
    prompt: "List the <b>name</b> and <b>price</b> of products in the <b>Electronics</b> category priced under <b>100</b>, cheapest first.",
    tables: ["products"],
    hints: ["Two conditions joined with AND.", "ORDER BY price ASC."],
    solution: "SELECT name, price FROM products WHERE category = 'Electronics' AND price < 100 ORDER BY price;",
  },
  {
    slug: "c4",
    title: "Revenue per product",
    level: "medium",
    xp: 100,
    ordered: true,
    prompt: "For every product that has been ordered, show the <b>product name</b> and its <b>total revenue</b> (quantity × unit_price), highest revenue first.",
    tables: ["products", "order_items"],
    hints: ["Join order_items to products on product_id.", "SUM(quantity * unit_price) grouped by product name."],
    solution: `SELECT p.name, SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi JOIN products p ON p.id = oi.product_id
GROUP BY p.name ORDER BY revenue DESC;`,
  },
  {
    slug: "c5",
    title: "Silent customers",
    level: "medium",
    xp: 100,
    ordered: false,
    prompt: "Find the <b>names</b> of customers who have <b>never placed an order</b>.",
    tables: ["customers", "orders"],
    hints: ["This is the anti-join pattern from the OUTER joins lesson.", "LEFT JOIN orders, then keep rows WHERE orders.id IS NULL (NOT IN also works here)."],
    solution: `SELECT c.name FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;`,
  },
  {
    slug: "c6",
    title: "Well-paid departments",
    level: "medium",
    xp: 100,
    ordered: false,
    prompt: "Show each <b>department name</b> and its <b>average salary</b> (rounded to 0 decimals), but only departments whose average exceeds <b>115,000</b>.",
    tables: ["employees", "departments"],
    hints: ["Join, GROUP BY department name.", "A condition on an aggregate goes in HAVING.", "ROUND(AVG(salary), 0)."],
    solution: `SELECT d.name, ROUND(AVG(e.salary),0) AS avg_salary
FROM employees e JOIN departments d ON d.id = e.department_id
GROUP BY d.name HAVING AVG(e.salary) > 115000;`,
  },
  {
    slug: "c7",
    title: "Top spending customers",
    level: "medium",
    xp: 100,
    ordered: true,
    prompt: "Show the <b>top 3 customers by total spend</b> across all their order items: customer <b>name</b> and <b>total_spend</b>, biggest first.",
    tables: ["customers", "orders", "order_items"],
    hints: ["Three tables: customers → orders → order_items.", "SUM(quantity * unit_price) grouped by customer, ORDER BY … DESC LIMIT 3."],
    solution: `SELECT c.name, SUM(oi.quantity * oi.unit_price) AS total_spend
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY c.name ORDER BY total_spend DESC LIMIT 3;`,
  },
  {
    slug: "c8",
    title: "Above their department average",
    level: "hard",
    xp: 150,
    ordered: false,
    prompt: "List the <b>name</b>, <b>salary</b> and <b>department_id</b> of employees who earn <b>more than the average salary of their own department</b>.",
    tables: ["employees"],
    hints: ["Compare each row to an average computed for the same department.", "A correlated subquery: (SELECT AVG(salary) FROM employees e2 WHERE e2.department_id = e.department_id)."],
    solution: `SELECT e.name, e.salary, e.department_id
FROM employees e
WHERE e.salary > (SELECT AVG(e2.salary) FROM employees e2
                  WHERE e2.department_id = e.department_id);`,
  },
  {
    slug: "c9",
    title: "Who reports to whom",
    level: "hard",
    xp: 150,
    ordered: false,
    prompt: "Show every employee who has a manager: <b>employee name</b> and <b>manager name</b>.",
    tables: ["employees"],
    hints: ["Manager info lives in the same table — join it to itself.", "Two aliases: employees e JOIN employees m ON m.id = e.manager_id."],
    solution: `SELECT e.name AS employee, m.name AS manager
FROM employees e JOIN employees m ON m.id = e.manager_id;`,
  },
  {
    slug: "c10",
    title: "Monthly delivered revenue",
    level: "hard",
    xp: 150,
    ordered: true,
    prompt: "For <b>delivered</b> orders only, show each <b>month</b> (format YYYY-MM) and its <b>total revenue</b>, in chronological order.",
    tables: ["orders", "order_items"],
    hints: ["SUBSTR(order_date, 1, 7) extracts YYYY-MM.", "Filter status in WHERE (it's a row filter, not an aggregate).", "GROUP BY the substring expression."],
    solution: `SELECT SUBSTR(o.order_date,1,7) AS month,
       SUM(oi.quantity * oi.unit_price) AS revenue
FROM orders o JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'delivered'
GROUP BY SUBSTR(o.order_date,1,7)
ORDER BY month;`,
  },
  {
    slug: "c11",
    title: "Top earner per department",
    level: "hard",
    xp: 150,
    ordered: false,
    prompt: "Using a <b>window function</b>, show the <b>name</b>, <b>department_id</b> and <b>salary</b> of the single highest-paid employee in each department.",
    tables: ["employees"],
    hints: ["ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) numbers employees within each department.", "You can't filter a window function in the same WHERE — wrap it in a CTE, then keep rn = 1."],
    solution: `WITH ranked AS (
  SELECT name, department_id, salary,
         ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT name, department_id, salary FROM ranked WHERE rn = 1;`,
  },
  {
    slug: "c12",
    title: "Month-over-month revenue",
    level: "hard",
    xp: 150,
    ordered: true,
    prompt: "For <b>delivered</b> orders, show each <b>month</b> (YYYY-MM), its <b>revenue</b>, and the <b>previous month's revenue</b> using LAG, in chronological order. Columns: month, revenue, prev_revenue.",
    tables: ["orders", "order_items"],
    hints: ["First build monthly revenue in a CTE (you solved this in the previous challenge).", "Then LAG(revenue) OVER (ORDER BY month) reads the prior row's value."],
    solution: `WITH monthly AS (
  SELECT SUBSTR(o.order_date,1,7) AS month,
         SUM(oi.quantity * oi.unit_price) AS revenue
  FROM orders o JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status = 'delivered'
  GROUP BY SUBSTR(o.order_date,1,7)
)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue
FROM monthly
ORDER BY month;`,
  },
];
