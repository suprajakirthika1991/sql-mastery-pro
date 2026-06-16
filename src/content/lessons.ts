// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

export interface Lesson {
  slug: string;
  title: string;
  level: "easy" | "medium" | "hard";
  minutes: number;
  why: string;
  analogy: string;
  body: string;
  sql: string;
  mistakes: string[];
  takeaways: string[];
}

export const LESSONS: Lesson[] = [
  {
    slug: "intro",
    title: "Databases & SQL: the big picture",
    level: "easy",
    minutes: 6,
    why: "Almost every product you use — your bank app, Netflix, your hospital records — sits on top of a database. SQL is the one language nearly all of them share, which is why it appears in virtually every data job description.",
    analogy: "A database is a giant, well-organised filing cabinet. Tables are the drawers, rows are the individual files, and columns are the labelled fields on each file. SQL is the polite, precise note you hand the filing clerk: \"bring me every customer file from Sydney, sorted by name.\"",
    body: `<h3>What is a database?</h3><p>A <b>database</b> is an organised collection of data. A <b>DBMS</b> (Database Management System) is the software that stores, retrieves and protects that data. An <b>RDBMS</b> (Relational DBMS — PostgreSQL, MySQL, SQL Server, Oracle) organises data into related <b>tables</b> of rows and columns.</p><h3>What is SQL?</h3><p><b>SQL</b> (Structured Query Language) is a <i>declarative</i> language: you describe <i>what</i> data you want, and the engine figures out <i>how</i> to fetch it. It splits into sub-languages: <b>DQL</b> (SELECT), <b>DML</b> (INSERT/UPDATE/DELETE), <b>DDL</b> (CREATE/ALTER/DROP), <b>DCL</b> (GRANT/REVOKE) and <b>TCL</b> (COMMIT/ROLLBACK).</p>`,
    sql: `-- Your very first query: look at the whole employees table
SELECT * FROM employees;`,
    mistakes: [
      "Thinking SQL is case-sensitive — keywords aren't, but string values usually are.",
      "Using SELECT * in production code: it fetches columns you don't need and breaks when schemas change.",
    ],
    takeaways: [
      "SQL is declarative: say what, not how.",
      "Tables = rows + columns; relational databases link tables via keys.",
      "SELECT is just one of five SQL sub-languages.",
    ],
  },
  {
    slug: "select",
    title: "SELECT & WHERE: asking questions",
    level: "easy",
    minutes: 8,
    why: "90% of the SQL you will write at work starts with SELECT … WHERE. Mastering filtering is the foundation of analysis, debugging and data validation.",
    analogy: "SELECT chooses which columns of the filing-card you photocopy; WHERE chooses which cards even come out of the drawer.",
    body: `<h3>Choosing columns</h3><p>List the columns you want after <code>SELECT</code>, separated by commas. Rename them with <code>AS</code> (an <b>alias</b>).</p><h3>Filtering rows</h3><p><code>WHERE</code> keeps only rows where the condition is true. Comparison operators: <code>=, &lt;&gt;, &gt;, &lt;, &gt;=, &lt;=</code>. Text values go in <b>single quotes</b>.</p>`,
    sql: `SELECT name, role, salary AS annual_salary
FROM employees
WHERE salary > 120000;`,
    mistakes: [
      "Double quotes around strings — most engines treat \"...\" as an identifier, not text.",
      "Filtering an alias in WHERE (WHERE annual_salary > …) — aliases aren't visible to WHERE because it runs before SELECT.",
    ],
    takeaways: [
      "SELECT picks columns; WHERE picks rows.",
      "Logical execution order: FROM → WHERE → SELECT → ORDER BY.",
      "Use aliases for readable result sets.",
    ],
  },
  {
    slug: "sort",
    title: "ORDER BY, LIMIT & DISTINCT",
    level: "easy",
    minutes: 7,
    why: "\"Top 10 customers\", \"latest 5 orders\", \"list of unique countries\" — sorting, limiting and de-duplicating answer some of the most common business questions.",
    analogy: "ORDER BY is shuffling the photocopies into a neat pile; LIMIT is taking only the top few sheets; DISTINCT is throwing away duplicate sheets.",
    body: `<h3>Sorting</h3><p><code>ORDER BY column ASC|DESC</code>. You can sort by several columns: ties on the first are broken by the second.</p><h3>Limiting</h3><p><code>LIMIT n</code> (Postgres/MySQL) or <code>TOP n</code> (SQL Server) returns only the first n rows — always pair it with ORDER BY, otherwise "first" is arbitrary.</p><h3>De-duplicating</h3><p><code>SELECT DISTINCT</code> removes duplicate rows from the result.</p>`,
    sql: `SELECT DISTINCT country FROM customers;

-- Top 3 earners
SELECT name, salary FROM employees
ORDER BY salary DESC
LIMIT 3;`,
    mistakes: [
      "Using LIMIT without ORDER BY and assuming a stable order — row order is never guaranteed without ORDER BY.",
      "DISTINCT applies to the whole row, not just the first column.",
    ],
    takeaways: [
      "ORDER BY runs last, so it CAN use SELECT aliases.",
      "LIMIT/TOP is engine-specific syntax for the same idea.",
      "DISTINCT de-duplicates entire rows.",
    ],
  },
  {
    slug: "filter",
    title: "Filtering deep dive: IN, BETWEEN, LIKE, NULL",
    level: "easy",
    minutes: 9,
    why: "Real filters are rarely a single condition. Combining predicates correctly — especially around NULL — separates juniors from seniors.",
    analogy: "NULL is an empty, unlabelled box. You can't ask \"does this box equal 5?\" — the honest answer is \"unknown\". That's why NULL = NULL is not true; you must ask IS NULL.",
    body: `<h3>Combining conditions</h3><p><code>AND</code>, <code>OR</code>, <code>NOT</code> — and remember AND binds tighter than OR, so use parentheses.</p><h3>Shorthand predicates</h3><ul><li><code>IN (a, b, c)</code> — matches any value in the list.</li><li><code>BETWEEN x AND y</code> — inclusive range.</li><li><code>LIKE 'A%'</code> — pattern match. <code>%</code> = any string, <code>_</code> = one character.</li></ul><h3>NULL handling</h3><p>Use <code>IS NULL</code> / <code>IS NOT NULL</code>. Any comparison with NULL yields UNKNOWN and the row is filtered out — a classic source of "missing rows" bugs.</p>`,
    sql: `SELECT name, city, segment
FROM customers
WHERE country IN ('Australia','New Zealand')
  AND name LIKE '%o%';

-- Who has no manager?
SELECT name, role FROM employees
WHERE manager_id IS NULL;`,
    mistakes: [
      "WHERE col = NULL — always returns nothing. Use IS NULL.",
      "Forgetting parentheses when mixing AND/OR: a = 1 OR b = 2 AND c = 3 means a = 1 OR (b = 2 AND c = 3).",
      "NOT IN with a list containing NULL silently returns zero rows.",
    ],
    takeaways: [
      "NULL needs IS NULL, never =.",
      "Parenthesise mixed AND/OR logic.",
      "BETWEEN is inclusive on both ends.",
    ],
  },
  {
    slug: "agg",
    title: "Aggregations: COUNT, SUM, AVG, MIN, MAX",
    level: "easy",
    minutes: 7,
    why: "Aggregations turn raw rows into answers: revenue, head-count, averages, extremes. Every dashboard metric is an aggregate.",
    analogy: "An aggregate function is a blender: many rows go in, one number comes out.",
    body: `<h3>The big five</h3><ul><li><code>COUNT(*)</code> — number of rows; <code>COUNT(col)</code> ignores NULLs; <code>COUNT(DISTINCT col)</code> counts unique values.</li><li><code>SUM</code>, <code>AVG</code> — numeric totals and means (both ignore NULLs).</li><li><code>MIN</code>, <code>MAX</code> — work on numbers, text and dates.</li></ul>`,
    sql: `SELECT COUNT(*)              AS num_employees,
       ROUND(AVG(salary), 0)  AS avg_salary,
       MIN(hire_date)         AS earliest_hire,
       MAX(salary)            AS top_salary
FROM employees;`,
    mistakes: [
      "AVG over a column with NULLs divides by the non-null count — that may or may not be what you want.",
      "Mixing aggregated and non-aggregated columns without GROUP BY.",
    ],
    takeaways: [
      "COUNT(*) counts rows; COUNT(col) skips NULLs.",
      "Aggregates collapse many rows into one.",
      "MIN/MAX work on dates and text too.",
    ],
  },
  {
    slug: "group",
    title: "GROUP BY & HAVING",
    level: "medium",
    minutes: 9,
    why: "\"Revenue per region\", \"orders per customer\", \"average salary per department\" — per-something questions are the heart of analytics, and GROUP BY is how you answer them.",
    analogy: "GROUP BY sorts the filing cards into labelled piles, then runs the blender once per pile. HAVING throws away whole piles that don't meet a condition.",
    body: `<h3>How it works</h3><p><code>GROUP BY col</code> creates one result row per distinct value. Every column in SELECT must be either in the GROUP BY or inside an aggregate.</p><h3>WHERE vs HAVING</h3><p><code>WHERE</code> filters <b>rows before</b> grouping; <code>HAVING</code> filters <b>groups after</b> aggregation. Use WHERE whenever possible — it's cheaper because fewer rows reach the grouping step.</p>`,
    sql: `SELECT d.name           AS department,
       COUNT(*)          AS headcount,
       ROUND(AVG(e.salary),0) AS avg_salary
FROM employees e
JOIN departments d ON d.id = e.department_id
GROUP BY d.name
HAVING COUNT(*) >= 2
ORDER BY avg_salary DESC;`,
    mistakes: [
      "Selecting a column that's not grouped or aggregated.",
      "Putting an aggregate condition in WHERE (WHERE COUNT(*) > 2) — aggregates only exist after grouping, so it belongs in HAVING.",
    ],
    takeaways: [
      "One output row per group.",
      "WHERE = before grouping, HAVING = after.",
      "Order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.",
    ],
  },
  {
    slug: "innerjoin",
    title: "INNER JOIN: combining tables",
    level: "medium",
    minutes: 10,
    why: "Relational data is split across tables on purpose (normalisation). Joins stitch it back together — they are the single most-tested SQL topic in interviews.",
    analogy: "Think of online shopping: one drawer holds customers, another holds orders. An INNER JOIN matches each order card to its customer card using the customer id written on both — orders whose id matches no customer (and customers with no orders) simply don't appear in the matched stack.",
    body: `<h3>Syntax</h3><p><code>FROM a JOIN b ON a.key = b.key</code>. The ON condition says how rows pair up — usually a foreign key matching a primary key.</p><h3>What INNER means</h3><p>Only rows with a match on <b>both</b> sides survive. Unmatched rows vanish silently — which is exactly when you reach for OUTER joins (next lesson).</p>`,
    sql: `SELECT o.id AS order_id, c.name AS customer, o.order_date, o.status
FROM orders o
INNER JOIN customers c ON c.id = o.customer_id
ORDER BY o.order_date;`,
    mistakes: [
      "Joining on the wrong key and getting a row explosion (accidental many-to-many).",
      "Forgetting the ON clause — in some engines that becomes a CROSS JOIN of every row with every row.",
      "Ambiguous column names: qualify with table aliases (o.id, c.id).",
    ],
    takeaways: [
      "INNER JOIN keeps only matched rows.",
      "Always alias tables and qualify columns.",
      "Row counts changing unexpectedly after a join usually means a duplicate-key issue.",
    ],
  },
  {
    slug: "outerjoin",
    title: "LEFT, RIGHT, FULL & SELF joins",
    level: "medium",
    minutes: 10,
    why: "\"Customers who never ordered\", \"products never sold\" — questions about missing relationships need OUTER joins. Self joins handle hierarchies like employee → manager.",
    analogy: "A LEFT JOIN keeps every card from the left drawer; where no partner exists in the right drawer it staples on a blank (NULL) card instead of discarding.",
    body: `<h3>The family</h3><ul><li><b>LEFT JOIN</b> — all left rows, matched right rows or NULLs.</li><li><b>RIGHT JOIN</b> — mirror image (rarely used; rewrite as LEFT).</li><li><b>FULL OUTER JOIN</b> — everything from both sides.</li><li><b>CROSS JOIN</b> — every combination (cartesian product).</li><li><b>SELF JOIN</b> — a table joined to itself with two aliases.</li></ul><h3>The anti-join pattern</h3><p>LEFT JOIN + <code>WHERE right.key IS NULL</code> finds left rows with no match — the classic "customers without orders" query.</p>`,
    sql: `-- Customers and how many orders each has (including zero)
SELECT c.name, COUNT(o.id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.name
ORDER BY orders DESC;

-- Self join: employee with manager
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;`,
    mistakes: [
      "Putting a right-table filter in WHERE after a LEFT JOIN (e.g. WHERE o.status = 'delivered') — it silently turns the join back into an INNER join. Put it in the ON clause instead.",
      "COUNT(*) instead of COUNT(o.id) after a LEFT JOIN counts the NULL-padded rows too.",
    ],
    takeaways: [
      "LEFT JOIN preserves the left table.",
      "Filter the right table in ON, not WHERE, to stay OUTER.",
      "LEFT JOIN … IS NULL = anti-join.",
    ],
  },
  {
    slug: "subq",
    title: "Subqueries: queries inside queries",
    level: "medium",
    minutes: 9,
    why: "Subqueries let you answer two-step questions in one statement: \"who earns more than the average?\", \"which products appear in cancelled orders?\"",
    analogy: "A subquery is a sticky note with a smaller question on it. The clerk answers the sticky note first, then uses that answer inside your main request.",
    body: `<h3>Three flavours</h3><ul><li><b>Scalar</b> — returns one value: <code>WHERE salary &gt; (SELECT AVG(salary) FROM employees)</code>.</li><li><b>List</b> — returns one column for IN / NOT IN / EXISTS.</li><li><b>Correlated</b> — references the outer row, so it conceptually re-runs per row. Powerful but watch performance.</li></ul>`,
    sql: `-- Employees earning above the company average
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Products that were ordered at least once
SELECT name FROM products
WHERE id IN (SELECT product_id FROM order_items);`,
    mistakes: [
      "NOT IN against a subquery that can return NULL → zero rows. Prefer NOT EXISTS.",
      "A scalar subquery that accidentally returns multiple rows throws an error.",
    ],
    takeaways: [
      "Scalar, list, correlated — know which you're writing.",
      "Prefer NOT EXISTS over NOT IN for null-safety.",
      "Many subqueries can be rewritten as joins (and vice versa).",
    ],
  },
  {
    slug: "case",
    title: "CASE: conditional logic",
    level: "medium",
    minutes: 7,
    why: "CASE is SQL's if/else. It powers bucketing (\"small / medium / large\"), pivot-style conditional aggregation, and custom sort orders.",
    analogy: "CASE is a sorting clerk reading each card top-to-bottom against a checklist and stamping it with the first label that matches.",
    body: `<h3>Syntax</h3><p><code>CASE WHEN cond THEN value WHEN … ELSE value END</code>. Conditions are checked in order; the first true wins; without ELSE you get NULL.</p><h3>Conditional aggregation</h3><p><code>SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END)</code> counts a subset inside a group — an interview favourite.</p>`,
    sql: `SELECT name, salary,
  CASE
    WHEN salary >= 160000 THEN 'Executive band'
    WHEN salary >= 120000 THEN 'Senior band'
    ELSE 'Standard band'
  END AS pay_band
FROM employees
ORDER BY salary DESC;`,
    mistakes: [
      "Overlapping WHEN conditions in the wrong order — the first match wins, so put the most specific first.",
      "Forgetting END.",
    ],
    takeaways: [
      "First true WHEN wins.",
      "No ELSE → NULL.",
      "CASE inside SUM/COUNT = conditional aggregation.",
    ],
  },
  {
    slug: "set",
    title: "Set operators: UNION & friends",
    level: "medium",
    minutes: 6,
    why: "When two queries produce the same shape of result, set operators stack or compare them — combining regions, reconciling systems, finding diffs between tables.",
    analogy: "UNION pours two stacks of identical-format cards into one pile and removes duplicates; UNION ALL just stacks them as-is (faster).",
    body: `<h3>The operators</h3><ul><li><code>UNION</code> — combine + de-duplicate.</li><li><code>UNION ALL</code> — combine, keep duplicates (cheaper).</li><li><code>INTERSECT</code> — rows present in both.</li><li><code>EXCEPT</code> / <code>MINUS</code> — rows in the first but not the second.</li></ul><p>Rules: same number of columns, compatible types; column names come from the first query.</p>`,
    sql: `SELECT name, 'employee' AS kind FROM employees WHERE department_id = 2
UNION ALL
SELECT name, 'customer' AS kind FROM customers WHERE country = 'India'
ORDER BY kind, name;`,
    mistakes: [
      "Using UNION when UNION ALL would do — the implicit de-duplication sort is expensive on large data.",
      "Column count/type mismatches between the two queries.",
    ],
    takeaways: [
      "UNION de-dupes, UNION ALL doesn't.",
      "EXCEPT is great for data reconciliation.",
      "Column names come from the first SELECT.",
    ],
  },
  {
    slug: "cte",
    title: "CTEs: readable, layered queries",
    level: "medium",
    minutes: 8,
    why: "Common Table Expressions (WITH …) let you name intermediate steps, turning a nested monster into a readable pipeline. Recursive CTEs walk hierarchies like org charts.",
    analogy: "A CTE is a labelled tray on your desk: do step one, put the result in the tray, then work from the tray instead of redoing the step.",
    body: `<h3>Syntax</h3><p><code>WITH step1 AS (SELECT …), step2 AS (SELECT … FROM step1) SELECT … FROM step2</code>. Each CTE can reference earlier ones.</p><h3>Recursive CTEs</h3><p>An anchor query UNION ALL a recursive part that references the CTE itself — the standard tool for org charts, folder trees and bill-of-materials. (Fully supported by the SQLite engine in this playground — try one!)</p>`,
    sql: `WITH revenue_per_order AS (
  SELECT order_id, SUM(quantity * unit_price) AS revenue
  FROM order_items
  GROUP BY order_id
)
SELECT o.id, c.name AS customer, r.revenue
FROM orders o
JOIN revenue_per_order r ON r.order_id = o.id
JOIN customers c ON c.id = o.customer_id
ORDER BY r.revenue DESC;`,
    mistakes: [
      "Assuming a CTE is materialised/cached — many engines inline it, so referencing it twice may compute it twice.",
      "Using CTEs where a simple subquery is clearer for tiny steps.",
    ],
    takeaways: [
      "CTEs are about readability and layering.",
      "Later CTEs can reference earlier ones.",
      "Recursive CTEs traverse hierarchies.",
    ],
  },
  {
    slug: "window",
    title: "Window functions: rank, lag, running totals",
    level: "hard",
    minutes: 12,
    why: "Window functions compute per-row values over a \"window\" of related rows without collapsing them — top-N per group, running totals, month-over-month change. They dominate senior interviews.",
    analogy: "GROUP BY blends the pile into one smoothie; a window function walks along the pile and writes a note on every card — \"you are #2 in your department\" — while leaving every card intact.",
    body: `<h3>Anatomy</h3><p><code>func() OVER (PARTITION BY … ORDER BY …)</code>. PARTITION BY defines the groups, ORDER BY defines order within them.</p><h3>The classics</h3><ul><li><code>ROW_NUMBER()</code> — unique sequence; <code>RANK()</code> skips after ties; <code>DENSE_RANK()</code> doesn't.</li><li><code>LAG()/LEAD()</code> — previous / next row's value (period-over-period change).</li><li><code>SUM() OVER (ORDER BY …)</code> — running total.</li><li><code>NTILE(n)</code> — split into n buckets.</li></ul><h3>Top-N per group pattern</h3><p>Wrap in a CTE, compute ROW_NUMBER per partition, filter <code>WHERE rn &lt;= 3</code> outside — you can't filter a window function in the same query's WHERE.</p>`,
    sql: `-- Pattern: highest-paid employee per department
WITH ranked AS (
  SELECT name, department_id, salary,
         ROW_NUMBER() OVER (
           PARTITION BY department_id
           ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT * FROM ranked WHERE rn = 1;`,
    mistakes: [
      "Filtering on the window function in the same SELECT's WHERE — wrap it in a CTE first.",
      "Using RANK when you need ROW_NUMBER (ties produce duplicates in \"top 1 per group\").",
    ],
    takeaways: [
      "Windows annotate rows; GROUP BY collapses them.",
      "ROW_NUMBER vs RANK vs DENSE_RANK differ only on ties.",
      "Top-N per group = ROW_NUMBER + CTE + filter.",
    ],
  },
  {
    slug: "perf",
    title: "Indexes, execution plans & tuning",
    level: "hard",
    minutes: 10,
    why: "A correct query that takes 40 minutes is still a failed query. Understanding indexes and plans is what makes you trustworthy on production data.",
    analogy: "An index is the alphabetical tab-divider set in the filing drawer: finding \"Nguyen\" takes seconds instead of reading every card. But every new card now needs its tabs updated too — indexes speed reads and tax writes.",
    body: `<h3>Indexes</h3><p>A B-tree index lets the engine seek directly to matching rows. Index columns used in WHERE, JOIN and ORDER BY. Composite indexes work left-to-right: an index on (a, b) helps a-filters and a+b-filters, not b alone.</p><h3>Why an index gets ignored</h3><ul><li>Wrapping the column in a function: <code>WHERE UPPER(name) = 'X'</code>.</li><li>Leading wildcard: <code>LIKE '%son'</code>.</li><li>Implicit type conversion, or the table is small enough that a scan is cheaper.</li></ul><h3>Execution plans</h3><p><code>EXPLAIN</code> shows the engine's strategy: scans vs seeks, join algorithms (nested loop, hash, merge), row estimates. Tuning is mostly: filter early, index the right columns, select only needed columns, and keep statistics fresh.</p>`,
    sql: `-- Sargable (index-friendly) vs not:
-- BAD:  WHERE UPPER(name) = 'PRIYA RAMAN'
-- GOOD: WHERE name = 'Priya Raman'

-- BAD:  WHERE order_date <> '2026-01-01'
-- GOOD: WHERE order_date >= '2026-01-01' AND order_date < '2026-02-01'
SELECT 'Read the comments above - this lesson is about patterns' AS note;`,
    mistakes: [
      "Indexing everything: each index slows every INSERT/UPDATE.",
      "SELECT * forcing wide reads and killing covering-index benefits.",
      "Functions on filtered columns making predicates non-sargable.",
    ],
    takeaways: [
      "Index WHERE/JOIN/ORDER BY columns, left-to-right for composites.",
      "Keep predicates sargable: no functions on the column side.",
      "EXPLAIN before you optimise — measure, don't guess.",
    ],
  },
  {
    slug: "dw",
    title: "Data warehousing: OLTP vs OLAP, star schemas",
    level: "hard",
    minutes: 9,
    why: "Data engineers spend most of their SQL time in warehouses (Snowflake, BigQuery, Synapse, Redshift). Dimensional modelling vocabulary — facts, dimensions, SCDs — is mandatory interview material.",
    analogy: "OLTP is the shop till: thousands of tiny, fast transactions. OLAP is the accountant's office: few people asking huge \"sum everything for the year\" questions. You don't run the accountant's ledger on the till.",
    body: `<h3>OLTP vs OLAP</h3><p><b>OLTP</b>: normalised, write-optimised, row-stored, current data. <b>OLAP</b>: denormalised, read-optimised, usually column-stored, historical data.</p><h3>Star schema</h3><p>A central <b>fact table</b> (events/measurements: order lines, payments) surrounded by <b>dimension tables</b> (context: customer, product, date). A <b>snowflake schema</b> further normalises dimensions — fewer duplicates, more joins.</p><h3>Slowly Changing Dimensions</h3><ul><li><b>Type 1</b> — overwrite (no history).</li><li><b>Type 2</b> — add a new row with effective dates / current flag (full history; the most common).</li><li><b>Type 3</b> — keep previous value in an extra column.</li></ul>`,
    sql: `-- A classic warehouse query: revenue by product category by month
SELECT SUBSTR(o.order_date, 1, 7) AS month,
       p.category,
       SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN orders o   ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id
WHERE o.status <> 'cancelled'
GROUP BY SUBSTR(o.order_date, 1, 7), p.category
ORDER BY month, revenue DESC;`,
    mistakes: [
      "Joining fact tables to fact tables directly (grain mismatch) — go through conformed dimensions.",
      "Ignoring the fact table's grain: always know what one row represents.",
    ],
    takeaways: [
      "OLTP = transactions, OLAP = analytics.",
      "Star schema: facts (measures) + dimensions (context).",
      "SCD Type 2 keeps history with effective-date rows.",
    ],
  },
];
