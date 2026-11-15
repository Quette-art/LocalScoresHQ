// A Firestore quota outage must not discard an otherwise valid website build.
export async function runPushScheduleSync(sync, warn = console.warn) {
  try {
    await sync();
  } catch (error) {
    if (error?.code !== 8 && error?.code !== "resource-exhausted" && error?.code !== "RESOURCE_EXHAUSTED") {
      throw error;
    }
    warn("Push schedule sync incomplete: Firebase quota exceeded. Website deployment can continue; notification delivery is not confirmed. The last saved snapshot is retained for the next sync.");
  }
}
