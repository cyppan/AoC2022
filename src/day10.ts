export const example = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`

function parseInstructions(input: string) {
    return input.split('\n').map(line => {
        const [cmd, arg] = line.split(' ')
        if (cmd === 'noop') {
            return { cmd } as const
        } else if (cmd === 'addx') {
            return { cmd, arg: parseInt(arg, 10) } as const
        } else {
            throw new Error('unsupported command')
        }
    })
}

export function part1(input: string) {
    let cycles = 0
    let register = 1
    const snapshots: any[] = []
    const captureSnapshot = () => {
        if ((cycles - 20) % 40 === 0) snapshots.push(register * cycles)
    }
    for (const { cmd, arg } of parseInstructions(input)) {
        if (cmd === 'noop') {
            cycles += 1
            captureSnapshot()
        } else if (cmd === 'addx') {
            cycles += 1
            captureSnapshot()
            cycles += 1
            captureSnapshot()
            register += arg
        }
    }
    return snapshots.reduce((sum, n) => sum + n)
}

function log(...args: any[]) {
    // console.log(...args)
}

export function part2(input: string) {
    let cycles = 0
    let register = 1
    let output = ''
    const draw = () => {
        const offset = cycles % 40
        output += (register - 1 <= offset - 1) && (register + 1 >= offset - 1) ? '#' : '.'
        log('output CRT row:', output)
        if (offset === 0) output += '\n'
    }
    for (const { cmd, arg } of parseInstructions(input)) {
        if (cmd === 'noop') {
            cycles += 1
            log(`start cycle ${cycles}: begin executing noop`)
            draw()
            log(`end of cycle ${cycles}: finish executing noop`)
        } else if (cmd === 'addx') {
            cycles += 1
            log(`start cycle ${cycles}: begin executing addx ${arg}`)
            draw()
            cycles += 1
            log(`during cycle ${cycles}`)
            draw()
            register += arg
            log(`end of cycle ${cycles}: finish executing addx ${arg} (register is now ${register})`)
        }
        log()
    }
    return output
}