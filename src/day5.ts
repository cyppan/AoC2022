import _ = require('lodash')
import * as utils from './utils'

export const example = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`

type Order = {
    qty: number,
    from: number,
    to: number
}
function parseOrder(line: string) {
    const [, qty, from, to] = line.match(/move (\d+) from (\d+) to (\d+)/)!
    return { qty: parseInt(qty), from: parseInt(from) - 1, to: parseInt(to) - 1 }
}

function parseInput(input: string) {
    const [stacksRaw, ordersRaw] = input.split('\n\n')
    let parsed = utils.multilineStringAsMatrix(stacksRaw)
    parsed.pop()
    parsed = utils.rotateMatrix(parsed)
    let stacks: string[][] = []
    for (const i of _.range(1, parsed.length, 4)) {
        stacks.push(parsed[i].filter(el => el !== ' '))
    }
    return {
        stacks: stacks,
        orders: ordersRaw.split('\n').map(parseOrder)
    }
}

function executeOrders(stacks: string[][], orders: Order[]) {
    for (const order of orders) {
        for (let i = 0; i < order.qty; i++) {
            const el = stacks[order.from].shift()!
            stacks[order.to] = [el, ...stacks[order.to]]
        }
    }
    return stacks
}

function executeOrders2(stacks: string[][], orders: Order[]) {
    for (const order of orders) {
        let toMove: string[] = []
        for (let i = 0; i < order.qty; i++) {
            const el = stacks[order.from].shift()!
            toMove.push(el)
        }
        toMove = _.reverse(toMove)
        for (let i = 0; i < toMove.length; i++) {
            stacks[order.to] = [toMove[i], ...stacks[order.to]]
        }
    }
    return stacks
}

export function part1(input: string) {
    const { stacks, orders } = parseInput(input)
    const result = executeOrders(stacks, orders)
    return result.reduce((acc, el) => `${acc}${el[0]}`, '')
}

export function part2(input: string) {
    const { stacks, orders } = parseInput(input)
    const result = executeOrders2(stacks, orders)
    return result.reduce((acc, el) => `${acc}${el[0]}`, '')
}