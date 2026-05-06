import FirecrawlApp from '@mendable/firecrawl-js';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../src/firebase.js';
import dotenv from 'dotenv';

dotenv.config();

// Support both naming conventions from the .env file
const apiKey = process.env.VITE_FIRECRAWL_API_KEY;

// Initialize Firecrawl
const firecrawl = new FirecrawlApp({
  apiKey: apiKey
});

const urls = [
  'https://unstop.com/competitions',
  'https://www.buddy4study.com/scholarships'
];

const prompt = 'Extract all active hackathons, scholarships, or competitions. Return as a JSON array with: title, organization, value (prize/stipend), deadline (YYYY-MM-DD), category, link, and location. For the deadline, extract it in exactly YYYY-MM-DD format; if only a month is given, assume the current year 2026. For location, extract the city (e.g., "Kochi", "Bangalore") or "Remote". Carefully categorize each item: if the title or description mentions "Internship", "Stipend", or "Work", set category to "Internships". If it mentions "Hackathon", "Coding Challenge", or "Build", set category to "Hackathons". If it mentions "Scholarship" or "Grant", set category to "Scholarships". Else set it to "Exams". The category MUST exactly match one of these: "Scholarships", "Internships", "Hackathons", "Exams".';

async function scrapeAndExtract() {
  console.log(`Starting Firecrawl extraction for ${urls.join(', ')}...`);
  let allData = [];

  try {
    const response = await firecrawl.extract({
      urls: urls,
      prompt: prompt,
      schema: {
        type: "object",
        properties: {
          opportunities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                organization: { type: "string" },
                value: { type: "string" },
                deadline: { type: "string", description: "Deadline in exactly YYYY-MM-DD format" },
                category: { 
                  type: "string", 
                  enum: ["Scholarships", "Internships", "Hackathons", "Exams"],
                  description: "Must be exactly one of: Scholarships, Internships, Hackathons, Exams"
                },
                link: { type: "string", description: "Registration or application link" },
                location: { type: "string", description: "City (e.g., Kochi, Bangalore) or Remote" }
              },
              required: ["title", "organization", "value", "deadline", "category", "link", "location"]
            }
          }
        },
        required: ["opportunities"]
      }
    });
    
    if (response.success && response.data) {
      console.log(`Successfully extracted data!`);
      // Try to find the array if it's wrapped
      if (response.data.opportunities && Array.isArray(response.data.opportunities)) {
        allData = response.data.opportunities;
      } else if (Array.isArray(response.data)) {
        allData = response.data;
      } else if (typeof response.data === 'object') {
        const keys = Object.keys(response.data);
        if (keys.length > 0 && Array.isArray(response.data[keys[0]])) {
           allData = response.data[keys[0]];
        }
      }
    } else {
      console.log(`No data extracted or failed. Response:`, response);
    }
  } catch (error) {
    console.error(`Error scraping:`, error.message);
  }
  
  if (allData.length > 0) {
    await seedDatabase(allData);
  } else {
    console.log("No data found to save.");
    process.exit(0);
  }
}

async function seedDatabase(dataArray) {
  console.log("\nStarting database seed...");
  try {
    const opportunitiesRef = collection(db, 'opportunities');
    let addedCount = 0;
    let skippedCount = 0;

    for (const item of dataArray) {
      // Check for duplicates by title
      const q = query(opportunitiesRef, where("title", "==", item.title));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Title doesn't exist, add it
        await addDoc(opportunitiesRef, {
          title: item.title,
          organization: item.organization || '',
          value: item.value || '',
          deadline: item.deadline || '',
          category: item.category || 'Hackathons',
          link: item.link || '',
          location: item.location || 'Remote',
          createdAt: new Date()
        });
        addedCount++;
        console.log(`Success: ${item.title} added`);
      } else {
        skippedCount++;
        console.log(`Skipped (Duplicate): ${item.title}`);
      }
    }
    console.log(`\nSuccessfully seeded ${addedCount} items. Skipped ${skippedCount} duplicates.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
  
  // Exit the process since Firebase Web SDK keeps connection open
  process.exit(0);
}

// Execute the scraper
scrapeAndExtract();
