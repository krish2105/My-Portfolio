/**
 * A tiny, honestly-scoped rule-based NL→SQL matcher — pattern matching
 * against a fixed toy schema, not a transformer model. It only recognises a
 * handful of patterns; anything else returns `null` so the UI can say so
 * honestly instead of guessing.
 */
export interface NL2SQLRule {
  patterns: string[];
  sql: string;
  explanation: string;
}

export const TOY_SCHEMA = [
  { table: "customers", columns: ["id", "name", "region", "signup_date"] },
  { table: "orders", columns: ["id", "customer_id", "amount", "order_date"] },
];

const RULES: NL2SQLRule[] = [
  {
    patterns: ["how many customers", "customer count", "number of customers"],
    sql: "SELECT COUNT(*) FROM customers;",
    explanation: "Matched a \"count\" question against the customers table.",
  },
  {
    patterns: ["top customers", "highest revenue", "biggest customers"],
    sql: "SELECT c.name, SUM(o.amount) AS revenue\nFROM customers c JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name\nORDER BY revenue DESC\nLIMIT 5;",
    explanation: "Matched a \"top by revenue\" question — joins orders to customers, aggregates and ranks.",
  },
  {
    patterns: ["average order", "avg order value", "mean order"],
    sql: "SELECT AVG(amount) FROM orders;",
    explanation: "Matched an \"average order value\" question against the orders table.",
  },
  {
    patterns: ["orders this month", "recent orders", "orders last month"],
    sql: "SELECT * FROM orders\nWHERE order_date >= date_trunc('month', CURRENT_DATE)\nORDER BY order_date DESC;",
    explanation: "Matched a recency question — filters orders to the current month.",
  },
];

const normalize = (s: string) => s.toLowerCase().trim();

/** Returns the first rule whose pattern appears in the question, or null if nothing matches. */
export const matchNL2SQL = (question: string): NL2SQLRule | null => {
  const q = normalize(question);
  if (!q) return null;
  for (const rule of RULES) {
    if (rule.patterns.some((p) => q.includes(p))) return rule;
  }
  return null;
};

export const NL2SQL_EXAMPLES = ["How many customers do we have?", "Who are our top customers?", "What's the average order value?"];
