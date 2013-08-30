package control.monad;

using control.monad.State;

enum State<S, A>
{
	RunState(f: S -> { state: S, value: A });
}

class StateM
{
	inline static public function state<S, A>(f: S -> { state: S, value: A }): State<S, A>
	{
		return RunState(f);
	}

	inline static public function Fmap<S, A, B>(f: A -> B, m: State<S, A>): State<S, B>
	{
		return StateM.state(function(s) {
			var tpl = m.runState(s);
			return { state: tpl.state, value: f(tpl.value) }
		});
	}

	inline static public function Ap<S, A, B>(ff: State<S, A -> B>, m: State<S, A>): State<S, B>
	{
		return StateM.state(function(s) {
			var f = ff.runState(s);
			var v = m.fmap(f.value);
			return v.runState(f.state);
		});
	}

	inline static public function Bind<S, A, B>(m: State<S, A>, f: A -> State<S, B>): State<S, B>
	{
		return StateM.state(function(s) {
			var tpl = m.runState(s);
			var st: State<S, B> = f(tpl.value);
			return st.runState(tpl.state);
		});
	}

	inline static public function Pure<S, A>(a: A): State<S, A>
	{
		return StateM.state(function(s: S) {
			return { state: s, value: a };
		});
	}
}

class StateMixin
{
	static public function fmap<S, A, B> (m: State<S, A>, f: A -> B): State<S, B>
	{
		return StateM.Fmap(f, m);
	}

	static public function ap<S, A, B> (ff: State<S, A -> B>, m: State<S, A>): State<S, B>
	{
		return StateM.Ap(ff, m);
	}

	static public function bind<S, A, B> (m: State<S, A>, f: A -> State<S, B>): State<S, B>
	{
		return StateM.Bind(m, f);
	}

	static public function runState<S, A, B> (m: State<S, A>, s: S): { state: S, value: A }
	{
		return switch(m) {
		case RunState(f): f(s);
		}
	}
}
