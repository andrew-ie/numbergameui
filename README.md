# NumberGame

Mostly a re-implementation of the [NYT Digits](https://www.nytimes.com/games/digits) game that is being shut down on August 8th.

Major differences:
1. You have to get the final answer; nearly there doesn't count
2. There is no "daily puzzle" - instead, it just keeps going.
3. It doesn't have the fancy CSS sliding stuff (yet) that the original version had.

Deployment is hosted at https://numbersolver.acraig.dev 

## Level approach
To create levels, a seeded random number generator is used.

* This then retrieves 6 distinct numbers in a configured range, which is used as the starting point.
* To determine the appropriate target, every possible number from those starting points are calculated
  and then a random number inside an approximate range is chosen. This guarantees that any level is solvable.

By using a seeded random number generator, we can reproduce any level at any time.

## Game persistence
Only local storage is used - this just stores the last level visited, and the last level that has been solved.
Obviously this is trivial to hack locally, but as there's no high score system, you are only cheating yourself
