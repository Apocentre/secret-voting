pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/switcher.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

template MtVerifier() {
  signal input sibling;
  signal input low;
  signal input selector;
  signal output root;

  component sw = Switcher();
  component hash = Poseidon(2);

  // if seletor is 1 then we sw.outL becomes sw.R and sw.outR is sw.L
  sw.sel <== selector;
  sw.L <== low;
  sw.R <== sibling;

  // Now we have to correct order to hash the two siblings
  hash.inputs[0] <== sw.outL;
  hash.inputs[1] <== sw.outR;

  root <== hash.out;
}

template MembershipVerifier(nLevels) {
  signal input root;
  signal input key;
  signal input value;
  signal input path[nLevels];

  component n2b = Num2Bits(nLevels);
  component levels[nLevels];
  component hasher = Poseidon(1);

  hasher.inputs[0] <== value;
  
  // The output of this helper circuit will be the binary representation of the key.
  // For example if key = 3 then n2b.out = [0, 1, 1]
  n2b.in <== key;

  for(var i = nLevels - 1; i >= 0; i--) {
    log(path[i]);
    log(n2b.out[i]);
    
    levels[i] = MtVerifier();
    levels[i].sibling <== path[i];
    levels[i].selector <== n2b.out[i];

    // we begin by using the hash of the input value we provided
    // After that we use the result of the hash of the two siblings when we move
    // towards higher levels
    if(i == nLevels - 1) {
      levels[i].low <== hasher.out;
    } else {
      levels[i].low <== levels[i+1].root;
    }
  }

    log(levels[0].root);
    log(root);

  root === levels[0].root;
}
