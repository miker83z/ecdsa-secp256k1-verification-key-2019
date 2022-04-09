/*!
 * Copyright (c) 2014-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const { expect } = chai;

module.exports = async function ({ Secp256k1KeyPair }) {
  describe('secp256k1-key-pair', () => {
    describe('Secp256k1KeyPair', () => {
      it('has working constructor', async () => {
        const x = new Secp256k1KeyPair({
          id: undefined,
          controller: undefined,
          type: 'EcdsaSecp256k1VerificationKey2019',
          privateKeyBase58: '4HvXrvNBrmN5tUCwcjVWRpQG32CtuLvZ12xVf5rv8r1F',
          publicKeyBase58: '231cRx1fhyNzrdj9i3UseKm1ApgMwyDLbKtJJH5AacEwL',
        });
        x.should.be.a('object');
        expect(x.privateKeyBase58).to.equal(
          '4HvXrvNBrmN5tUCwcjVWRpQG32CtuLvZ12xVf5rv8r1F'
        );
        expect(x.publicKeyBase58).to.equal(
          '231cRx1fhyNzrdj9i3UseKm1ApgMwyDLbKtJJH5AacEwL'
        );
      });

      it('has static factory method from', async () => {
        const x = await Secp256k1KeyPair.from({
          id: undefined,
          controller: undefined,
          type: 'EcdsaSecp256k1VerificationKey2019',
          privateKeyBase58: '4HvXrvNBrmN5tUCwcjVWRpQG32CtuLvZ12xVf5rv8r1F',
          publicKeyBase58: '231cRx1fhyNzrdj9i3UseKm1ApgMwyDLbKtJJH5AacEwL',
        });
        x.should.be.a('object');
        expect(x.privateKeyBase58).to.equal(
          '4HvXrvNBrmN5tUCwcjVWRpQG32CtuLvZ12xVf5rv8r1F'
        );
        expect(x.publicKeyBase58).to.equal(
          '231cRx1fhyNzrdj9i3UseKm1ApgMwyDLbKtJJH5AacEwL'
        );
      });

      it('has static method fingerprintFromPublicKey', async () => {
        const f0 = Secp256k1KeyPair.fingerprintFromPublicKey({
          publicKeyBase58: '231cRx1fhyNzrdj9i3UseKm1ApgMwyDLbKtJJH5AacEwL',
        });
        expect(f0).to.equal(
          'zQ3shnxmSoA9BJ2Djspq8RZkh9MNcUSYvFmP8Fp46aQqhpio4'
        );
      });

      it('has instance method fingerprintFromPublicKey', async () => {
        const x = new Secp256k1KeyPair({
          id: undefined,
          controller: undefined,
          type: 'EcdsaSecp256k1VerificationKey2019',
          privateKeyBase58: '4HvXrvNBrmN5tUCwcjVWRpQG32CtuLvZ12xVf5rv8r1F',
          publicKeyBase58: '231cRx1fhyNzrdj9i3UseKm1ApgMwyDLbKtJJH5AacEwL',
        });
        const f0 = x.fingerprint();
        expect(f0).to.equal(
          'zQ3shnxmSoA9BJ2Djspq8RZkh9MNcUSYvFmP8Fp46aQqhpio4'
        );
      });

      it('has instance method verifyFingerprint', async () => {
        const x = new Secp256k1KeyPair({
          id: undefined,
          controller: undefined,
          type: 'EcdsaSecp256k1VerificationKey2019',
          privateKeyBase58: '4HvXrvNBrmN5tUCwcjVWRpQG32CtuLvZ12xVf5rv8r1F',
          publicKeyBase58: '231cRx1fhyNzrdj9i3UseKm1ApgMwyDLbKtJJH5AacEwL',
        });
        const v0 = x.verifyFingerprint(
          'zQ3shnxmSoA9BJ2Djspq8RZkh9MNcUSYvFmP8Fp46aQqhpio4'
        );
        expect(v0.valid).to.equal(true);
      });
    });

    it('has static method fromFingerprint', async () => {
      const x = await Secp256k1KeyPair.fromFingerprint({
        fingerprint: 'zQ3shnxmSoA9BJ2Djspq8RZkh9MNcUSYvFmP8Fp46aQqhpio4',
      });
      const v0 = x.verifyFingerprint(
        'zQ3shnxmSoA9BJ2Djspq8RZkh9MNcUSYvFmP8Fp46aQqhpio4'
      );
      expect(v0.valid).to.equal(true);
    });

    it('properly signs and verifies', async () => {
      const x = await Secp256k1KeyPair.generate();
      const { sign } = x.signer();
      sign.should.be.a('function');
      const testBuffer = Buffer.from('test 1');
      const signature = await sign({ data: testBuffer });
      (signature instanceof Uint8Array).should.be.true;
      const { verify } = x.verifier();
      verify.should.be.a('function');
      const result = await verify({ data: testBuffer, signature });
      result.should.be.a('boolean');
      result.should.be.true;
    });

    it('properly signs and verifies generating from keypair', async () => {
      const pubKeyUint8 = new Uint8Array([
        2, 19, 252, 160, 178, 177, 10, 253, 148, 118, 93, 42, 57, 95, 97, 25,
        46, 158, 19, 85, 69, 211, 237, 234, 166, 1, 94, 113, 54, 93, 140, 101,
        183,
      ]);
      const privKeyUint8 = new Uint8Array([
        116, 116, 182, 199, 181, 251, 247, 83, 57, 194, 254, 7, 116, 187, 178,
        253, 139, 143, 132, 153, 110, 213, 142, 160, 190, 76, 129, 8, 162, 138,
        140, 155,
      ]);

      const x = await Secp256k1KeyPair.generateFromUint8Keypair(
        pubKeyUint8,
        privKeyUint8
      );
      const { sign } = x.signer();
      sign.should.be.a('function');
      const testBuffer = Buffer.from('test 1');
      const signature = await sign({ data: testBuffer });
      (signature instanceof Uint8Array).should.be.true;
      const { verify } = x.verifier();
      verify.should.be.a('function');
      const result = await verify({ data: testBuffer, signature });
      result.should.be.a('boolean');
      result.should.be.true;
    });
  });
};
