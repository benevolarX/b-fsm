class m {
  by;
  to;
  from;
  constructor(e, t, s) {
    this.by = e;
    this.to = t;
    this.from = s;
  }
}
class n {
  id;
  transitions;
  constructor(e) {
    this.id = e;
    this.transitions = {};
  }
  addTransition(e, t) {
    this.transitions = { ...this.transitions, [e]: new m(e, t, this.id) };
  }
  has(e) {
    return Object.keys(this.transitions).includes(e);
  }
}
class N extends n {
  init;
  states;
  constructor(e, t) {
    super(e);
    ((this.init = t), (this.states = {}));
  }
  addState(e) {
    this.states[e.id] = e;
  }
}
class o {
  machine;
  currentId;
  constructor(e) {
    this.machine = e;
    this.currentId = this.machine.init;
  }
  get current() {
    return this.machine.states[this.currentId];
  }
  send(e) {
    if (this.current.has(e)) this.currentId = this.current.transitions[e].to;
  }
}
function d(e) {
  return e;
}
function S(...e) {
  let t = [];
  for (let s of e) t.push(s);
  return { transitions: t };
}
function c(e) {
  let t = new N(e.id, e.init);
  for (let [s, r] of Object.entries(e.states)) {
    let a = new n(s);
    (r.transitions.forEach((i) => {
      a.addTransition(i.by, i.to);
    }),
      t.addState(a));
  }
  return t;
}
function E() {
  return { transition: d, state: S, createMachine: c, interpret: (a) => new o(a) };
}
export { E as fsm };
