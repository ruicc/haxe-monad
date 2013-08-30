package data;

interface Monoid<A>
{
	public var v: A;
	public function mappend(w: Monoid<A>): Monoid<A>;
}


class A implements Monoid<Int>
{
	public var v: Int;

	public function new(i: Int)
	{
		this.v = i;
	}

	public function mappend(w: Monoid<Int>): Monoid<Int>
	{
		return new A(this.v + w.v);
	}
}
