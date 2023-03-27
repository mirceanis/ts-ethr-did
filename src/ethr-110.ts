import { EthrDID } from 'ethr-did'
import { createVerifiableCredentialJwt, Issuer } from "did-jwt-vc";

const issuer = new EthrDID(EthrDID.createKeyPair(1))

const stockVc = await createVerifiableCredentialJwt(
  {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: issuer.did,
      name: "John Doe",
    },
    issuanceDate: new Date().toISOString(),
    issuer: issuer.did,
  },
  issuer as Issuer
)

console.log(stockVc)
