export const example = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
3-5,3-6
3-6,3-5`

const parse = (input: string) => input.split('\n').map(line => {
    const [a, b] = line.split(',')
    return [a.split('-').map(n => parseInt(n)), b.split('-').map(n => parseInt(n))]
})

export function part1(input: string) {
    const pairs = parse(input)
    return pairs.map(([[a1, a2], [b1, b2]]) =>
        ((a1 === b1 && a2 > b2) || a1 < b1) ?
            [[a1, a2], [b1, b2]] : [[b1, b2], [a1, a2]])
        .filter(([a, b]) => a[1] >= b[1])
        .length
}

export function part2(input: string) {
    const pairs = parse(input)
    return pairs.map(([[a1, a2], [b1, b2]]) =>
        ((a1 === b1 && a2 > b2) || a1 < b1) ?
            [[a1, a2], [b1, b2]] : [[b1, b2], [a1, a2]])
            .filter(([a, b]) => b[0] <= a[1])
            .length
}