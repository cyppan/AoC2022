import * as _ from 'lodash'

export const example = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`

function getPriority(c: string) {
    const code = c.charCodeAt(0)
    if (code >= 97) { // lowercase
        return code - 96
    } else { // uppercase
        return code - 64 + 26
    }
}

export function part1(input: string) {
    return input.split('\n').map(line =>
        [line.slice(0, line.length / 2), line.slice(line.length / 2)]
    ).map(
        ([h1, h2]) => _.intersection([...h1], [...h2])[0]
    ).map(getPriority)
        .reduce((acc, el) => acc + el, 0)
}

export function part2(input: string) {
    return _.chain(input.split('\n'))
        .chunk(3)
        .map(([a, b, c]) => _.intersection([...a], [...b], [...c])[0])
        .map(getPriority)
        .reduce(_.add)
        .value()
}