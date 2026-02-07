function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// random helper
function randomPick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function askAI(prompt: string) {
  // fake thinking time (1.5–3s random)
  await sleep(1500 + Math.random() * 1500);

  const summaries = [
    `• Explains core concepts and fundamentals clearly
• Covers important definitions and terminology
• Includes practical examples for better understanding
• Highlights real-world applications
• Focuses on key exam-relevant topics`,

    `• Introduces the main principles of the subject
• Breaks down complex ideas into simple steps
• Demonstrates concepts using case studies
• Emphasizes problem-solving techniques
• Summarizes important takeaways for revision`,

    `• Provides theoretical background and foundations
• Discusses methodologies and processes
• Shows implementation strategies
• Lists advantages and limitations
• Ends with concise conclusions and insights`
  ];

  return randomPick(summaries);
}
