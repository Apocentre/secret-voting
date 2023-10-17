const {writeFile} = require('fs/promises')
const {merkelize, getMerkleProof} = require('../js/mt2.js')

const toBuffer = val => `0x${Buffer.from(val.toString()).toString('hex')}`

const main = async () => {
  const tree = merkelize([11, 22, 33, 44, 55, 66, 77, 88], 3)
  const root = toBuffer(tree[0])
  const path = getMerkleProof(tree, 1, 3).map(toBuffer)

  await writeFile('voting_js/input.json', JSON.stringify({
    root,
    key: 1, // 22 is in index 1 of the MT
    value: 22,
    path,
  }))
}

main()
  .then(() => console.log('Success'))
  .catch(error => console.log('Error', error))
