const {MerkleTree} = require('merkletreejs')
const buildPoseidon = require('circomlibjs').buildPoseidon

// remove the 0x from the value
const hasher = hash => val => {
  if(val.length === 64) {
    const left = val.slice(0, 32)
    const right = val.slice(32, 64)

    return hash([
      left < right ? left : right,
      right > left ? right : left,
    ])
  } else {
    return hash([val])
  }
}

let hashFn = null

const createLeaf = val => hashFn(val)

const createTree = async (accounts) => {
  const hash = await buildPoseidon()
  hashFn = hasher(hash)

  return new MerkleTree(accounts, hashFn, {sortPairs: false, hashLeaves: true})
}

const getRoot = tree => tree.getHexRoot()
const getProof = (tree, leaf) => tree.getHexProof(createLeaf(leaf))

module.exports = {
  createTree,
  getRoot,
  getProof,
  createLeaf,
}
