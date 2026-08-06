/**
 * Utility functions for Travel Saathi application
 */

/**
 * Calculates reward points earned based on diary entries and uploaded photos.
 * @param {number} diaryCount - Total number of diary entries created.
 * @param {number} photoCount - Total number of photos uploaded.
 * @returns {number} Total reward points calculated.
 */
function calculateRewardPoints(diaryCount = 0, photoCount = 0) {
  const POINTS_PER_DIARY = 50;
  const POINTS_PER_PHOTO = 15;
  const BASE_SIGNUP_BONUS = 100;

  const diaryPoints = Math.max(0, diaryCount) * POINTS_PER_DIARY;
  const photoPoints = Math.max(0, photoCount) * POINTS_PER_PHOTO;

  return BASE_SIGNUP_BONUS + diaryPoints + photoPoints;
}

/**
 * Formats a currency amount into readable Indian Rupee (₹) format.
 * @param {number} amount - Amount in INR.
 * @returns {string} Formatted string e.g. "₹1,500"
 */
function formatCurrency(amount = 0) {
  const numericAmount = isNaN(amount) ? 0 : Math.round(amount);
  return `₹${numericAmount.toLocaleString('en-IN')}`;
}

/**
 * Formats an ISO or standard date string into a user-friendly format (e.g., "Aug 6, 2026").
 * @param {string|Date} dateInput 
 * @returns {string} Formatted date text.
 */
function formatTripDate(dateInput) {
  if (!dateInput) return 'N/A';
  const dateObj = new Date(dateInput);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Builds a prompt string for Google Gemini AI itinerary generation.
 * @param {string} destination 
 * @param {number} days 
 * @param {string} budgetLevel 
 * @returns {string} Prompt string formatted for Gemini API.
 */
function buildGeminiPrompt(destination, days = 3, budgetLevel = 'moderate') {
  const cleanDestination = (destination || 'a popular destination').trim();
  const cleanDays = Math.max(1, Math.min(days, 14));
  
  return `Act as an expert travel guide. Generate a structured ${cleanDays}-day travel itinerary for ${cleanDestination} with a ${budgetLevel} budget. Include key attractions, local food recommendations, and vibe summary in valid JSON format.`;
}

module.exports = {
  calculateRewardPoints,
  formatCurrency,
  formatTripDate,
  buildGeminiPrompt,
};
