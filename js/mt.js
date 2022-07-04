const {MerkleTree} = require('merkletreejs')
const buildPoseidon = require('circomlibjs').buildPoseidon;

// remove the 0x from the value
const hasher = hash => val => {
  if(val.length === 64) {
    return hash([
      val.slice(0, 32),
      val.slice(32, 64),
    ])
  } else {
    return hash([val])
  }
}

let hashFn = null

const createTree = async (accounts) => {
  const hash = await buildPoseidon()
  hashFn = hasher(hash)

  return new MerkleTree(accounts, hashFn, {sortPairs: false, hashLeaves: true})
}

const getRoot = tree => tree.getHexRoot()
const getProof = (tree, leaf) => tree.getHexProof(hashFn(leaf))

const main = async () => {
  const tree = await createTree([11, 22, 33, 44, 55, 66, 77, 88])

  console.log('Root', getRoot(tree))
  console.log('Proof', getProof(tree, 22))
}

main().then(() => {})

module.exports = {
  createTree,
  getRoot,
  getProof,
}
