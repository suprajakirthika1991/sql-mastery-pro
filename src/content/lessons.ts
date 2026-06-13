// Port the full 15-lesson set from the prototype (sql-mastery-pro.html → LESSONS array).
// Two are included here so the seed runs out of the box.
export const LESSONS = [
  {
    slug: "intro",
    title: "Databases & SQL: the big picture",
    level: "easy",
    minutes: 6,
    why: "Almost every product sits on a database; SQL is the shared language of nearly all of them.",
    analogy: "A database is a giant filing cabinet: tables are drawers, rows are files, SQL is the precise note you hand the clerk.",
    body: "<p>A <b>database</b> is an organised collection of data… (port full HTML body from prototype)</p>",
    sql: "SELECT * FROM employees;",
    mistakes: ["Thinking SQL is case-sensitive", "Using SELECT * in production code"],
    takeaways: ["SQL is declarative", "Tables = rows + columns", "Five sub-languages: DQL/DML/DDL/DCL/TCL"],
  },
  {
    slug: "select-where",
    title: "SELECT & WHERE: asking questions",
    level: "easy",
    minutes: 8,
    why: "90% of working SQL starts with SELECT … WHERE.",
    analogy: "SELECT picks which fields you photocopy; WHERE picks which cards leave the drawer.",
    body: "<p>List columns after <code>SELECT</code>… (port full HTML body from prototype)</p>",
    sql: "SELECT name, role, salary AS annual_salary FROM employees WHERE salary > 120000;",
    mistakes: ["Double quotes around strings", "Filtering an alias in WHERE"],
    takeaways: ["SELECT picks columns; WHERE picks rows", "FROM → WHERE → SELECT → ORDER BY"],
  },
];
