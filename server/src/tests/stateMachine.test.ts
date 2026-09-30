import { VerificationStateMachine, InvalidVerificationTransitionError } from '../domain/verification/verificationStateMachine.js';
import { VerificationStatus } from '../domain/verification/verificationStatus.js';

export function runStateMachineTests() {
  console.log('🧪 Starting Plax ID Verification State Machine Unit Tests...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Test Valid Sequential Lifecycle Transitions
  const validCases: Array<[VerificationStatus, VerificationStatus]> = [
    ['DRAFT', 'SUBMITTED'],
    ['SUBMITTED', 'PROCESSING'],
    ['PROCESSING', 'OCR_SCANNING'],
    ['OCR_SCANNING', 'BIOMETRIC_MATCH'],
    ['BIOMETRIC_MATCH', 'RISK_SCORING'],
    ['RISK_SCORING', 'APPROVED'],
    ['RISK_SCORING', 'MANUAL_REVIEW'],
    ['RISK_SCORING', 'REJECTED'],
    ['RISK_SCORING', 'FAILED'],
    ['MANUAL_REVIEW', 'APPROVED'],
    ['MANUAL_REVIEW', 'REJECTED'],
    ['FAILED', 'PROCESSING'], // Retry path
  ];

  console.log('--- 1. Testing Valid State Transitions ---');
  for (const [from, to] of validCases) {
    const isAllowed = VerificationStateMachine.canTransition(from, to);
    assert(isAllowed, `Valid transition '${from}' -> '${to}' should be allowed`);

    try {
      VerificationStateMachine.assertValidTransition(from, to);
      assert(true, `assertValidTransition('${from}', '${to}') did not throw error`);
    } catch (err) {
      assert(false, `assertValidTransition('${from}', '${to}') threw unexpected error: ${err}`);
    }
  }

  // 2. Test Invalid / Forbidden Transitions
  const invalidCases: Array<[VerificationStatus, VerificationStatus]> = [
    ['APPROVED', 'PROCESSING'],
    ['APPROVED', 'REJECTED'],
    ['APPROVED', 'SUBMITTED'],
    ['REJECTED', 'PROCESSING'],
    ['REJECTED', 'APPROVED'],
    ['REJECTED', 'SUBMITTED'],
    ['SUBMITTED', 'APPROVED'],
    ['SUBMITTED', 'REJECTED'],
    ['PROCESSING', 'APPROVED'],
    ['OCR_SCANNING', 'APPROVED'],
    ['BIOMETRIC_MATCH', 'APPROVED'],
  ];

  console.log('\n--- 2. Testing Invalid / Forbidden State Transitions ---');
  for (const [from, to] of invalidCases) {
    const isAllowed = VerificationStateMachine.canTransition(from, to);
    assert(!isAllowed, `Forbidden transition '${from}' -> '${to}' was correctly denied`);

    try {
      VerificationStateMachine.assertValidTransition(from, to);
      assert(false, `assertValidTransition('${from}', '${to}') should have thrown InvalidVerificationTransitionError`);
    } catch (err: any) {
      const isCorrectType = err instanceof InvalidVerificationTransitionError;
      assert(isCorrectType, `assertValidTransition('${from}', '${to}') threw InvalidVerificationTransitionError`);
    }
  }

  // 3. Test Terminal State Rules
  console.log('\n--- 3. Testing Terminal State Rules ---');
  const approvedNextStates = VerificationStateMachine.getValidNextStates('APPROVED');
  assert(approvedNextStates.length === 0, `APPROVED terminal state has 0 valid next transitions (Actual: ${approvedNextStates.length})`);

  const rejectedNextStates = VerificationStateMachine.getValidNextStates('REJECTED');
  assert(rejectedNextStates.length === 0, `REJECTED terminal state has 0 valid next transitions (Actual: ${rejectedNextStates.length})`);

  // 4. Test Invalid / Unknown Status
  console.log('\n--- 4. Testing Unknown / Malformed Status Handling ---');
  const unknownAllowed = VerificationStateMachine.canTransition('UNKNOWN' as any, 'APPROVED');
  assert(!unknownAllowed, `Unknown status 'UNKNOWN' -> 'APPROVED' is safely denied`);

  console.log(`\n📊 State Machine Test Summary: ${passed} PASSED, ${failed} FAILED`);
  if (failed > 0) {
    throw new Error(`State machine unit tests failed with ${failed} failure(s).`);
  }
}

// Execute tests if executed directly via node/tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  runStateMachineTests();
}
