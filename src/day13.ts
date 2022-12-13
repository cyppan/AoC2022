export const example = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`

function parseLine(line: string, i: number = 0, ptr: any = { cur: [], parent: null }) {
    // const findRoot: (ptr: any) => any = (ptr) => ptr.parent ? findRoot(ptr.parent) : ptr.cur
    // console.log(i, line[i], formatLine(findRoot(ptr)))
    if (line[i] === '[') {
        const newCur: any = []
        ptr.cur.push(newCur)
        parseLine(line, i + 1, { cur: newCur, parent: ptr })
    } else if (line[i] === ',') {
        parseLine(line, i + 1, ptr)
    } else if (line[i] === ']') {
        if (i + 1 < line.length) {
            parseLine(line, i + 1, { cur: ptr.parent.cur, parent: ptr.parent?.parent })
        }
    } else { // number
        let n = ''
        while (!['[', ',', ']'].includes(line[i])) {
            n += line[i]
            i += 1
        }
        ptr.cur.push(parseInt(n))
        parseLine(line, i, ptr)
    }
    return ptr.cur[0]
}

function formatLine(v: any): string {
    if (typeof v === 'number') {
        return v.toString()
    } else {
        return '[' + v.map(formatLine).join(',') + ']'
    }
}

function parsePairs(input: string) {
    return input.split('\n\n').map(group => {
        const [left, right] = group.split('\n')
        return [parseLine(left), parseLine(right)]
    })
}

function isPairOrdered(left: any, right: any): boolean | null {
    if (typeof left === 'number' && typeof right === 'number') {
        if (left < right) return true
        if (left > right) return false
    } else if (Array.isArray(left) && Array.isArray(right)) {
        for (let i = 0; i < Math.max(left.length, right.length); i++) {
            if (i >= left.length) return true
            if (i >= right.length) return false
            const isOrdered = isPairOrdered(left[i], right[i])
            if (isOrdered === true) return true
            if (isOrdered === false) return false
            // otherwise keep going
        }
    } else if (Array.isArray(left)) {
        return isPairOrdered(left, [right])
    } else if (Array.isArray(right)) {
        return isPairOrdered([left], right)
    }
    return null
}

export function part1(input: string) {
    return parsePairs(input)
        .flatMap(([left, right], i) => isPairOrdered(left, right) ? [i + 1] : [])
        .reduce((sum, i) => sum + i)
}

export function part2(input: string) {
    return parsePairs(input)
        .flatMap(pair => pair)
        .concat([[[2]], [[6]]])
        .sort((a, b) => isPairOrdered(a, b) ? -1 : 1)
        .map(formatLine)
        .flatMap((line, i) => ['[[2]]', '[[6]]'].includes(line) ? [i + 1] : [])
        .reduce((acc, n) => acc * n)
}
