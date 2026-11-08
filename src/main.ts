// UI controller for src/main.ts
import { processInput } from './tool.ts';
import { initTheme } from './theme.ts';
import { initModals } from './modals.ts';
import { showToast } from './toast.ts';
import { auditCookies } from './cookies.ts';
import { auditVault } from './vault.ts';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initModals();
  auditCookies();
  auditVault();

  const inputEl = document.querySelector('#app-input') as HTMLTextAreaElement;
  const processBtn = document.querySelector('#action-process') as HTMLButtonElement;
  const clearBtn = document.querySelector('#action-clear') as HTMLButtonElement;
  const copyBtn = document.querySelector('#action-copy') as HTMLButtonElement;
  const outputRegion = document.querySelector('#output-region') as HTMLElement;

  processBtn.addEventListener('click', () => {
    const input = inputEl.value.trim();
    if (!input) {
      showToast('Please enter input');
      return;
    }
    const res = processInput(input);
    if (res.success) {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = res.data;
      pre.appendChild(code);
      outputRegion.innerHTML = '';
      outputRegion.appendChild(pre);
      if (res.warnings && res.warnings.length) {
        const warnDiv = document.createElement('div');
        warnDiv.className = 'warnings';
        warnDiv.textContent = 'Warnings: ' + res.warnings.join('; ');
        outputRegion.appendChild(warnDiv);
      }
      showToast('Completed successfully!');
    } else {
      outputRegion.textContent = 'Error: ' + (res.error || 'Processing failed');
      showToast('Error: ' + (res.error || 'Processing failed'));
    }
  });

  clearBtn.addEventListener('click', () => {
    inputEl.value = '';
    outputRegion.innerHTML = '';
  });

  copyBtn.addEventListener('click', async () => {
    const text = outputRegion.textContent || '';
    if (!text) {
      showToast('Nothing to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!');
    } catch (e) {
      showToast('Copy failed');
    }
  });
});

