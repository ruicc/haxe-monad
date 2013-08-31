package;

import data.Either;
import data.Monoid;
using data.Int;

using data.List;
using data.Maybe;
using control.monad.State;
using control.monad.RWSE;

class Test
{
	static function main()
	{
		var v = Just(3).fmap(function(a) { return a + 3; });
		trace("maybe:" + v);

		var w = Just(3).bind(function(a: Int) {
		return Just(5).bind(function(b: Int) {
		return Just(a + b);
		});
		});
		trace("maybe:" + w);
		
		var x = Cons(3, Cons(2, Nil)).bind(function(a: Int) {
		return Cons(4, Cons(5, Nil)).bind(function(b: Int) {
		return Cons(a + b, Nil);
		});
		});
		trace("list:" + x);
		
		
		var y = StateM.Pure(3).bind(function(a) {
			return StateM.Pure(5).bind(function(b) {
			return StateM.Pure(a + b);
		});
		});
		trace("state:" + y.runState("init-state"));

		var z = StateM.Pure(3).fmap(function(a: Int) { return (a *2).toString(); });
		trace("state:" + z.runState("init-state"));
		
		var a = new A(3);
		var b = new A(4);
		trace("monoid:" + a.mappend(b));
		
		var rwse = new RWSEM(new A(0)); // set mempty.
		var c = rwse.pure(1).bind(function(a) {
		return rwse.pure(2).bind(function(b) {
		return rwse.pure(3).bind(function(c) {
		return rwse.pure(a + b + c);
		});
		});
		});
		trace("RWSE:" + c.runRWSE("reader", "state"));
	}
}
