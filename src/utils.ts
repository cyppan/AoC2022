import * as _ from 'lodash'

export function findArray(arr: any[], match: any[]) {
    for (let i = 0; i < arr.length - match.length + 1; i++) {
        if (_.isEqual(arr.slice(i, i + match.length), match)) {
            return true
        }
    }
    return false
}

export function multilineStringAsMatrix(s: string): string[][] {
    return s.split('\n').map(line => line.split(''))
}

export function printMatrix<T>(m: T[][], separator = '') {
    m.forEach(line => {
        console.log(line.join(separator))
    })
}

export function mapMatrix<T, U>(m: T[][], mapper: (t: T) => U) {
    const res = []
    for (let rowI = 0; rowI < m.length; rowI++) {
        const line = m[rowI];
        res.push(line.map(mapper))
    }
    return res
}

export function rotateMatrix<T>(arr: T[][]) {
    const res: T[][] = []
    for (let colI = 0; colI < arr[0].length; colI++) {
        res.push([])
        for (let rowI = 0; rowI < arr.length; rowI++) {
            const col = arr[rowI][colI];
            res[colI].push(col)
        }
    }
    return res
}

export function findMatrixCoords<T extends string | number>(m: T[][], pred: (t: T) => boolean) {
    const coords: [number, number][] = []
    for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[0].length; c++) {
            if (pred(m[r][c])) coords.push([r, c])
        }
    }
    return coords
}