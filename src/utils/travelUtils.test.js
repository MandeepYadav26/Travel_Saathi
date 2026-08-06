const assert = require('node:assert');
const {
  calculateRewardPoints,
  formatCurrency,
  formatTripDate,
  buildGeminiPrompt,
} = require('./travelUtils');

console.log('Running travelUtils test suite...');

// Test 1: calculateRewardPoints
{
  const points = calculateRewardPoints(2, 4);
  // Base 100 + 2*50 + 4*15 = 100 + 100 + 60 = 260
  assert.strictEqual(points, 260, 'Reward points calculation failed for valid inputs');
  assert.strictEqual(calculateRewardPoints(0, 0), 100, 'Base bonus should be 100');
  console.log('✔ calculateRewardPoints passed');
}

// Test 2: formatCurrency
{
  assert.strictEqual(formatCurrency(1500), '₹1,500', 'Currency formatting failed for 1500');
  assert.strictEqual(formatCurrency(0), '₹0', 'Currency formatting failed for 0');
  assert.strictEqual(formatCurrency('abc'), '₹0', 'Currency formatting failed for NaN input');
  console.log('✔ formatCurrency passed');
}

// Test 3: formatTripDate
{
  const formatted = formatTripDate('2026-08-06');
  assert.ok(formatted.includes('2026'), 'Date formatting failed to include year');
  assert.strictEqual(formatTripDate(null), 'N/A', 'Null date check failed');
  assert.strictEqual(formatTripDate('invalid-date'), 'Invalid Date', 'Invalid date check failed');
  console.log('✔ formatTripDate passed');
}

// Test 4: buildGeminiPrompt
{
  const prompt = buildGeminiPrompt('Goa', 4, 'budget');
  assert.ok(prompt.includes('4-day travel itinerary for Goa'), 'Prompt building failed for Goa');
  assert.ok(prompt.includes('budget budget'), 'Prompt building failed to include budget');
  console.log('✔ buildGeminiPrompt passed');
}

console.log('All travelUtils tests passed successfully! 🎉');
