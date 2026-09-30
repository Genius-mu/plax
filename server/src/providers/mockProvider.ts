import { VerificationProviderResult, VerificationSubmissionPayload } from '../types/index.js';

export interface IVerificationProvider {
  name: string;
  processVerification(payload: VerificationSubmissionPayload): Promise<VerificationProviderResult>;
}

export class MockVerificationProvider implements IVerificationProvider {
  name = 'Sandbox Mock KYC Provider v2.0';

  async processVerification(payload: VerificationSubmissionPayload): Promise<VerificationProviderResult> {
    // Simulate realistic async document processing latency (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const scenario = payload.simulatedScenario || 'SUCCESS';

    switch (scenario) {
      case 'EXPIRED_DOC':
        return {
          ocrSuccess: true,
          documentNumber: payload.documentNumber,
          extractedFirstName: payload.firstName,
          extractedLastName: payload.lastName,
          extractedExpiryDate: '2023-01-15', // Expired
          livenessPassed: true,
          faceMatchScore: 95,
          rawSignals: [
            {
              code: 'EXPIRED_DOC',
              severity: 'HIGH',
              description: 'Identity document expired on Jan 15, 2023.',
            },
          ],
        };

      case 'NAME_MISMATCH':
        return {
          ocrSuccess: true,
          documentNumber: payload.documentNumber,
          extractedFirstName: 'Jonathan', // Mismatched from John
          extractedLastName: payload.lastName,
          extractedExpiryDate: '2028-12-31',
          livenessPassed: true,
          faceMatchScore: 88,
          rawSignals: [
            {
              code: 'NAME_MISMATCH',
              severity: 'MEDIUM',
              description: `Submitted name (${payload.firstName}) differs from extracted OCR document name (Jonathan).`,
            },
          ],
        };

      case 'LIVENESS_FAIL':
        return {
          ocrSuccess: true,
          documentNumber: payload.documentNumber,
          extractedFirstName: payload.firstName,
          extractedLastName: payload.lastName,
          extractedExpiryDate: '2029-05-20',
          livenessPassed: false,
          faceMatchScore: 32,
          rawSignals: [
            {
              code: 'LIVENESS_FAILED',
              severity: 'CRITICAL',
              description: 'Biometric selfie liveness check failed. Potential spoof attempt.',
            },
          ],
        };

      case 'HIGH_RISK_IP':
        return {
          ocrSuccess: true,
          documentNumber: payload.documentNumber,
          extractedFirstName: payload.firstName,
          extractedLastName: payload.lastName,
          extractedExpiryDate: '2030-08-10',
          livenessPassed: true,
          faceMatchScore: 92,
          rawSignals: [
            {
              code: 'HIGH_RISK_IP',
              severity: 'HIGH',
              description: 'Submission originating from known TOR exit node / high-risk proxy IP range.',
            },
          ],
        };

      case 'SUCCESS':
      default:
        return {
          ocrSuccess: true,
          documentNumber: payload.documentNumber,
          extractedFirstName: payload.firstName,
          extractedLastName: payload.lastName,
          extractedExpiryDate: '2031-10-25',
          livenessPassed: true,
          faceMatchScore: 98,
          rawSignals: [],
        };
    }
  }
}
