(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
var Test = function() { }
Test.__name__ = true;
Test.main = function() {
	var v = (function($this) {
		var $r;
		var $e = (data.Maybe.Just(3));
		switch( $e[1] ) {
		case 0:
			var v1 = $e[2];
			$r = data.Maybe.Just(v1 + 3);
			break;
		case 1:
			$r = data.Maybe.Nothing;
			break;
		}
		return $r;
	}(this));
	console.log("maybe:" + Std.string(v));
	var w = (function($this) {
		var $r;
		var $e = (data.Maybe.Just(3));
		switch( $e[1] ) {
		case 0:
			var v1 = $e[2];
			$r = (function($this) {
				var $r;
				var $e = (data.Maybe.Just(5));
				switch( $e[1] ) {
				case 0:
					var v2 = $e[2];
					$r = data.Maybe.Just(v1 + v2);
					break;
				case 1:
					$r = data.Maybe.Nothing;
					break;
				}
				return $r;
			}($this));
			break;
		case 1:
			$r = data.Maybe.Nothing;
			break;
		}
		return $r;
	}(this));
	console.log("maybe:" + Std.string(w));
	var x = data.ListM.bind(data.List.Cons(3,data.List.Cons(2,data.List.Nil)),function(a) {
		return data.ListM.bind(data.List.Cons(4,data.List.Cons(5,data.List.Nil)),function(b) {
			return data.List.Cons(a + b,data.List.Nil);
		});
	});
	console.log("list:" + Std.string(x));
	var y = control.monad.StateMixin.bind(control.monad.StateM.Pure(3),function(a1) {
		return control.monad.StateMixin.bind(control.monad.StateM.Pure(5),function(b) {
			return control.monad.StateM.Pure(a1 + b);
		});
	});
	console.log("state:" + Std.string(control.monad.StateMixin.runState(y,"init-state")));
	var z = control.monad.StateMixin.fmap(control.monad.StateM.Pure(3),function(a) {
		return data.IntMixin.toString(a * 2);
	});
	console.log("state:" + Std.string(control.monad.StateMixin.runState(z,"init-state")));
	var a = new data.A(3);
	var b = new data.A(4);
	console.log("monoid:" + Std.string(a.mappend(b)));
	var c = control.monad.RWSEM.Bind(control.monad.RWSEM.Pure(1,new data.A(2)),function(a2) {
		return control.monad.RWSEM.Bind(control.monad.RWSEM.Pure(2,new data.A(3)),function(b1) {
			return control.monad.RWSEM.Bind(control.monad.RWSEM.Pure(3,new data.A(4)),function(c1) {
				return control.monad.RWSEM.Pure(a2 + b1 + c1,new data.A(5));
			});
		});
	});
	console.log("RWSE:" + Std.string((function($this) {
		var $r;
		var $e = (c);
		switch( $e[1] ) {
		case 0:
			var run = $e[2];
			$r = run("reader","state");
			break;
		}
		return $r;
	}(this))));
}
var control = {}
control.monad = {}
control.monad.RWSE = { __ename__ : true, __constructs__ : ["RunRWSE"] }
control.monad.RWSE.RunRWSE = function(v) { var $x = ["RunRWSE",0,v]; $x.__enum__ = control.monad.RWSE; $x.toString = $estr; return $x; }
control.monad.RWSEM = function() { }
control.monad.RWSEM.__name__ = true;
control.monad.RWSEM.rwse = function(run) {
	return control.monad.RWSE.RunRWSE(run);
}
control.monad.RWSEM.Pure = function(a,w) {
	return control.monad.RWSE.RunRWSE(function(r,s) {
		return data.Either.Right({ value : a, state : s, write : w});
	});
}
control.monad.RWSEM.Fmap = function(f,m) {
	return control.monad.RWSE.RunRWSE(function(r,s) {
		var v = (function($this) {
			var $r;
			var $e = (m);
			switch( $e[1] ) {
			case 0:
				var run = $e[2];
				$r = run(r,s);
				break;
			}
			return $r;
		}(this));
		return (function($this) {
			var $r;
			var $e = (v);
			switch( $e[1] ) {
			case 0:
				var e = $e[2];
				$r = data.Either.Left(e);
				break;
			case 1:
				var r1 = $e[2];
				$r = data.Either.Right({ value : f(r1.value), state : r1.state, write : r1.write});
				break;
			}
			return $r;
		}(this));
	});
}
control.monad.RWSEM.Ap = function(k,m) {
	return control.monad.RWSE.RunRWSE(function(r,s) {
		var v = (function($this) {
			var $r;
			var $e = (k);
			switch( $e[1] ) {
			case 0:
				var run = $e[2];
				$r = run(r,s);
				break;
			}
			return $r;
		}(this));
		return (function($this) {
			var $r;
			var $e = (v);
			switch( $e[1] ) {
			case 0:
				var e = $e[2];
				$r = data.Either.Left(e);
				break;
			case 1:
				var t = $e[2];
				$r = (function($this) {
					var $r;
					var w = (function($this) {
						var $r;
						var $e = (control.monad.RWSEM.Fmap(t.value,m));
						switch( $e[1] ) {
						case 0:
							var run = $e[2];
							$r = run(r,t.state);
							break;
						}
						return $r;
					}($this));
					$r = (function($this) {
						var $r;
						var $e = (w);
						switch( $e[1] ) {
						case 0:
							var e_ = $e[2];
							$r = data.Either.Left(e_);
							break;
						case 1:
							var u = $e[2];
							$r = data.Either.Right({ value : u.value, state : u.state, write : t.write.mappend(u.write)});
							break;
						}
						return $r;
					}($this));
					return $r;
				}($this));
				break;
			}
			return $r;
		}(this));
	});
}
control.monad.RWSEM.Bind = function(m,f) {
	return control.monad.RWSE.RunRWSE(function(r,s) {
		var v = (function($this) {
			var $r;
			var $e = (m);
			switch( $e[1] ) {
			case 0:
				var run = $e[2];
				$r = run(r,s);
				break;
			}
			return $r;
		}(this));
		return (function($this) {
			var $r;
			var $e = (v);
			switch( $e[1] ) {
			case 0:
				var e = $e[2];
				$r = data.Either.Left(e);
				break;
			case 1:
				var t = $e[2];
				$r = (function($this) {
					var $r;
					var w = (function($this) {
						var $r;
						var $e = (f(t.value));
						switch( $e[1] ) {
						case 0:
							var run = $e[2];
							$r = run(r,t.state);
							break;
						}
						return $r;
					}($this));
					$r = (function($this) {
						var $r;
						var $e = (w);
						switch( $e[1] ) {
						case 0:
							var e_ = $e[2];
							$r = data.Either.Left(e_);
							break;
						case 1:
							var u = $e[2];
							$r = data.Either.Right({ value : u.value, state : u.state, write : t.write.mappend(u.write)});
							break;
						}
						return $r;
					}($this));
					return $r;
				}($this));
				break;
			}
			return $r;
		}(this));
	});
}
control.monad.RWSEMixin = function() { }
control.monad.RWSEMixin.__name__ = true;
control.monad.RWSEMixin.runRWSE = function(m,initR,initS) {
	return (function($this) {
		var $r;
		var $e = (m);
		switch( $e[1] ) {
		case 0:
			var run = $e[2];
			$r = run(initR,initS);
			break;
		}
		return $r;
	}(this));
}
control.monad.RWSEMixin.fmap = function(m,f) {
	return control.monad.RWSEM.Fmap(f,m);
}
control.monad.RWSEMixin.ap = function(ff,m) {
	return control.monad.RWSEM.Ap(ff,m);
}
control.monad.RWSEMixin.bind = function(m,f) {
	return control.monad.RWSEM.Bind(m,f);
}
control.monad.State = { __ename__ : true, __constructs__ : ["RunState"] }
control.monad.State.RunState = function(f) { var $x = ["RunState",0,f]; $x.__enum__ = control.monad.State; $x.toString = $estr; return $x; }
control.monad.StateM = function() { }
control.monad.StateM.__name__ = true;
control.monad.StateM.state = function(f) {
	return control.monad.State.RunState(f);
}
control.monad.StateM.Fmap = function(f,m) {
	return control.monad.State.RunState(function(s) {
		var tpl = control.monad.StateMixin.runState(m,s);
		return { state : tpl.state, value : f(tpl.value)};
	});
}
control.monad.StateM.Ap = function(ff,m) {
	return control.monad.State.RunState(function(s) {
		var f = control.monad.StateMixin.runState(ff,s);
		var v = control.monad.StateMixin.fmap(m,f.value);
		return control.monad.StateMixin.runState(v,f.state);
	});
}
control.monad.StateM.Bind = function(m,f) {
	return control.monad.State.RunState(function(s) {
		var tpl = control.monad.StateMixin.runState(m,s);
		var st = f(tpl.value);
		return control.monad.StateMixin.runState(st,tpl.state);
	});
}
control.monad.StateM.Pure = function(a) {
	return control.monad.State.RunState(function(s) {
		return { state : s, value : a};
	});
}
control.monad.StateMixin = function() { }
control.monad.StateMixin.__name__ = true;
control.monad.StateMixin.fmap = function(m,f) {
	return control.monad.StateM.Fmap(f,m);
}
control.monad.StateMixin.ap = function(ff,m) {
	return control.monad.StateM.Ap(ff,m);
}
control.monad.StateMixin.bind = function(m,f) {
	return control.monad.StateM.Bind(m,f);
}
control.monad.StateMixin.runState = function(m,s) {
	return (function($this) {
		var $r;
		var $e = (m);
		switch( $e[1] ) {
		case 0:
			var f = $e[2];
			$r = f(s);
			break;
		}
		return $r;
	}(this));
}
var data = {}
data.Either = { __ename__ : true, __constructs__ : ["Left","Right"] }
data.Either.Left = function(w) { var $x = ["Left",0,w]; $x.__enum__ = data.Either; $x.toString = $estr; return $x; }
data.Either.Right = function(v) { var $x = ["Right",1,v]; $x.__enum__ = data.Either; $x.toString = $estr; return $x; }
data.IntMixin = function() { }
data.IntMixin.__name__ = true;
data.IntMixin.toString = function(n) {
	return Std.string(n);
}
data.List = { __ename__ : true, __constructs__ : ["Nil","Cons"] }
data.List.Nil = ["Nil",0];
data.List.Nil.toString = $estr;
data.List.Nil.__enum__ = data.List;
data.List.Cons = function(x,xs) { var $x = ["Cons",1,x,xs]; $x.__enum__ = data.List; $x.toString = $estr; return $x; }
data.ListM = function() { }
data.ListM.__name__ = true;
data.ListM.fmap = function(f,m) {
	return (function($this) {
		var $r;
		var $e = (m);
		switch( $e[1] ) {
		case 0:
			$r = data.List.Nil;
			break;
		case 1:
			var xs = $e[3], x = $e[2];
			$r = data.List.Cons(f(x),data.ListM.fmap(f,xs));
			break;
		}
		return $r;
	}(this));
}
data.ListM.ap = function(fs,xs) {
	return (function($this) {
		var $r;
		var $e = (fs);
		switch( $e[1] ) {
		case 1:
			var rest = $e[3], f = $e[2];
			$r = data.ListM.append(data.ListM.fmap(f,xs),data.ListM.ap(rest,xs));
			break;
		case 0:
			$r = data.List.Nil;
			break;
		}
		return $r;
	}(this));
}
data.ListM.bind = function(m,f) {
	return (function($this) {
		var $r;
		var $e = (m);
		switch( $e[1] ) {
		case 1:
			var xs = $e[3], x = $e[2];
			$r = data.ListM.append(f(x),data.ListM.bind(xs,f));
			break;
		case 0:
			$r = data.List.Nil;
			break;
		}
		return $r;
	}(this));
}
data.ListM.concat = function(xs) {
	return (function($this) {
		var $r;
		var $e = (xs);
		switch( $e[1] ) {
		case 1:
			var lss = $e[3], ls = $e[2];
			$r = data.ListM.append(ls,data.ListM.concat(lss));
			break;
		case 0:
			$r = data.List.Nil;
			break;
		}
		return $r;
	}(this));
}
data.ListM.append = function($as,bs) {
	return (function($this) {
		var $r;
		var $e = ($as);
		switch( $e[1] ) {
		case 1:
			var as1 = $e[3], a = $e[2];
			$r = data.List.Cons(a,data.ListM.append(as1,bs));
			break;
		case 0:
			$r = bs;
			break;
		}
		return $r;
	}(this));
}
data.ListMixin = function() { }
data.ListMixin.__name__ = true;
data.ListMixin.fmap = function(m,f) {
	return data.ListM.fmap(f,m);
}
data.ListMixin.prototype = {
	bind: function(m,f) {
		return data.ListM.bind(m,f);
	}
}
data.Maybe = { __ename__ : true, __constructs__ : ["Just","Nothing"] }
data.Maybe.Just = function(v) { var $x = ["Just",0,v]; $x.__enum__ = data.Maybe; $x.toString = $estr; return $x; }
data.Maybe.Nothing = ["Nothing",1];
data.Maybe.Nothing.toString = $estr;
data.Maybe.Nothing.__enum__ = data.Maybe;
data.MaybeM = function() { }
data.MaybeM.__name__ = true;
data.MaybeM.fmap = function(f,m) {
	return (function($this) {
		var $r;
		var $e = (m);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = data.Maybe.Just(f(v));
			break;
		case 1:
			$r = data.Maybe.Nothing;
			break;
		}
		return $r;
	}(this));
}
data.MaybeM.ap = function(f,m) {
	return (function($this) {
		var $r;
		var $e = (f);
		switch( $e[1] ) {
		case 0:
			var g = $e[2];
			$r = (function($this) {
				var $r;
				var $e = (m);
				switch( $e[1] ) {
				case 0:
					var v = $e[2];
					$r = data.Maybe.Just(g(v));
					break;
				case 1:
					$r = data.Maybe.Nothing;
					break;
				}
				return $r;
			}($this));
			break;
		case 1:
			$r = data.Maybe.Nothing;
			break;
		}
		return $r;
	}(this));
}
data.MaybeM.bind = function(m,f) {
	return (function($this) {
		var $r;
		var $e = (m);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = f(v);
			break;
		case 1:
			$r = data.Maybe.Nothing;
			break;
		}
		return $r;
	}(this));
}
data.MaybeMixin = function() { }
data.MaybeMixin.__name__ = true;
data.MaybeMixin.fmap = function(m,f) {
	return (function($this) {
		var $r;
		var $e = (m);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = data.Maybe.Just(f(v));
			break;
		case 1:
			$r = data.Maybe.Nothing;
			break;
		}
		return $r;
	}(this));
}
data.MaybeMixin.prototype = {
	bind: function(m,f) {
		return (function($this) {
			var $r;
			var $e = (m);
			switch( $e[1] ) {
			case 0:
				var v = $e[2];
				$r = f(v);
				break;
			case 1:
				$r = data.Maybe.Nothing;
				break;
			}
			return $r;
		}(this));
	}
}
data.Monoid = function() { }
data.Monoid.__name__ = true;
data.A = function(i) {
	this.v = i;
};
data.A.__name__ = true;
data.A.__interfaces__ = [data.Monoid];
data.A.prototype = {
	mappend: function(w) {
		return new data.A(this.v + w.v);
	}
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
String.__name__ = true;
Array.__name__ = true;
Test.main();
})();
