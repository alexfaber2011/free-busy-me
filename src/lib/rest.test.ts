import rest from './rest';

it('should return all elements except the first', () => {
  const array = [1,2,3];
  const result = rest(array);
  expect(array).toHaveLength(3);
  expect(result[0]).toBe(2);
  expect(result[1]).toBe(3);
});

it('should return an empty array if provided an empty array', () => {
  expect(rest([])).toHaveLength(0);
});
