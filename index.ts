export interface IPrepareMachineOptions<EventsName extends string, StatesName extends string> {
  id: StatesName;
  init: StatesName;
  states: Record<StatesName, IPreparedState<EventsName, StatesName>>;
}
//
export interface IPrepareTransitionOptions<EventsName extends string, StatesName extends string> {
  by: EventsName;
  to: StatesName;
}
//
export interface IPreparedTransition<EventsName extends string, StatesName extends string> {
  by: EventsName;
  to: StatesName;
}
//
export interface IPreparedState<EventsName extends string, StatesName extends string> {
  transitions: IPreparedTransition<EventsName, StatesName>[];
}
/////////////////////////
class Transition<EventsName extends string, StatesName extends string> {
  constructor(
    public by: EventsName,
    public to: StatesName,
    public from: StatesName,
  ) {}
}
//
class State<EventsName extends string, StatesName extends string> {
  transitions: Record<EventsName, Transition<EventsName, StatesName>>;
  constructor(public id: StatesName) {
    this.transitions = {} as Record<EventsName, Transition<EventsName, StatesName>>;
  }
  addTransition(by: EventsName, to: StatesName) {
    this.transitions = {
      ...this.transitions,
      [by]: new Transition(by, to, this.id),
    };
  }
  has(event: EventsName): boolean {
    return (Object.keys(this.transitions) as EventsName[]).includes(event);
  }
}
//
class Machine<
  EventsName extends string,
  StatesName extends string,
  Id extends string,
> extends State<EventsName, StatesName | Id> {
  init: StatesName;
  states: Record<StatesName, State<EventsName, StatesName>>;
  constructor(id: Id, init: StatesName) {
    super(id);
    this.init = init;
    this.states = {} as Record<StatesName, State<EventsName, StatesName>>;
  }

  addState(state: State<EventsName, StatesName>) {
    this.states[state.id] = state;
  }
}
//
class Service<E extends string, S extends string, Id extends string> {
  currentId: S;
  constructor(private machine: Machine<E, S, Id>) {
    this.currentId = this.machine.init;
  }

  get current() {
    return this.machine.states[this.currentId];
  }

  send(event: E) {
    if (this.current.has(event)) {
      this.currentId = this.current.transitions[event].to;
    }
  }
}
/////////////////////////
function privatePrepareTransition<EventsName extends string, StatesName extends string>(
  opt: IPrepareTransitionOptions<EventsName, StatesName>,
): IPreparedTransition<EventsName, StatesName> {
  let transition = opt;
  return transition as IPreparedTransition<EventsName, StatesName>;
}

function privatePrepareState<EventsName extends string, StatesName extends string>(
  ...transitionsUnprepared: IPreparedTransition<EventsName, StatesName>[]
): IPreparedState<EventsName, StatesName> {
  let transitions: IPreparedTransition<EventsName, StatesName>[] = [];
  for (let transition of transitionsUnprepared) {
    transitions.push(transition);
  }
  return { transitions } as IPreparedState<EventsName, StatesName>;
}

function privatePrepareMachine<EventsName extends string, StatesName extends string>(
  opt: IPrepareMachineOptions<EventsName, StatesName | (string & {})>,
) {
  type StatesNameID = StatesName | typeof opt.id;
  const machine = new Machine<EventsName, StatesNameID, typeof opt.id>(opt.id, opt.init);
  for (const [id, s] of Object.entries<IPreparedState<EventsName, StatesNameID>>(opt.states)) {
    let state = new State<EventsName, StatesNameID>(id as StatesName);
    s.transitions.forEach((t) => {
      state.addTransition(t.by, t.to);
    });
    machine.addState(state);
  }
  return machine;
}

export function fsm<StatesName extends string, EventsName extends string>() {
  const transition = privatePrepareTransition<EventsName, StatesName>;
  const state = privatePrepareState<EventsName, StatesName>;
  const createMachine = privatePrepareMachine<EventsName, StatesName>;
  const interpret = (machine: ReturnType<typeof createMachine>) => new Service(machine);
  return {
    transition,
    state,
    createMachine,
    interpret,
  };
}
