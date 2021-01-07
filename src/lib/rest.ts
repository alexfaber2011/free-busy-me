/**
 * splice is nasty, it mutates the original array.  Mutating a reference is
 * horrible.  Let's mutate a copy instead, and, thus, return a new reference.
 *
 * Oh yeah, this returns all elements in an array except for the first
 */
const rest = <E>(arr: E[]): E[] => {
  const copied = [...arr];
  return copied.splice(1);
};

export default rest;
