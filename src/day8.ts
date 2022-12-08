import _ = require("lodash")

export const example = `30373
25512
65332
33549
35390`

function parseM(input: string) {
    return input.split('\n').map(line => line.split(''))
}

function mapM<T, U>(matrix: T[][], mapper: (t: T) => U): U[][] {
    return matrix.map(row => row.map(col => mapper(col)))
}

function reduceM<T, Acc>(matrix: T[][], reducer: (acc: Acc, el: T) => Acc, init: Acc): Acc {
    let acc = init
    for (let rowI = 0; rowI < matrix.length; rowI++) {
        for (let colI = 0; colI < matrix.length; colI++) {
            acc = reducer(acc, matrix[rowI][colI])
        }
    }
    return acc
}

function rowsM<T>(matrix: T[][]) {
    return matrix
}

function reversedRowsM<T>(matrix: T[][]) {
    return matrix.map(arr => arr.slice().reverse())
}

function colsM<T>(matrix: T[][]) {
    const res = []
    for (let colI = 0; colI < matrix.length; colI++) {
        res.push([] as T[])
        for (let rowI = 0; rowI < matrix.length; rowI++) {
            res[colI].push(matrix[rowI][colI])
        }
    }
    return res
}

function reversedColsM<T>(matrix: T[][]) {
    return colsM(matrix).map(arr => arr.slice().reverse())
}

type Direction = 'r' | 't' | 'l' | 'b'

export function part1(input: string) {
    const matrix = parseM(input)
    const m = mapM(matrix, d => ({
        d: parseInt(d),
        r: true,
        t: true,
        l: true,
        b: true,
    }))
    _.concat(
        rowsM(m).map(line => ({ line, direction: 'r' as Direction } as const)),
        reversedRowsM(m).map(line => ({ line, direction: 'l' as Direction} as const)),
        colsM(m).map(line => ({ line, direction: 'b' as Direction} as const)),
        reversedColsM(m).map(line => ({ line, direction: 't' as Direction} as const)),
    ).forEach(({line, direction}) => {
        let max = -1
        for (const cell of line) {
            if (cell.d <= max) {
                cell[direction] = false
            } else {
                max = cell.d
            }
        }
    })
    return reduceM(m, (acc, el) => acc + ((el.r || el.t || el.l || el.b) ? 1 : 0), 0)
}

export function part2(input: string) {
    const matrix = parseM(input)
    const m = mapM(matrix, d => ({
        d: parseInt(d),
        r: 0,
        t: 0,
        l: 0,
        b: 0,
    }))
    _.concat(
        rowsM(m).map(line => ({ line, direction: 'r' as Direction } as const)),
        reversedRowsM(m).map(line => ({ line, direction: 'l' as Direction} as const)),
        colsM(m).map(line => ({ line, direction: 'b' as Direction} as const)),
        reversedColsM(m).map(line => ({ line, direction: 't' as Direction} as const)),
    ).forEach(({line, direction}) => {
        // keep track of each elevation distance going that direction
        let accs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let isBorder = true
        for (const cell of line) {
            const i = cell.d
            // the current count for this digit
            cell[direction] = accs[i] + (isBorder ? 0 : 1)
            // increment the acc
            if (!isBorder) {
                for (let j = 0; j < i + 1; j++) {
                    accs[j] = 0
                }
                for (let j = i + 1; j < accs.length; j++) {
                    accs[j]++
                }
            }
            isBorder = false
        }
    })
    const scenicM = mapM(m, cell => cell.r * cell.t * cell.l * cell.b)
    return reduceM(scenicM, (acc, cell) => Math.max(acc, cell), 0)
}