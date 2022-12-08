import * as fs from 'fs'
import * as path from 'path'
import { example, part1, part2 } from './day8'

function getInput(name: string) {
    return fs.readFileSync(path.join(__dirname, '..', 'inputs', name)).toString('utf-8')
}

const input = getInput("day8.txt")
// const input = example

console.log(
    "part 1\n",
    part1(input)
)

console.log(
    "part 2\n",
    part2(input)
)
