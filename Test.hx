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
		
		var c = RWSEM.Pure(1).bind(function(a) {
		return RWSEM.Pure(2).bind(function(b) {
		return RWSEM.Get().bind(function(get) {
		return RWSEM.Pure(3).bind(function(c) {
		return RWSEM.Put(888).bind(function(_) {
		return RWSEM.Ask().bind(function(d) {
		return RWSEM.Tell(new A(1)).bind(function(_) {
		return RWSEM.Tell(new A(2)).bind(function(_) {
		return RWSEM.Tell(new A(3)).bind(function(_) {
		return RWSEM.Tell(new A(4)).bind(function(_) {
		return RWSEM.Tell(new A(5)).bind(function(_) {
		return RWSEM.Pure(a + b + c + d + get);
		}); }); }); }); }); }); }); }); }); }); });
		trace("RWSE:" + c.runRWSE(42, -32, new A(0)));
		
		var e = RWSEM.CatchError(
		
			// Compose throwable monad..
			RWSEM.Pure(1).bind(function(a) {
			return RWSEM.Pure(2).bind(function(b) {
			return RWSEM.ThrowError('Error').bind(function(_) { // throwed!!!
			return RWSEM.Get().bind(function(get) {
			return RWSEM.Pure(3).bind(function(c) {
			return RWSEM.Put(888).bind(function(_) {
			return RWSEM.Ask().bind(function(d) {
			return RWSEM.Tell(new A(1)).bind(function(_) {
			return RWSEM.Tell(new A(2)).bind(function(_) {
			return RWSEM.Tell(new A(3)).bind(function(_) {
			return RWSEM.Tell(new A(4)).bind(function(_) {
			return RWSEM.Tell(new A(5)).bind(function(_) {
			return RWSEM.Pure((a + b + c + d + get).toString());
			}); }); }); }); }); }); }); }); }); }); }); }),

			// Error handler
			function(err) {
				return RWSEM.Pure(err + ' catched!');
			}
		);

		trace("RWSE-throw-catch:" + e.runRWSE(42, -32, new A(0)));
	}
}
