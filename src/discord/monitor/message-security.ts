/**
 * Discord message input security wrapper.
 *
 * This module provides security enhancements for Discord message processing,
 * including suspicious pattern detection and content wrapping for untrusted sources.
 */

import type { Message } from "@buape/carbon";
import { logVerbose } from "../../globals.js";
import { detectSuspiciousPatterns, wrapExternalContent } from "../../security/external-content.js";

export type SecurityCheckResult = {
  /** Whether the message should be wrapped with security boundaries */
  shouldWrap: boolean;
  /** Detected suspicious patterns */
  suspiciousPatterns: string[];
  /** Security-wrapped content (if shouldWrap is true) */
  wrappedContent?: string;
  /** Severity level */
  severity: "none" | "low" | "medium" | "high";
};

export type MessageSecurityContext = {
  /** Discord message object */
  message: Message;
  /** Message text content */
  text: string;
  /** Sender user ID */
  senderId: string;
  /** Sender username */
  senderUsername: string;
  /** Whether this is a direct message */
  isDirectMessage: boolean;
  /** Whether this is a guild message */
  isGuildMessage: boolean;
  /** Channel or group subject */
  groupSubject?: string;
  /** List of trusted user IDs */
  trustedUsers?: string[];
};

/**
 * Performs security checks on Discord message content.
 *
 * @param ctx - Message security context
 * @returns Security check result with wrapping recommendation
 */
export function checkMessageSecurity(ctx: MessageSecurityContext): SecurityCheckResult {
  const { text, senderId, senderUsername, isDirectMessage, groupSubject, trustedUsers = [] } = ctx;

  // Check if sender is trusted
  const isTrusted = trustedUsers.includes(senderId);

  // Detect suspicious patterns
  const suspiciousPatterns = detectSuspiciousPatterns(text);
  const hasSuspiciousContent = suspiciousPatterns.length > 0;

  // Determine severity
  let severity: SecurityCheckResult["severity"] = "none";
  if (hasSuspiciousContent) {
    // High severity: multiple patterns or critical patterns
    const criticalPatterns = suspiciousPatterns.filter(
      (p) =>
        p.includes("exec") ||
        p.includes("elevated") ||
        p.includes("rm\\s+-rf") ||
        p.includes("delete\\s+all"),
    );

    if (criticalPatterns.length > 0 || suspiciousPatterns.length >= 3) {
      severity = "high";
    } else if (suspiciousPatterns.length >= 2) {
      severity = "medium";
    } else {
      severity = "low";
    }
  }

  // Decide whether to wrap content
  // Wrap if:
  // 1. Not a direct message AND sender is not trusted
  // 2. OR has suspicious patterns (regardless of trust level)
  const shouldWrap = (!isDirectMessage && !isTrusted) || hasSuspiciousContent;

  let wrappedContent: string | undefined;
  if (shouldWrap) {
    wrappedContent = wrapExternalContent(text, {
      source: "webhook",
      sender: `${senderUsername} (${senderId})`,
      subject: groupSubject,
      includeWarning: hasSuspiciousContent, // Only include warning if suspicious
    });
  }

  return {
    shouldWrap,
    suspiciousPatterns,
    wrappedContent,
    severity,
  };
}

/**
 * Logs security events for monitoring and auditing.
 *
 * @param event - Security event details
 */
export function logSecurityEvent(event: {
  messageId: string;
  senderId: string;
  senderUsername: string;
  channelId: string;
  severity: "low" | "medium" | "high";
  patterns: string[];
  preview: string;
}) {
  const { messageId, senderId, senderUsername, channelId, severity, patterns, preview } = event;

  const logMessage = [
    `discord security: [${severity.toUpperCase()}]`,
    `message=${messageId}`,
    `channel=${channelId}`,
    `sender=${senderUsername} (${senderId})`,
    `patterns=[${patterns.join(", ")}]`,
    `preview="${preview.substring(0, 100).replace(/\n/g, "\\n")}"`,
  ].join(" ");

  logVerbose(logMessage);

  // TODO: Write to dedicated security log file
  // TODO: Send alerts for high-severity events
}

/**
 * Applies security wrapping to message text if needed.
 *
 * This is the main entry point for Discord message security processing.
 *
 * @param ctx - Message security context
 * @returns Processed text (wrapped if necessary) and security metadata
 */
export function applyMessageSecurity(ctx: MessageSecurityContext): {
  processedText: string;
  wasWrapped: boolean;
  severity: SecurityCheckResult["severity"];
  suspiciousPatterns: string[];
} {
  const securityCheck = checkMessageSecurity(ctx);

  // Log security events
  if (securityCheck.suspiciousPatterns.length > 0) {
    logSecurityEvent({
      messageId: ctx.message.id,
      senderId: ctx.senderId,
      senderUsername: ctx.senderUsername,
      channelId: ctx.message.channelId,
      severity: securityCheck.severity as "low" | "medium" | "high",
      patterns: securityCheck.suspiciousPatterns,
      preview: ctx.text,
    });
  }

  return {
    processedText:
      securityCheck.shouldWrap && securityCheck.wrappedContent
        ? securityCheck.wrappedContent
        : ctx.text,
    wasWrapped: securityCheck.shouldWrap,
    severity: securityCheck.severity,
    suspiciousPatterns: securityCheck.suspiciousPatterns,
  };
}
