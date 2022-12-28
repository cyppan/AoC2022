import _ = require("lodash")

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

type Graph = {
    [from: string]: {
        rate: number,
        links: string[]
        dists: { [to: string]: number },
    }
}

type Action = ['open', string] | ['move', string] | ['none']

type State = {
    currentValve: string
    pressureToRelease: number
    pressure: number
    time: number
    openedValves: string[]
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

// Floyd–Warshall algorithm
function compressGraph(g: Graph) {
    for (const valve in g) {
        g[valve].dists = {}
        if (valve !== 'AA' && g[valve].rate === 0) continue
        const visited = new Set()
        const q: [number, string][] = [[0, valve]]
        while (q.length > 0) {
            const [dist, v] = q.shift()!
            if (visited.has(v)) continue
            visited.add(v)
            if (g[v].rate > 0) {
                g[valve].dists[v] = dist
            }
            g[v].links.forEach(neighbor => q.push([dist + 1, neighbor]))
        }
        delete g[valve].dists[valve]
    }
    for (const valve in g) {
        if (valve !== 'AA' && g[valve].rate === 0) {
            delete g[valve]
        }
    }
}

function nextActions(g: Graph, state: State, maxTurns: number, openableValves: Set<string>): Action[] {
    const actions: Action[] = []
    if (state.time >= maxTurns) return []
    if (openableValves.has(state.currentValve) && !state.openedValves.includes(state.currentValve) && g[state.currentValve].rate > 0) {
        actions.push(['open', state.currentValve])
    }
    for (const to in g[state.currentValve].dists) {
        const distance = g[state.currentValve].dists[to]
        if ((state.time + distance) >= maxTurns - 1) continue
        actions.push(['move', to])
    }
    return actions
}

function applyAction(g: Graph, state: State, action: Action): State {
    const [actionType, valve] = action
    const elapsedTime = actionType === 'move' ? g[state.currentValve].dists[valve] : 1
    return {
        currentValve: actionType === 'move' ? valve : state.currentValve,
        pressure: state.pressure + state.pressureToRelease * elapsedTime,
        pressureToRelease: actionType === 'open' ? state.pressureToRelease + g[valve].rate : state.pressureToRelease,
        openedValves: actionType === 'open' ? [...state.openedValves, valve] : state.openedValves,
        time: state.time + elapsedTime,
    }
}

class PruningStrategy {
    public explored = {} as { [k: string]: number }
    explore(state: State) {
        const hash: string = state.openedValves.join(',') + ',' + state.currentValve
        this.explored[hash] = state.time
    }
    shouldPrune(state: State) {
        const hash: string = state.openedValves.join(',') + ',' + state.currentValve
        return state.time >= (this.explored[hash] ?? Number.MAX_SAFE_INTEGER)
    }
}

function run(g: Graph, maxTurns: number, openableValves: Set<string>): number {
    const q: State[] = [{
        currentValve: 'AA',
        pressure: 0,
        pressureToRelease: 0,
        time: 1,
        openedValves: [],
    }]
    const pruningStrategy = new PruningStrategy()
    let maxPressure = 0
    let maxState
    let explored = 0
    while (q.length > 0) {
        const state = q.pop()!
        if (pruningStrategy.shouldPrune(state)) continue
        pruningStrategy.explore(state)
        explored += 1
        const nextPressure = state.pressure + (maxTurns - state.time + 1) * state.pressureToRelease
        if (nextPressure > maxPressure) {
            maxPressure = nextPressure
            maxState = state
        }
        nextActions(g, state, maxTurns, openableValves).forEach(a => q.push(applyAction(g, state, a)))
    }
    // console.log({ explored }, maxState)
    return maxPressure
}

function printGraph(g: Graph) {
    for (const n in g) {
        console.log(`${n} rate=${g[n].rate} dists=${Object.entries(g[n].dists ?? {}).map(([to, distance]) => `${to}=${distance}`).join(', ')}`)
    }
}

export function part1(input: string) {
    const g = parseInput(input)
    compressGraph(g)
    // printGraph(g)
    const openable = new Set(Object.keys(g).filter(n => g[n].rate > 0))
    return run(g, 30, openable)
}

function splitCombos3(valves: Set<string>): Set<string>[] {
    const l = Array.from(valves)
    const res: Set<string>[] = []
    for (let a = 0; a < l.length - 3; a++) {
        for (let b = a + 1; b < l.length - 3 + 1; b++) {
            for (let c = b + 1; c < l.length - 3 + 2; c++) {
                res.push(new Set([l[a], l[b], l[c]]))
            }
        }
    }
    return res
}

function splitCombos7(valves: Set<string>): Set<string>[] {
    const l = Array.from(valves)
    const res: Set<string>[] = []
    for (let a = 0; a < l.length - 7; a++) {
        for (let b = a + 1; b < l.length - 7 + 1; b++) {
            for (let c = b + 1; c < l.length - 7 + 2; c++) {
                for (let d = c + 1; d < l.length - 7 + 3; d++) {
                    for (let e = d + 1; e < l.length - 7 + 4; e++) {
                        for (let f = e + 1; f < l.length - 7 + 5; f++) {
                            for (let g = f + 1; g < l.length - 7 + 6; g++) {
                                res.push(new Set([l[a], l[b], l[c], l[d], l[e], l[f], l[g]]))
                            }
                        }
                    }
                }
            }
        }
    }
    return res
}

export function part2(input: string) {
    // we explore all set combinations for 2 visitors
    // each player can open only a subset of the valves assigned in advance
    const g = parseInput(input)
    compressGraph(g)
    const openable = new Set(Object.keys(g).filter(n => g[n].rate > 0))
    let maxPressure = 0
    splitCombos7(openable).forEach(openable1 => {
        const openable2 = new Set(_.difference(Array.from(openable), Array.from(openable1)))
        // console.log(openable1, openable2)
        maxPressure = Math.max(maxPressure, run(g, 26, openable1) + run(g, 26, openable2))
    })
    return maxPressure
}
