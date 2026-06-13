/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const saveToLocalRegistry = (collection: string, data: any) => {
  try {
    const keyMap: { [key: string]: string } = {
      'job_applications': 'offline_job_applications',
      'interactive_consultations': 'offline_interactive_consultations',
      'floating_consultations': 'offline_floating_consultations',
      'faq_consultations': 'offline_faq_consultations',
      'budget_rfps': 'offline_budget_rfps',
      'newsletter_signups': 'offline_newsletter_signups'
    };

    const storageKey = keyMap[collection];
    if (!storageKey) {
      console.warn(`Collection ${collection} not mapped to local storage.`);
      return;
    }

    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = [data, ...existing];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    console.log(`Saved record to ${storageKey}`);
  } catch (e) {
    console.error('Error saving to local storage:', e);
  }
};
