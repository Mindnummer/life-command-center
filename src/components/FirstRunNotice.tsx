import { useState } from 'react';
import { FIRST_RUN_KEY } from '../constants';

/** One-time privacy briefing shown before first use. */
export default function FirstRunNotice() {
  const [accepted, setAccepted] = useState(() => localStorage.getItem(FIRST_RUN_KEY) === '1');
  if (accepted) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Privacy briefing">
      <div className="modal">
        <h2>Before you begin</h2>
        <p>
          This app is <strong>local-first</strong>. Everything you write is stored in this
          browser on this device — no login, no cloud, no analytics, no tracking. Data leaves
          the device only when you export a JSON backup yourself.
        </p>
        <p className="modal-warn">
          Do <strong>not</strong> store passwords, account numbers, private keys, recovery
          codes, bank or card numbers, or sensitive customer records in this app. Encrypted
          Locked Thought Bubbles arrive in Phase 2; until then, treat every node as plain text
          on this device.
        </p>
        <p>
          Browser storage can be cleared by the browser or OS. Export a JSON backup regularly
          and keep it somewhere private — never in a public code repository.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {
            localStorage.setItem(FIRST_RUN_KEY, '1');
            setAccepted(true);
          }}
        >
          Understood — open the map
        </button>
      </div>
    </div>
  );
}
