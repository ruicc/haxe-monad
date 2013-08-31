package control.monad;

import data.Either;
import data.Monoid;
using control.monad.RWSE;

/**
 * RWSE Monad.
 */
enum RWSE<R, W, S, E, A>
{
	RunRWSE(v: R -> S -> Monoid<W> -> Either<E, { value: A, state: S, write: Monoid<W> }>);
}

class RWSEM
{
	inline static public function rwse<R, W, S, E, A>
		(run: R -> S -> Monoid<W> -> Either<E, { value: A, state: S, write: Monoid<W> }>): RWSE<R, W, S, E, A>
	{
		return RunRWSE(run);
	}

	inline static public function Pure<R, W, S, E, A>
		(a: A): RWSE<R, W, S, E, A>
	{
		return RWSEM.rwse(function(r, s, w0) {
			return Right({
				value: a,
				state: s,
				write: w0,
			});
		});
	}

	inline static public function Fmap<R, W, S, E, A, B>
		(f: A -> B, m: RWSE<R, W, S, E, A>): RWSE<R, W, S, E, B>
	{
		return RWSEM.rwse(function(r, s, w0) {
			var v = m.runRWSE(r, s, w0);
			return switch(v) {
			case Left(e):
				Left(e);
			case Right(r):
				Right({
					value: f(r.value),
					state: r.state,
					write: r.write
				});
			}
		});
	}

	inline static public function Ap<R, W, S, E, A, B>
		(k: RWSE<R, W, S, E, A -> B>, m: RWSE<R, W, S, E, A>): RWSE<R, W, S, E, B>
	{
		return RWSEM.rwse(function(r, s, w0) {
			var v = k.runRWSE(r, s, w0);
			return switch(v) {
			case Left(e): Left(e);
			case Right(t):
				var w = m.fmap(t.value).runRWSE(r, t.state, w0);
				switch(w) {
				case Left(e_):
					Left(e_);
				case Right(u):
					Right({
						value: u.value,
						state: u.state,
						write: t.write.mappend(u.write)
					});
				}
			}
		});
	}

	inline static public function Bind<R, W, S, E, A, B>
		(m: RWSE<R, W, S, E, A>, f: A -> RWSE<R, W, S, E, B>): RWSE<R, W, S, E, B>
	{
		return RWSEM.rwse(function(r, s, w0) {
			var v = m.runRWSE(r, s, w0);
			return switch(v) {
			case Left(e): Left(e);
			case Right(t):
				var w = f(t.value).runRWSE(r, t.state, w0);
				switch(w) {
				case Left(e_): Left(e_);
				case Right(u):
					Right({
						value: u.value,
						state: u.state,
						write: t.write.mappend(u.write)
					});
				}
			}
		});
	}
	
// ----------------------------------------------------------------------------------------------------
// Reader operations

	inline static public function Ask<R, W, S, E> (): RWSE<R, W, S, E, R>
	{
		return RunRWSE(function(r, s, w0) {
			return Right({
				value: r,
				state: s,
				write: w0,
			});
		});
	}

// ----------------------------------------------------------------------------------------------------
// State operations

	inline static public function Get<R, W, S, E> (): RWSE<R, W, S, E, S>
	{
		return RunRWSE(function(r, s, w0) {
			return Right({
				value: s,
				state: s,
				write: w0,
			});
		});
	}

	inline static public function Put<R, W, S, E> (newState: S): RWSE<R, W, S, E, {}>
	{
		return RunRWSE(function(r, s, w0) {
			return Right({
				value: {},
				state: newState,
				write: w0,
			});
		});
	}

// ----------------------------------------------------------------------------------------------------
// Writer operations

	inline static public function Tell<R, W, S, E> (w: Monoid<W>): RWSE<R, W, S, E, {}>
	{
		return RunRWSE(function(r, s, w0) {
			return Right({
				value: {},
				state: s,
				write: w,
			});
		});
	}

// ----------------------------------------------------------------------------------------------------
// Error operations

	inline static public function ThrowError<R, W, S, E, A> (err: E): RWSE<R, W, S, E, A>
	{
		return RunRWSE(function(r, s, w0) {
			return Left(err);
		});
	}

	inline static public function CatchError<R, W, S, E, A>
		(m: RWSE<R, W, S, E, A>, handler: E -> RWSE<R, W, S, E, A>): RWSE<R, W, S, E, A>
	{
		return RunRWSE(function(r, s, w0) {
			var v = m.runRWSE(r, s, w0);
			return switch(v) {
			case Left(e):
				var w = handler(e).runRWSE(r, s, w0);
				switch(w) {
				case Left(e_):
					Left(e_);
				case Right(x):
					Right({
						value: x.value,
						state: x.state,
						write: x.write,
					});
				}
			case Right(l):
				Right(l);
			}
		});
	}
}

class RWSEMixin
{
	inline static public function runRWSE<R, W, S, E, A>
		(m: RWSE<R, W, S, E, A>, initR: R, initS: S, w0: Monoid<W>): Either<E, { value: A, state: S, write: Monoid<W> }>
	{
		return switch(m) {
		case RunRWSE(run): run(initR, initS, w0);
		}
	}

	inline static public function fmap<R, W, S, E, A, B>
		(m: RWSE<R, W, S, E, A>, f: A -> B): RWSE<R, W, S, E, B>
	{
		return RWSEM.Fmap(f, m);
	}

	inline static public function ap<R, W, S, E, A, B>
		(ff: RWSE<R, W, S, E, A -> B>, m: RWSE<R, W, S, E, A>): RWSE<R, W, S, E, B>
	{
		return RWSEM.Ap(ff, m);
	}

	inline static public function bind<R, W, S, E, A, B>
		(m: RWSE<R, W, S, E, A>, f: A -> RWSE<R, W, S, E, B>): RWSE<R, W, S, E, B>
	{
		return RWSEM.Bind(m, f);
	}
}
