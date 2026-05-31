export interface ICounter {
  couriers: number;
  orders: number;
  declarations: number;
  unknownDeclarations: number;
  supports: number;
  handoverQueue: {
    pending: number;
    executing: number;
    executed: number;
  };
  byBranch: {
    [id: string]: {
      inspection: number;
    };
  };
}

export interface ICounterPersistence {
  courier: number;
  order: number;
  conflicted_declaration: number;
  declaration: number;
  ticket: number;
  waiting_tasks: number;
  executing_tasks: number;
  executed_tasks: number;
  by_branch?: {
    [id: string]: {
      inspection: number;
    };
  };
}
