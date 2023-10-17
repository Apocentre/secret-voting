const hash = require('circomlibjs').poseidon;
const F = require('circomlibjs').babyjub.F;

const merkelize = (arr, nLevels) => {
	const extendedLen = 1 << nLevels;

	const hArr = [];
	for (let i=0; i<extendedLen; i++) {
			if (i<arr.length) {
					hArr.push(hash([F.e(arr[i])]));
			} else {
					hArr.push(F.zero);
			}
	}

	return _merkelize(hash, hArr);

}

const _merkelize = (hash, arr) => {
	if (arr.length == 1) return arr;

	const hArr = [];
	for (i=0; i<arr.length/2; i++) {
			hArr.push(hash([arr[2*i], arr[2*i+1]]));
	}

	const m = _merkelize(hash, hArr); 

	return [...m, ...arr];
}

const getMerkleProof = (m, key, nLevels) => {
	if (nLevels == 0) return [];

	const extendedLen = 1 << nLevels;

	topSiblings = getMerkleProof(m, key >> 1, nLevels -1);

	curSibling = m[ extendedLen - 1 + (key ^ 1) ];

	return [...topSiblings, curSibling];

}

const isMerkleProofValid = (F, hash, key, value, root, mp) => {
	let h = hash([value]);
	for (let i = mp.length-1; i>=0; i--) {
			if ((1 << (mp.length -1 - i)) & key) {
					h = hash([mp[i], h]);
			} else {
					h = hash([h, mp[i]]);
			}
	} 

	return F.eq(root, h);
}

module.exports = {
	isMerkleProofValid,
	getMerkleProof,
	merkelize,
}
