package data;

enum Maybe<T> {
	Just (v:T);
	Nothing;
}

class MaybeM
{
	inline static public function fmap<T,U> (f : T -> U, m : Maybe<T>) : Maybe<U>
	{
		return switch(m) {
		case Just(v): Just(f(v));
		case Nothing: Nothing;
		}
	}
	inline static public function ap<T,U> (f : Maybe<T->U>, m : Maybe<T>) : Maybe<U>
	{
		return switch(f) {
		case Just(g): MaybeM.fmap(g, m);
		case Nothing: Nothing;
		}
	}
	inline static public function bind<T,U> (m : Maybe<T>, f : T -> Maybe<U>) : Maybe<U>
	{
		return switch (m) {
		case Just(v): f(v);
		case Nothing: Nothing;
		}
	}
}

class MaybeMixin
{
	inline public static function fmap<T, U>(m: Maybe<T>, f: T -> U) : Maybe<U>
	{
		return MaybeM.fmap(f, m);
	}

	inline public function bind<T,U> (m : Maybe<T>, f : T -> Maybe<U>) : Maybe<U>
	{
		return MaybeM.bind(m, f);
	}
}
