const {MerkleTree} = require('merkletreejs')
const buildPoseidon = require('circomlibjs').buildPoseidon;
const buildBabyJub = require('circomlibjs').buildBabyjub

// remove the 0x from the value
const hasher = (F, hash) => val => hash([val])

const createTree = async (accounts) => {
  const F = (await buildBabyJub()).F
  const hash = await buildPoseidon()

  return new MerkleTree(accounts, hasher(F, hash), {sortPairs: false, hashLeaves: true})
}

const getRoot = tree => tree.getHexRoot()
const getProof = (tree, leaf) => tree.getHexProof(hash(leaf))

const main = async () => {
  const tree = await createTree([11,22,33,44,55,66,77,88])

  console.log('Root', getRoot(tree))
  console.log('Proof', getProof(tree, hasher(22)))
}

main().then(() => {})

module.exports = {
  createTree,
  getRoot,
  getProof,
}
