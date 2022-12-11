export const example = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`

type Operation = (v: number) => number

type ResolveNext = (v: number) => number

class Monkey {
    public itemsInspected: number = 0

    constructor(public id: number, public items: number[], private operation: Operation, private resolveNext: ResolveNext) { }

    addItem(item: number) {
        this.items.push(item)
    }

    playTurn(players: Monkey[], worryMode: boolean) {
        this.itemsInspected += this.items.length
        for (let level of this.items) {
            level = this.operation(level)
            if (!worryMode) {
                level = Math.floor(level / 3)
            } else {
                // avoid number overflow (silent btw...)
                // as long as the divisibleBy check returns the same result it will lead to the same result
                const modulo = 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19
                level = level % modulo
            }
            const nextMonkey = players.find(m => m.id === this.resolveNext(level))!
            nextMonkey.addItem(level)
        }
        this.items = []
    }

    static parseInput(input: string) {
        const lines = input.split('\n')
        const id: number = parseInt(lines[0].slice(0, lines[0].length - 1).split(' ')[1])
        const items = lines[1].split(': ')[1].split(', ').map(n => parseInt(n))
        const [opType, opValue] = lines[2].split('old ')[1].split(' ')
        let operation: Operation
        if (opValue === 'old') {
            operation = (v: number) => v ** 2
        } else if (opType === '+') {
            operation = (v: number) => v + parseInt(opValue)
        } else {
            operation = (v: number) => v * parseInt(opValue)
        }
        const divisibleBy = parseInt(lines[3].split('by ')[1])
        const ifTrue = parseInt(lines[4].split('monkey ')[1])
        const ifFalse = parseInt(lines[5].split('monkey ')[1])
        const resolveNext: ResolveNext = (v: number) => (v % divisibleBy === 0) ? ifTrue : ifFalse
        return new Monkey(id, items, operation, resolveNext)
    }
}

export function part1(input: string) {
    const monkeys = input.split('\n\n').map(Monkey.parseInput)
    for (let rounds = 0; rounds < 20; rounds++) {
        monkeys.forEach(m => {
            m.playTurn(monkeys, false)
        })
    }
    return monkeys.sort((a, b) => b.itemsInspected - a.itemsInspected)
        .map(m => m.itemsInspected)
        .slice(0, 2)
        .reduce((acc, n) => acc * n)
}

export function part2(input: string) {
    const monkeys = input.split('\n\n').map(Monkey.parseInput)
    for (let rounds = 0; rounds < 10000; rounds++) {
        monkeys.forEach(m => {
            m.playTurn(monkeys, true)
        })
    }
    return monkeys
        .sort((a, b) => b.itemsInspected - a.itemsInspected)
        .map(m => m.itemsInspected)
        .slice(0, 2)
        .reduce((acc, n) => acc * n)
}
