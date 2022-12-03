import * as _ from 'lodash'

export function findArray(arr: any[], match: any[]) {
    for (let i = 0; i < arr.length - match.length + 1; i++) {
        if (_.isEqual(arr.slice(i, i + match.length), match)) {
            return true
        }
    }
    return false
}
