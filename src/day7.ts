export const example = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`

type File = {
    name: string
    parent: Folder
    size: number
}

type Folder = {
    name: string
    parent?: Folder
    children: (Folder | File)[]
    totalSize?: number
}

function findRoot(node: Folder | File): Folder {
    if (node.parent == null) return node as Folder
    return findRoot(node.parent)
}

function printTree(node: File | Folder, prefix: string = '') {
    console.log(`- ${prefix}${node.name} (${'children' in node ? 'dir' : 'file'}, size=${'children' in node ? node.totalSize : node.size})`)
    if ('children' in node) {
        node.children.forEach(n => printTree(n, `${prefix}  `))
    }
}

type Command = {
    command: string,
    results: string[]
}

function parseCommands(input: string): Command[] {
    const split = input.split('$')
    split.shift()
    return split.map(line => {
        const [command, ...results] = line.slice(1, line.length - 1).split('\n')
        return { command, results }
    })
}


function computeFolderSizes(node: Folder): number {
    const sum = node.children.reduce((sum, n) =>
        ('children' in n) ? sum + computeFolderSizes(n) : sum + n.size
        , 0)
    node.totalSize = sum
    return sum
}

function findFolders(node: Folder, predicate: (n: Folder) => boolean, res: Folder[] = []): Folder[] {
    if (predicate(node)) {
        res.push(node)
    }
    node.children.filter((n): n is Folder => 'children' in n)
        .forEach(n => findFolders(n as Folder, predicate, res))
    return res
}

function parseFileTree(commands: Command[]): Folder {
    const rootNode: Folder = {
        name: '/',
        children: []
    }
    let node: Folder = rootNode
    for (const { command, results } of commands) {
        if (command.startsWith('ls')) {
            const existings = new Set(node.children.map(c => c.name))
            for (const line of results) {
                const [size, fileOrFolder] = line.split(' ')
                if (!existings.has(fileOrFolder)) {
                    if (size === 'dir') {
                        node.children.push({
                            name: fileOrFolder,
                            parent: node,
                            children: []
                        })
                    } else {
                        node.children.push({
                            name: fileOrFolder,
                            parent: node,
                            size: parseInt(size)
                        })
                    }
                }
            }
        } else if (command.startsWith('cd')) {
            if (command.endsWith('..')) {
                node = node.parent!
            } else {
                const dir = command.split(' ')[1]
                node = node.children.find(n => n.name === dir) as Folder
            }
        }
    }
    return rootNode
}

export function part1(input: string) {
    // skip cd /
    const [_, ...commands] = parseCommands(input)
    const rootNode = parseFileTree(commands)
    computeFolderSizes(rootNode)
    // printTree(rootNode)
    return findFolders(rootNode, n => n.totalSize! <= 100000).reduce((sum, n) => sum + n.totalSize!, 0)
}

export function part2(input: string) {
    const [_, ...commands] = parseCommands(input)
    const rootNode = parseFileTree(commands)
    computeFolderSizes(rootNode)
    const expectedFreeSpace = 30000000
    const freeSpace = 70000000 - rootNode.totalSize!
    const minSizeToDelete = expectedFreeSpace - freeSpace
    const minFolder = findFolders(rootNode, n => n.totalSize! >= minSizeToDelete).reduce((minN, n) =>
        n.totalSize! < minN.totalSize! ? n : minN
        , rootNode)
    return minFolder.totalSize
}