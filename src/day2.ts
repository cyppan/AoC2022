import * as _ from 'lodash'
import { findArray } from "./utils"

export const example = `A Y
B X
C Z`

const shapes = ['R', 'P', 'S'] as const
type Shape = typeof shapes[number]
type RoundEnd = 'win' | 'draw' | 'loss'
const winScore = 6
const lostScore = 0
const drawScore = 3

const shapeMap: Record<string, Shape> = {
    X: 'R',
    Y: 'P',
    Z: 'S',
    A: 'R',
    B: 'P',
    C: 'S',
}

const scoreMap: Record<string, number> = {
    'R': 1,
    'P': 2,
    'S': 3
}

const roundEndMap: Record<string, RoundEnd> = {
    'X': 'loss',
    'Y': 'draw',
    'Z': 'win'
}

function getScore(op: Shape, me: Shape) {
    if (op === me) return drawScore
    if (findArray([...shapes, shapes[0]], [me, op])) return lostScore
    return winScore
}

function guessMyShape(op: Shape, end: RoundEnd) {
    if (end === 'draw') return op
    const ref = [...shapes, shapes[0]]
    if (end === 'win') {
        const i = ref.findIndex(s => s === op)
        return ref[i + 1]
    } else {
        const i = _.findLastIndex(ref, s => s === op)
        return ref[i - 1]
    }
}

export function part1(input: string) {
    const rounds = input.split('\n')
        .map(line =>
            line.split(' ').map(enc => shapeMap[enc]) as Shape[]
        )
    let totalScore = 0
    for (const [op, me] of rounds) {
        totalScore += scoreMap[me]
        totalScore += getScore(op, me)
    }
    return totalScore
}

export function part2(input: string) {
    const rounds = input.split('\n')
        .map(line => {
            const [op, enc] = line.split(' ')
            const opShape = shapeMap[op]
            const end = roundEndMap[enc]
            return [opShape, guessMyShape(opShape, end)]
        }
        )
    let totalScore = 0
    for (const [op, me] of rounds) {
        totalScore += scoreMap[me]
        totalScore += getScore(op, me)
    }
    return totalScore
}