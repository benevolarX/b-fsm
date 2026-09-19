export interface IPrepareMachineOptions<EventsName extends string, StatesName extends string> {
  id: StatesName;
  init: StatesName;
  states: Record<StatesName, IPreparedState<EventsName, StatesName>>;
}
export interface IPrepareTransitionOptions<EventsName extends string, StatesName extends string> {
  by: EventsName;
  to: StatesName;
}
export interface IPreparedTransition<EventsName extends string, StatesName extends string> {
  by: EventsName;
  to: StatesName;
}
export interface IPreparedState<EventsName extends string, StatesName extends string> {
  transitions: IPreparedTransition<EventsName, StatesName>[];
}
declare class Transition<EventsName extends string, StatesName extends string> {
  by: EventsName;
  to: StatesName;
  from: StatesName;
  constructor(by: EventsName, to: StatesName, from: StatesName);
}
declare class State<EventsName extends string, StatesName extends string> {
  id: StatesName;
  transitions: Record<EventsName, Transition<EventsName, StatesName>>;
  constructor(id: StatesName);
  addTransition(by: EventsName, to: StatesName): void;
  has(event: EventsName): boolean;
}
declare class Machine<
  EventsName extends string,
  StatesName extends string,
  Id extends string,
> extends State<EventsName, StatesName | Id> {
  init: StatesName;
  states: Record<StatesName, State<EventsName, StatesName>>;
  constructor(id: Id, init: StatesName);
  addState(state: State<EventsName, StatesName>): void;
}
declare class Service<E extends string, S extends string, Id extends string> {
  private machine;
  currentId: S;
  constructor(machine: Machine<E, S, Id>);
  get current(): Record<S, State<E, S>>[S];
  send(event: E): void;
}
export declare function fsm<StatesName extends string, EventsName extends string>(): {
  transition: (
    opt: IPrepareTransitionOptions<EventsName, StatesName>,
  ) => IPreparedTransition<EventsName, StatesName>;
  state: (
    ...transitionsUnprepared: IPreparedTransition<EventsName, StatesName>[]
  ) => IPreparedState<EventsName, StatesName>;
  createMachine: (
    opt: IPrepareMachineOptions<EventsName, StatesName | (string & {})>,
  ) => Machine<EventsName, StatesName | (string & {}), StatesName | (string & {})>;
  interpret: (
    machine: ReturnType<
      (
        opt: IPrepareMachineOptions<EventsName, StatesName | (string & {})>,
      ) => Machine<EventsName, StatesName | (string & {}), StatesName | (string & {})>
    >,
  ) => Service<EventsName, StatesName | (string & {}), StatesName | (string & {})>;
};
export {};
//# sourceMappingURL=index.d.ts.map
