export const example = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`

const sandPouringPoint = [500, 0]

function parseRocks(input: string) {
    let [minX, maxX, maxY] = [0, Number.MAX_SAFE_INTEGER, 0]
    const rocks = new Set<string>()
    input.split('\n').forEach((line) => {
        const points = line.split(' -> ').map(pair => pair.split(','))
        for (let i = 0; i < points.length - 1; i++) {
            const from = [parseInt(points[i][0]), parseInt(points[i][1])]
            const to = [parseInt(points[i + 1][0]), parseInt(points[i + 1][1])]
            for (let x = Math.min(from[0], to[0]); x <= Math.max(from[0], to[0]); x++) {
                for (let y = Math.min(from[1], to[1]); y <= Math.max(from[1], to[1]); y++) {
                    minX = Math.min(minX, x)
                    maxX = Math.max(maxX, x)
                    maxY = Math.max(maxY, y)
                    rocks.add(`${x},${y}`)
                }
            }
        }
    })
    return { rocks, minX, maxX, maxY }
}

type SimulationOpts = {
    restPred: (x: number, y: number) => boolean
    endPred: (x: number, y: number) => boolean
    handleRest: (x: number, y: number) => void
}

function simulate({ restPred, endPred, handleRest }: SimulationOpts) {
    let [x, y] = sandPouringPoint
    let rested = 0
    while (!endPred(x, y)) {
        if (restPred(x, y + 1)) {
            if (restPred(x - 1, y + 1)) {
                if (restPred(x + 1, y + 1)) {
                    handleRest(x, y)
                    rested += 1
                    x = sandPouringPoint[0]
                    y = sandPouringPoint[1]
                } else {
                    x = x + 1
                    y = y + 1
                }
            } else {
                x = x - 1
                y = y + 1
            }
        } else {
            y = y + 1
        }
    }
    return rested
}

export function part1(input: string) {
    const { rocks, minX, maxX, maxY } = parseRocks(input)
    const restPred = (x: number, y: number) => rocks.has(`${x},${y}`)
    const endPred = (x: number, y: number) => x < minX || x > maxX || y > maxY
    const handleRest = (x: number, y: number) => rocks.add(`${x},${y}`)
    return simulate({ restPred, endPred, handleRest })
}

export function part2(input: string) {
    const { rocks, maxY } = parseRocks(input)
    const restPred = (x: number, y: number) => y === maxY + 2 || rocks.has(`${x},${y}`)
    const endPred = () => restPred(sandPouringPoint[0], sandPouringPoint[1])
    const handleRest = (x: number, y: number) => rocks.add(`${x},${y}`)
    return simulate({ restPred, endPred, handleRest })
}
