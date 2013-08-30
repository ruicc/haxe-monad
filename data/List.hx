package data;

enum List<T> {
	Nil;
	Cons(x :T, xs :List<T>);
}
class ListM
{
	static public function fmap<T,U> (f : T -> U, m : List<T>) : List<U> {
		return switch(m) {
		case Nil: Nil;
		case Cons(x,xs): Cons(f(x), ListM.fmap(f, xs));
		}
	}
	static public function ap<T,U> (fs:List<T->U>, xs: List<T>) : List<U> {
		return switch(fs) {
		case Cons(f,rest): ListM.append(ListM.fmap(f,xs), ListM.ap(rest, xs));
		case Nil: Nil;
		}
	}
	static public function bind<T,U> (m : List<T>, f : T -> List<U>) : List<U> {
		return switch(m) {
		case Cons(x,xs): ListM.append(f(x), ListM.bind(xs, f));
		case Nil: Nil;
		}
	}

	static function concat<U> (xs:List<List<U>>) : List<U> {
		return switch(xs) {
		case Cons(ls,lss): ListM.append(ls, ListM.concat(lss));
		case Nil: Nil;
		}
	}
	static function append<U> (as:List<U>, bs:List<U>) : List<U> {
		return switch(as) {
		case Cons(a,as): Cons(a, ListM.append(as, bs));
		case Nil: bs;
		}
	}
}

class ListMixin
{
	inline public static function fmap<T, U>(m: List<T>, f: T -> U) : List<U>
	{
		return ListM.fmap(f, m);
	}

	inline public function bind<T,U> (m : List<T>, f : T -> List<U>) : List<U>
	{
		return ListM.bind(m, f);
	}
}
