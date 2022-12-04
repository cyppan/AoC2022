import * as fs from 'fs'
import * as path from 'path'
import { example, part1, part2 } from './day4'

function getInput(name: string) {
    return fs.readFileSync(path.join(__dirname, '..', 'inputs', name)).toString('utf-8')
}

const input = getInput("day4.txt")
// const input = example

console.log(
    "part 1",
    part1(input)
)

console.log(
    "part 2",
    part2(input)
)
