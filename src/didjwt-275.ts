import {
  DIDResolutionOptions,
  DIDResolutionResult,
  ParsedDID,
  Resolvable,
  Resolver,
  ResolverRegistry
} from 'did-resolver'

import { getResolver } from '@ayanworks/polygon-did-resolver';
import { verifyCredential } from "did-jwt-vc";

export function PolyGetResolver() {
  async function resolve(
    did: string,
    parsed: ParsedDID,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _unused: Resolvable,
    options: DIDResolutionOptions
  ): Promise<DIDResolutionResult> {
    // console.log(parsed)
    // {method: 'mymethod', id: 'abcdefg', did: 'did:mymethod:abcdefg/some/path#fragment=123', path: '/some/path',
    // fragment: 'fragment=123'}
    const polyResolver = getResolver();
    const resolver = new Resolver(polyResolver as ResolverRegistry);
    try {
      const didResolutionResult = await resolver.resolve(did) as any;
      if (!didResolutionResult) {
        throw new Error('Failed to resolve DID');
      }

      return {
        didDocument: JSON.parse(didResolutionResult.didDocument),
        didDocumentMetadata: didResolutionResult.didDocumentMetadata,
        didResolutionMetadata: didResolutionResult.didResolutionMetadata
      }
    } catch (error) {
      throw error;
    }
  }

  return { polygon: resolve }
}


const vcJwt = 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImRlZ3JlZSI6eyJ0eXBlIjoiQmFjaGVsb3JEZWdyZWUiLCJuYW1lIjoiQmFjY2FsYXVyw6lhdCBlbiBtdXNpcXVlcyBudW3DqXJpcXVlcyJ9fX0sInN1YiI6ImRpZDpwb2x5Z29uOnRlc3RuZXQ6MHg5MjBCNTdFNjdjZWViNWRkMTc1MTNENWY1ODZlNDgyNzI3ZTI1NGQxIiwibmJmIjoxNTYyOTUwMjgyLCJpc3MiOiJkaWQ6cG9seWdvbjp0ZXN0bmV0OjB4RkFmQTZEZjg2NzBlZDAyRDY2RjFEQ2YzRDY1QTY2RTg3OUNmRTg0MyJ9.yVx01U0DlkqomOMDbHRQ31bjG8rzEPkMtZu5h7leDSdZ-kbd1qauzjzfiQKPxSEMlDGWJNAGepK71Tdt3mTNAA'

// getResolver is not using the latest did-resolver types and typescript is complaining
const resolver = new Resolver(PolyGetResolver());
const resolutionResult = await resolver.resolve('did:polygon:testnet:0xFAfA6Df8670ed02D66F1DCf3D65A66E879CfE843')
console.log('resolutionResult', resolutionResult)

const verificationStatus = await verifyCredential(vcJwt, resolver);
console.log(verificationStatus)

