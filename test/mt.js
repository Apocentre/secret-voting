const chai = require('chai')
const assert = chai.assert;
const {createTree, getRoot, getProof, createLeaf} = require('../js/mt.js')


describe('Merkle tree test', function () {
  it('It should create a 3 level merkle tree, generate a mp and validate it', async () => {
    const tree = await createTree([11, 22, 33, 44, 55, 66, 77, 88])
    assert(tree.verify(getProof(tree, 22), createLeaf(22), getRoot(tree)))
  });
});
