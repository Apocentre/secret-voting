const {MerkleTree} = require('merkletreejs')
const hash = require('circomlibjs').poseidon;
const F = require('circomlibjs').babyjub.F;

// remove the 0x from the value
const hasher =  val => {
  if(val.length === 64) {
    const left = val.slice(0, 32)
    const right = val.slice(32, 64)

    return Buffer.from(hash([left, right]).toString())
  } else {
    return Buffer.from(hash([val]).toString())
  }
}

const createLeaf = val => Buffer.from(hash([val]).toString())

const createTree = async (accounts) => {
  return new MerkleTree(accounts, hasher, {sortPairs: false, hashLeaves: true, sort: false})
}

const getRoot = tree => tree.getHexRoot()
const getProof = (tree, leaf) => tree.getHexProof(createLeaf(leaf))

module.exports = {
  createTree,
  getRoot,
  getProof,
  createLeaf,
}
