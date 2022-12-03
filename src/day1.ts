export const example = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`

const getCalories = (input: string) =>
    input.split("\n\n")
        .map((boxes) =>
            boxes.split('\n').map(raw => parseInt(raw)).reduce((acc, el) => acc + el, 0)
        )

export function part1(input: string) {
    const calories = getCalories(input)
    const biggestElfIdx = calories.reduce((maxIdx, el, elfIdx) => el > calories[maxIdx] ? elfIdx : maxIdx, 0)
    return calories[biggestElfIdx]
}

export function part2(input: string) {
    const calories = getCalories(input)
    let totalCalories = 0
    for (let i = 0; i < 3; i++) {
        const biggestElfIdx = calories.reduce((maxIdx, el, elfIdx) => el > calories[maxIdx] ? elfIdx : maxIdx, 0)
        totalCalories += calories[biggestElfIdx]
        delete calories[biggestElfIdx]
    }
    return totalCalories
}