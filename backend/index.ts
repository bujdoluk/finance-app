import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import os from "os";

const app = express();
const router: Router = Router();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const port = Number(process.env.APP_PORT ?? process.env.PORT ?? "9001");

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  deleted_at: boolean;
}

let users: User[] = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    password: "password123",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    password: "secret",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false
  }
];

router.get("/users", async (req: Request, res: Response) => {
  res.json(users.filter(u => !u.deleted_at));
});

router.get("/users/:id", (req: Request, res: Response) => {
  const user = users.find(u => u.id === Number(req.params.id) && !u.deleted_at);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.post("/users", (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const newUser: User = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    first_name,
    last_name,
    email,
    password,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false
  };

  users.push(newUser);
  res.status(201).json({ message: "User created", user: newUser });
});

router.patch("/users/:id", (req: Request, res: Response) => {
  const user = users.find(u => u.id === Number(req.params.id) && !u.deleted_at);
  if (!user) return res.status(404).json({ message: "User not found" });

  const body: UserUpdate = req.body;

  if (body.first_name !== undefined) user.first_name = body.first_name;
  if (body.last_name !== undefined) user.last_name = body.last_name;
  if (body.email !== undefined) user.email = body.email;
  if (body.password !== undefined) user.password = body.password;

  user.updated_at = new Date().toISOString();

  res.json({ message: "User updated", user });
});

router.delete("/users/:id", (req: Request, res: Response) => {
  const user = users.find(u => u.id === Number(req.params.id) && !u.deleted_at);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.deleted_at = true;
  user.updated_at = new Date().toISOString();
  res.json({ message: "User soft deleted", user });
});


router.get("/users", (req: Request, res: Response) => res.json(users.filter(u => !u.deleted_at)));

router.get("/users/:id", (req: Request, res: Response) => {
  const user = users.find(u => u.id === Number(req.params.id) && !u.deleted_at);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.post("/users", (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const newUser: User = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    first_name,
    last_name,
    email,
    password,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false
  };

  users.push(newUser);
  res.status(201).json({ message: "User created", user: newUser });
});

interface UserUpdate extends Partial<Pick<User, "first_name" | "last_name" | "email" | "password">> {}

router.patch("/users/:id", (req: Request, res: Response) => {
  const user = users.find(u => u.id === Number(req.params.id) && !u.deleted_at);
  if (!user) return res.status(404).json({ message: "User not found" });

  const body: UserUpdate = req.body;

  if (body.first_name !== undefined) user.first_name = body.first_name;
  if (body.last_name !== undefined) user.last_name = body.last_name;
  if (body.email !== undefined) user.email = body.email;
  if (body.password !== undefined) user.password = body.password;

  user.updated_at = new Date().toISOString();

  res.json({ message: "User updated", user });
});

router.delete("/users/:id", (req: Request, res: Response) => {
  const user = users.find(u => u.id === Number(req.params.id) && !u.deleted_at);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.deleted_at = true;
  user.updated_at = new Date().toISOString();
  res.json({ message: "User soft deleted", user });
});

interface Transaction {
  id: number;
  date: string;
  category: string;
  amount: number;
  sender: string;
  sender_picture: string;
  created_at: string;
  updated_at: string;
  deleted_at: boolean;
}

const transactions: Array<Transaction> = [
  {
    id: 1,
    date: '2025-01-01',
    category: 'Food',
    amount: 25.50,
    sender: 'Alice',
    sender_picture: "some url where picture is stored",
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
    deleted_at: false
  },
  {
    id: 2,
    date: '2025-01-02',
    category: 'Transport',
    amount: 15.75,
    sender: 'Bob',
    sender_picture: "some url where picture is stored",
    created_at: '2025-01-02T12:30:00Z',
    updated_at: '2025-01-02T12:30:00Z',
    deleted_at: false
  }
];

router.get("/transactions", (req: Request, res: Response) => res.json(transactions.filter(t => !t.deleted_at)));

router.get("/transactions/:id", (req: Request, res: Response) => {
  const transaction = transactions.find(t => t.id === Number(req.params.id) && !t.deleted_at);
  if (!transaction) return res.status(404).json({ message: "Transaction not found" });
  res.json(transaction);
});

router.post("/transactions", (req: Request, res: Response) => {
  const { date, category, amount, sender, sender_picture } = req.body;
  if (!date || !category || amount === undefined || !sender || !sender_picture)
    return res.status(400).json({ message: "All fields are required" });

  const newTransaction: Transaction = {
    id: transactions.length ? transactions[transactions.length - 1].id + 1 : 1,
    date,
    category,
    amount,
    sender,
    sender_picture,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false
  };

  transactions.push(newTransaction);
  res.status(201).json({ message: "Transaction created", transaction: newTransaction });
});

router.delete("/transactions/:id", (req: Request, res: Response) => {
  const transaction = transactions.find(t => t.id === Number(req.params.id) && !t.deleted_at);
  if (!transaction) return res.status(404).json({ message: "Pot not found" });

  transaction.deleted_at = true;
  transaction.updated_at = new Date().toISOString();
  res.json({ message: "Transaction soft deleted", transaction });
});

interface Pot {
  id: number;
  name: string;
  total_saved: number;
  target: number;
  theme: string;
  amount: number;
  created_at: string;
  updated_at: string;
  deleted_at: boolean;
}

let pots: Pot[] = [
  {
    id: 1,
    name: "Car",
    total_saved: 100,
    target: 500,
    theme: "green",
    amount: 500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false,
  },
];

router.get("/pots", (req: Request, res: Response) => res.json(pots.filter(p => !p.deleted_at)));

router.get("/pots/:id", (req: Request, res: Response) => {
  const pot = pots.find(p => p.id === Number(req.params.id) && !p.deleted_at);
  if (!pot) return res.status(404).json({ message: "Pot not found" });
  res.json(pot);
});

router.post("/pots", (req: Request, res: Response) => {
  const { total_saved, target, theme, name, amount } = req.body;
  if (total_saved === undefined || target === undefined || !theme || !name || !amount)
    return res.status(400).json({ message: "total_saved and target are required" });

  const newPot: Pot = {
    id: pots.length ? pots[pots.length - 1].id + 1 : 1,
    total_saved,
    target,
    theme,
    name,
    amount,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false
  };

  pots.push(newPot);
  res.status(201).json({ message: "Pot created", pot: newPot });
});

router.patch("/pots/:id", (req: Request, res: Response) => {
  const pot = pots.find(p => p.id === Number(req.params.id) && !p.deleted_at);
  if (!pot) return res.status(404).json({ message: "Pot not found" });

  const { total_saved, target } = req.body;
  if (total_saved !== undefined) pot.total_saved = total_saved;
  if (target !== undefined) pot.target = target;

  pot.updated_at = new Date().toISOString();
  res.json({ message: "Pot updated", pot });
});

router.delete("/pots/:id", (req: Request, res: Response) => {
  const pot = pots.find(p => p.id === Number(req.params.id) && !p.deleted_at);
  if (!pot) return res.status(404).json({ message: "Pot not found" });

  pot.deleted_at = true;
  pot.updated_at = new Date().toISOString();
  res.json({ message: "Pot soft deleted", pot });
});

router.post("/pots/:id/deposit", (req: Request, res: Response) => {
  const potId = Number(req.params.id);
  const pot = pots.find(p => p.id === potId && !p.deleted_at);
  if (!pot) return res.status(404).json({ message: 'Pot not found'});

  const { amount } = req.body;
  if (typeof amount !== 'number' || amount < 0) {
    return res.status(400).json({ message: 'Amount must be a positive number'});
  }

  pot.total_saved += amount;
  pot.updated_at = new Date().toISOString();

  res.json({ message: `Deposited $${amount} to pot`, pot });
});

router.post('/pots/:id/withdraw', (req: Request, res: Response) => {
  const potId = Number(req.params.id);
  const pot = pots.find(p => p.id === potId && !p.deleted_at);
  if (!pot) return res.status(404).json({ message: 'Pot not found' });

  const { amount } = req.body;
  if (typeof amount !== 'number' || amount <= 0)
    return res.status(400).json({ message: 'Amount must be a positive number' });

  if (amount > pot.total_saved)
    return res.status(400).json({ message: 'Insufficient funds in pot' });

  pot.total_saved -= amount;
  pot.updated_at = new Date().toISOString();

  res.json({ message: `Withdrew $${amount} from pot`, pot });
});

interface RecurringBill {
  id: number;
  name: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  next_run: string;
  created_at: string;
  updated_at: string;
  deleted_at: boolean;
}

let recurringBills: RecurringBill[] = [
  {
    id: 1,
    name: "Rent",
    amount: 1200,
    frequency: "monthly",
    next_run: "2025-02-01T00:00:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false
  }
];

router.get("/bills", (req: Request, res: Response) => {
  res.json(recurringBills.filter(b => !b.deleted_at));
});

router.get("/bills/:id", (req: Request, res: Response) => {
  const bill = recurringBills.find(b => b.id === Number(req.params.id) && !b.deleted_at);
  if (!bill) return res.status(404).json({ message: "Bill not found" });
  res.json(bill);
});

router.post("/bills", (req: Request, res: Response) => {
  const { name, amount, frequency, next_run } = req.body;

  if (!name || !amount || !frequency || !next_run)
    return res.status(400).json({ message: "All fields are required" });

  const newBill: RecurringBill = {
    id: recurringBills.length ? recurringBills[recurringBills.length - 1].id + 1 : 1,
    name,
    amount,
    frequency,
    next_run,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false
  };

  recurringBills.push(newBill);
  res.json({ message: "Bill created", bill: newBill });
});

interface BillUpdate extends Partial<Pick<RecurringBill, "name" | "amount" | "frequency" | "next_run">> {}

router.patch("/bills/:id", (req: Request, res: Response) => {
  const bill = recurringBills.find(b => b.id === Number(req.params.id) && !b.deleted_at);
  if (!bill) return res.status(404).json({ message: "Bill not found" });

  const body: BillUpdate = req.body;

  if (body.name !== undefined) bill.name = body.name;
  if (body.amount !== undefined) bill.amount = body.amount;
  if (body.frequency !== undefined) bill.frequency = body.frequency;
  if (body.next_run !== undefined) bill.next_run = body.next_run;

  bill.updated_at = new Date().toISOString();

  res.json({ message: "Bill updated", bill });
});

router.delete("/bills/:id", (req: Request, res: Response) => {
  const bill = recurringBills.find(b => b.id === Number(req.params.id) && !b.deleted_at);
  if (!bill) return res.status(404).json({ message: "Bill not found" });

  bill.deleted_at = true;
  bill.updated_at = new Date().toISOString();

  res.json({ message: "Bill deleted", bill });
});

type Budget = {
  id: number;
  name: string;
  maximumSpending: number;
  theme: string;
  amount: number;
  created_at: string;
  updated_at: string;
  deleted_at: boolean;
}

let budgets: Budget[] = [
  {
    id: 1,
    name: "Groceries",
    maximumSpending: 500,
    theme: "green",
    amount: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false
  }
];

router.get("/budgets", (req: Request, res: Response) => {
  res.json(budgets.filter(b => !b.deleted_at));
});

router.get("/budgets/:id", (req: Request, res: Response) => {
  const budget = budgets.find(b => b.id === Number(req.params.id) && !b.deleted_at);
  if (!budget) return res.status(404).json({ message: "Budget not found" });
  res.json(budget);
});

router.post("/budgets", (req: Request, res: Response) => {
  const { name, maximumSpending, theme, amount } = req.body;

  if (!name || maximumSpending === undefined || !theme || !amount)
    return res.status(400).json({ message: "name, maximumSpending, and theme are required" });

  const newBudget: Budget = {
    id: budgets.length ? budgets[budgets.length - 1].id + 1 : 1,
    name,
    maximumSpending,
    theme,
    amount,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: false
  };

  budgets.push(newBudget);
  res.status(201).json({ message: "Budget created", budget: newBudget });
});

router.patch("/budgets/:id", (req: Request, res: Response) => {
  const budget = budgets.find(b => b.id === Number(req.params.id) && !b.deleted_at);

  if (!budget) return res.status(404).json({ message: "Budget not found" });

  const { name, maximumSpending, theme } = req.body;

  if (name !== undefined) budget.name = name;
  if (maximumSpending !== undefined) budget.maximumSpending = maximumSpending;
  if (theme !== undefined) budget.theme = theme;

  budget.updated_at = new Date().toISOString();

  res.json({ message: "Budget updated", budget });
});

router.delete("/budgets/:id", (req: Request, res: Response) => {
  const budget = budgets.find(b => b.id === Number(req.params.id) && !b.deleted_at);
  if (!budget) return res.status(404).json({ message: "Budget not found" });

  budget.deleted_at = true;
  budget.updated_at = new Date().toISOString();

  res.json({ message: "Budget soft deleted", budget });
});

router.post("/budgets/:id/deposit", (req: Request, res: Response) => {
  const budget = budgets.find(b => b.id === Number(req.params.id) && !b.deleted_at);

  if (!budget) return res.status(404).json({ message: "Budget not found" });

  const { amount } = req.body;

  if (typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ message: "Amount must be a positive number" });

  budget.maximumSpending += amount;
  budget.updated_at = new Date().toISOString();

  res.json({ message: `Deposited $${amount} to budget`, budget });
});

router.post("/budgets/:id/withdraw", (req: Request, res: Response) => {
  const budget = budgets.find(b => b.id === Number(req.params.id) && !b.deleted_at);

  if (!budget) return res.status(404).json({ message: "Budget not found" });

  const { amount } = req.body;

  if (typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ message: "Amount must be a positive number" });

  if (amount > budget.maximumSpending)
    return res.status(400).json({ message: "Insufficient funds in budget" });

  budget.maximumSpending -= amount;
  budget.updated_at = new Date().toISOString();

  res.json({ message: `Withdrew $${amount} from budget`, budget });
});

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});


router.get("/perf", async (req: Request, res: Response) => {
  const start = process.hrtime.bigint(); 

  const memory = process.memoryUsage();

  const perf = {
    timestamp: new Date().toISOString(),

    app: {
      name: "finance-api",
      environment: process.env.NODE_ENV ?? "development",
      node_version: process.version,
      uptime_seconds: process.uptime()
    },

    performance: {
      event_loop_delay_ms:
        Number(process.hrtime.bigint() - start) / 1_000_000,

      cpu_usage: process.cpuUsage(),

      memory: {
        rss_mb: (memory.rss / 1024 / 1024).toFixed(2),
        heap_used_mb: (memory.heapUsed / 1024 / 1024).toFixed(2),
        heap_total_mb: (memory.heapTotal / 1024 / 1024).toFixed(2),
        external_mb: (memory.external / 1024 / 1024).toFixed(2)
      }
    },

    system: {
      platform: process.platform,
      architecture: process.arch,
      loadavg: os.loadavg(), 
      cores: os.cpus().length
    }
  };

  res.json(perf);
});
