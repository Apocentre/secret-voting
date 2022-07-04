const {writeFile} = require('fs/promises')
const {createTree, getRoot, getProof, createLeaf} = require('../js/mt.js')

const main = async () => {
  const tree = await createTree([11, 22, 33, 44, 55, 66, 77, 88])

  await writeFile('input.json', JSON.stringify({
    root: getRoot(tree),
    key: 1, // 22 is in index 1 of the MT
    value: createLeaf(22),
    path: getProof(tree, 22),
  }))
}

main()
  .then(() => console.log('Success'))
  .catch(error => console.log('Error', error))
