import { RiskLevel, SignalSeverity, VerificationStatus } from '../types/index.js';

export interface EvaluatedRiskResult {
  riskScore: number;
  riskLevel: RiskLevel;
  recommendedStatus: VerificationStatus;
}

const SEVERITY_WEIGHTS: Record<SignalSeverity, number> = {
  LOW: 10,
  MEDIUM: 25,
  HIGH: 45,
  CRITICAL: 80,
};

export class RiskEngine {
  public static evaluate(signals: Array<{ severity: SignalSeverity }>, faceMatchScore: number, livenessPassed: boolean): EvaluatedRiskResult {
    let score = 0;

    // Add signal weights
    for (const sig of signals) {
      score += SEVERITY_WEIGHTS[sig.severity] || 15;
    }

    // Biometric penalty
    if (!livenessPassed) {
      score += 50;
    }

    if (faceMatchScore < 50) {
      score += 40;
    } else if (faceMatchScore < 75) {
      score += 20;
    }

    // Cap score at 100
    const finalScore = Math.min(Math.max(score, 0), 100);

    let riskLevel: RiskLevel = 'LOW';
    let recommendedStatus: VerificationStatus = 'APPROVED';

    if (finalScore >= 75) {
      riskLevel = 'CRITICAL';
      recommendedStatus = 'REJECTED';
    } else if (finalScore >= 45) {
      riskLevel = 'HIGH';
      recommendedStatus = 'REJECTED';
    } else if (finalScore >= 20) {
      riskLevel = 'MEDIUM';
      recommendedStatus = 'MANUAL_REVIEW';
    } else {
      riskLevel = 'LOW';
      recommendedStatus = 'APPROVED';
    }

    return {
      riskScore: finalScore,
      riskLevel,
      recommendedStatus,
    };
  }
}
