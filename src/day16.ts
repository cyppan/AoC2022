import * as _ from 'lodash'
import { PriorityQueue } from 'typescript-collections'

export const example = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`

const log = false

type Graph = {
    [from: string]: {
        rate: number,
        links: string[],
        pressureSoFar?: number
    }
}

type Action = ['open', string] | ['move', string] | ['none']

type State = {
    currentValve: string
    pressureToRelease: number
    pressure: number
    time: number
    openedValves: Set<string>
    lastAction: Action
    path?: Action[]
}

function areAllValvesOpened(g: Graph, state: State): boolean {
    for (const k in g) {
        if (g[k].rate > 0 && !state.openedValves.has(k)) return false
    }
    return true
}

function parseInput(input: string): Graph {
    return input.split(`\n`).map(line => {
        const [_, from, rate, to] = line.match(/Valve ([A-Z]+) has flow rate=([0-9]+); tunnels? leads? to valves? (.+)/)!
        return { from, rate: parseInt(rate), to: to.split(', ') }
    }).reduce((graph, { from, rate, to }) => ({
        ...graph,
        [from]: {
            rate,
            links: to
        }
    }), {})
}

function nextActions(g: Graph, state: State): Action[] {
    const actions: Action[] = []
    if (state.time >= 30 || areAllValvesOpened(g, state)) return []
    if (!state.openedValves.has(state.currentValve) && g[state.currentValve].rate > 0) {
        actions.push(['open', state.currentValve])
    }
    g[state.currentValve].links.forEach(to => {
        actions.push(['move', to])
    })
    return actions
}

function applyAction(g: Graph, state: State, action: Action): State {
    const [actionType, valve] = action
    return {
        currentValve: actionType === 'move' ? valve : state.currentValve,
        pressure: state.pressure + state.pressureToRelease,
        pressureToRelease: actionType === 'open' ? state.pressureToRelease + g[valve].rate : state.pressureToRelease,
        openedValves: actionType === 'open' ? new Set(state.openedValves).add(valve) : state.openedValves,
        time: state.time + 1,
        lastAction: action,
        path: log ? [...(state.path || []), action] : undefined
    }
}

// At each move to valve step, given the currently opened valves, 
// if the same valve has been already explored sooner (with inferior state.time) 
// and with a bigger pressure projecting to time = now
// => skip it
// For this to work the graph should be explored chronologically (strictly increasing state.time)
class PruningStrategy {
    private explored: { [hashOpenedCurrentValve: string]: State } = {}
    explore(state: State) {
        if (state.lastAction[0] !== 'move') return
        const hash: string = Array.from(state.openedValves).sort().join(',') + ',' + state.currentValve
        const hashState = this.explored[hash]
        if (!hashState) {
            this.explored[hash] = state
        } else {
            const projectedPressure = hashState.pressure + (state.time - hashState.time) * hashState.pressureToRelease
            if (projectedPressure > hashState.pressure) {
                this.explored[hash] = state
            }
        }
    }
    shouldPrune(state: State) {
        if (state.lastAction[0] !== 'move') return false
        const hash: string = Array.from(state.openedValves).sort().join(',') + ',' + state.currentValve
        const hashState = this.explored[hash]
        if (hashState == null) return false
        const projectedPressure = hashState.pressure + (state.time - hashState.time) * hashState.pressureToRelease
        return projectedPressure >= state.pressure
    }
}

function run(g: Graph): number {
    const q = new PriorityQueue<State>((a, b) => b.time - a.time)
    q.add({
        currentValve: 'AA',
        pressure: 0,
        pressureToRelease: 0,
        time: 1,
        openedValves: new Set<string>(),
        lastAction: ['move', 'AA'],
    })
    const pruningStrategy = new PruningStrategy()
    let maxPressure = 0
    let maxState = q.peek()
    let explored = 0
    while (!q.isEmpty()) {
        const state = q.dequeue()!
        if (pruningStrategy.shouldPrune(state)) continue
        pruningStrategy.explore(state)
        explored += 1
        const nextPressure = state.pressure + (30 - state.time + 1) * state.pressureToRelease
        if (nextPressure > maxPressure) {
            maxPressure = nextPressure
            maxState = state
        }
        nextActions(g, state).forEach(a => q.add(applyAction(g, state, a)))
    }

    console.log({ explored }, maxState)
    return maxPressure
}

function printGraph(g: Graph) {
    for (const n in g) {
        console.log(`${n} rate=${g[n].rate} links=${g[n].links}`)
    }
}

export function part1(input: string) {
    const g = parseInput(input)
    printGraph(g)
    return run(g)
}

// brute force...
export function part2(input: string) {
}
