export const example = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`

type Direction = 'R' | 'U' | 'L' | 'B'
type Coords = [number, number]

function parseInstructions(input: string) {
    return input.split('\n').flatMap(line => {
        const [direction, steps] = line.split(' ')
        return [...Array(parseInt(steps))].map(() => direction as Direction)
    })
}

function distance(a: readonly [number, number], b: [number, number]) {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]))
}

function follow(t: Coords, h: Coords): Coords {
    if (distance(t, h) <= 1) return t
    const norm = (n: number) => n === 0 ? 0 : n / Math.abs(n)
    return [t[0] + norm(h[0] - t[0]), t[1] + norm(h[1] - t[1])]
}

function countRopeTailVisits(ropeLength: number, directions: string[]) {
    let rope: [number, number][] = [...Array(ropeLength)].map(() => [0, 0])
    const visited = new Set()
    const visit = ([x, y]: [number, number]) => visited.add(`${x},${y}`)
    visit(rope[0])
    for (const dir of directions) {
        const h = rope[0]
        if (dir === 'R') h[0]++
        if (dir === 'L') h[0]--
        if (dir === 'U') h[1]++
        if (dir === 'D') h[1]--
        for (let i = 1; i < rope.length; i++) {
            rope[i] = follow(rope[i], rope[i - 1])
        }
        visit(rope[rope.length - 1])
    }
    return visited.size
}

export function part1(input: string) {
    return countRopeTailVisits(2, parseInstructions(input))
}

export function part2(input: string) {
    return countRopeTailVisits(10, parseInstructions(input))
}