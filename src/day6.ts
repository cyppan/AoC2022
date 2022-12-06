export const example = `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`

function findNDistinctIndex(input: string, N: number) {
    parentLoop:
    for (let i = 0; i < input.length - N; i++) {
        let seen = new Set()
        for (let j = i; j < i + N; j++) {
            if (seen.has(input[j])) {
                continue parentLoop
            }
            seen.add(input[j])
        }
        return i + N
    }
}

export function part1(input: string) {
    return findNDistinctIndex(input, 4)
}

export function part2(input: string) {
    return findNDistinctIndex(input, 14)
}