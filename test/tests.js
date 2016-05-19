import * as Kefir from "kefir"
import * as R     from "ramda"
import Atom       from "kefir.atom"

import K from "../src/kefir.react.native"

function show(x) {
  switch (typeof x) {
    case "string":
    case "object":
      return JSON.stringify(x)
    default:
      return `${x}`
  }
}

const testEq = (expr, expect) => it(`${expr} => ${show(expect)}`, done => {
  const actual = eval(`(Atom, K, Kefir, R) => ${expr}`)(Atom, K, Kefir, R)
  const check = actual => {
    if (!R.equals(actual, expect))
      throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
    done()
  }
  if (actual instanceof Kefir.Observable)
    actual.take(1).onValue(check)
  else
    check(actual)
})

describe("K", () => {
  testEq('K()', [])
  testEq('K("a")', ["a"])
  testEq('K("a", Kefir.constant("b"))', ["a", "b"])

  testEq('K("a", x => x + x)', "aa")
  testEq('K(Kefir.constant("a"), Kefir.constant(x => x + x))', "aa")

  testEq('K([1, {y: {z: Kefir.constant("x")}}, Kefir.constant(3)], R.prepend(4))', [4, 1, {y: {z: "x"}}, 3])
})
