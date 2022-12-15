export const example = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`

function distance(a: number[], b: number[]) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

type Sensor = {
    sensor: number[],
    beacon: number[],
    radius: number
}

function parseSensors(input: string) {
    const points = input.split('\n').map(line => {
        const [p1, p2] = line
            .replace('Sensor at x=', '')
            .replace(' closest beacon is at x=', '')
            .replace(/(x|y)=/g, '')
            .split(':')
        return [
            p1.split(', ').map(v => parseInt(v)),
            p2.split(', ').map(v => parseInt(v))
        ]
    })
    return points.map(([sensor, beacon]) => {
        const radius = distance(sensor, beacon)
        return { sensor, radius, beacon }
    })
}

function computeIntersection({ sensor, radius }: Sensor, Y: number): number[] | null {
    const [Sx, Sy] = sensor
    if (Sy + radius < Y || Sy - radius > Y) return null
    const x1 = -Sy + Sx + radius + Y
    const x2 = -Sy + Sx - radius + Y
    const x3 = Sy + Sx - Y + radius
    const x4 = Sy + Sx - Y - radius
    const intersections = [x1, x2, x3, x4]
    intersections.sort((a, b) => a - b)
    intersections.pop()
    intersections.shift()
    return intersections
}

function mergeIntervals(intervals: number[][]) {
    const ranges = intervals
        .flatMap(([start, end]) => [{ type: 'start', v: start }, { type: 'end', v: end }])
        .sort((a, b) => a.v - b.v - (a.type === 'start' ? 0.5 : 0))
    let opened = 0
    const res: number[][] = []
    for (const { type, v } of ranges) {
        if (type === 'start' && opened === 0) {
            if (res.length > 0 && res[res.length - 1][1] + 1 === v) {
                res[res.length - 1].pop()
            } else {
                res.push([v])
            }
        } else if (type === 'end' && opened === 1) {
            res[res.length - 1].push(v)
        }
        opened += type === 'start' ? 1 : -1
    }
    return res
}

export function part1(input: string) {
    const sensors = parseSensors(input)
    return mergeIntervals(sensors.map(sensor => computeIntersection(sensor, 2000000)).filter((v): v is number[] => v != null))
        .reduce((sum, [start, end]) => sum + end - start, 0)
}

// brute force...
export function part2(input: string) {
    const sensors = parseSensors(input)
    for (let y = 0; y < 4000000; y++) {
        const intervals = mergeIntervals(sensors.map(sensor => computeIntersection(sensor, y)).filter((v): v is number[] => v != null))
        if (intervals.length === 2) {
            const x = intervals[0][1] + 1
            return 4000000 * x + y
        }
    }
}
