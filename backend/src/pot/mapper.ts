import { Pot } from "./index";

export const mapToPotEntity = (p: Pot) => ({
  amount: p.amount,
  created_at: p.created_at,
  deleted_at: p.deleted_at,
  id: p.id,
  name: p.name,
  target: p.target,
  theme: p.theme,
  total_saved: p.total_saved,
  updated_at: p.updated_at
});

export default mapToPotEntity;
