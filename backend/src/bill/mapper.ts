import { Bill } from "./index";

export const mapToBillEntity = (b: Bill): Bill => ({
  amount: b.amount,
  created_at: b.created_at,
  deleted_at: b.deleted_at,
  frequency: b.frequency,
  id: b.id,
  name: b.name,
  next_run: b.next_run,
  updated_at: b.updated_at
});

export default mapToBillEntity;
