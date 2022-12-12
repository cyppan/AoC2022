import { PriorityQueue } from 'typescript-collections'
import { multilineStringAsMatrix, findMatrixCoords } from "./utils"

export const example = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`

type Coords = [number, number]

const canMove = (cur: string, next: string) => {
    if (cur === 'S') return true
    next = next === 'E' ? 'z' : next
    return next <= String.fromCharCode(cur.charCodeAt(0) + 1)
}

function getNextPositions(m: string[][], pos: Coords): Coords[] {
    const res: Coords[] = []
    const [r, c] = pos
    const char = m[r][c]
    if (r + 1 < m.length && canMove(char, m[r + 1][c])) res.push([r + 1, c])
    if (r - 1 >= 0 && canMove(char, m[r - 1][c])) res.push([r - 1, c])
    if (c + 1 < m[0].length && canMove(char, m[r][c + 1])) res.push([r, c + 1])
    if (c - 1 >= 0 && canMove(char, m[r][c - 1])) res.push([r, c - 1])
    return res
}

function findShortestPath(m: string[][], startPos: Coords): number | null {
    const queue = new PriorityQueue<{ pos: Coords, len: number }>((a, b) => b.len - a.len)
    queue.enqueue({ pos: startPos, len: 0 })
    const visited = new Set<string>([])
    while (queue.size() > 0) {
        const { pos, len } = queue.dequeue()!
        if (visited.has(`${pos[0]},${pos[1]}`)) continue
        visited.add(`${pos[0]},${pos[1]}`)
        const char = m[pos[0]][pos[1]]
        if (char === 'E') {
            return len
        }
        for (const nextPos of getNextPositions(m, pos)) {
            queue.enqueue({ pos: nextPos, len: len + 1 })
        }
    }
    return null
}

export function part1(input: string) {
    const m = multilineStringAsMatrix(input)
    const len = findShortestPath(m, findMatrixCoords(m, (c) => c === 'S')[0])
    return len
}

export function part2(input: string) {
    const m = multilineStringAsMatrix(input)
    let minLen = 999999
    for (const pos of findMatrixCoords(m, (c) => c === 'a' || c === 'S')) {
        const len = findShortestPath(m, pos)
        if (len && len < minLen) {
            minLen = len
        }
    }
    return minLen
}
