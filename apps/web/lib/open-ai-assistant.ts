export function openAiAssistant() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('portfolio:open-ai-assistant'))
  }
}
