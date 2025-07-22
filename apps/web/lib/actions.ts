"use server";

import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PlannerPreferences, Itinerary, Activity } from '../types/types';
import { verifyAndEnrichItinerary } from './googlePlacesService';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { 
        type: Type.STRING,
        description: "The city or area of the travel plan, e.g., 'Tokyo, Japan'."
    },
    weatherForecast: {
      type: Type.ARRAY,
      description: "An array of daily weather forecasts for the trip duration.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "The day number of the trip." },
          condition: { type: Type.STRING, enum: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'], description: "The expected weather condition." },
          highTemp: { type: Type.INTEGER, description: "The high temperature in Celsius." },
          lowTemp: { type: Type.INTEGER, description: "The low temperature in Celsius." },
        },
        required: ["day", "condition", "highTemp", "lowTemp"]
      }
    },
    flightOptions: {
      type: Type.ARRAY,
      description: "An array of 2-3 sample flight options from the departure city to the destination.",
      items: {
        type: Type.OBJECT,
        properties: {
          airline: { type: Type.STRING, description: "The name of the airline." },
          departureTime: { type: Type.STRING, description: "Departure time in 24-hour format (HH:mm)." },
          arrivalTime: { type: Type.STRING, description: "Arrival time in 24-hour format (HH:mm)." },
          duration: { type: Type.STRING, description: "Total flight duration, e.g., '8h 30m'." },
          price: { type: Type.NUMBER, description: "Estimated price in USD." },
          bookingUrl: { type: Type.STRING, description: "A complete, functional Google Flights URL for booking." },
        },
        required: ["airline", "departureTime", "arrivalTime", "duration", "price", "bookingUrl"]
      }
    },
    itinerary: {
      type: Type.ARRAY,
      description: "An array of activities for the itinerary.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "The day number of the trip (starting from 1)." },
          title: { type: Type.STRING, description: "The title of the activity." },
          description: { type: Type.STRING, description: "A brief description of the activity." },
          category: { 
            type: Type.STRING, 
            enum: ['Food', 'Entertainment', 'Culture', 'Outdoor', 'Shopping', 'Other'],
            description: "The category of the activity."
          },
          startTime: { type: Type.STRING, description: "The start time in 24-hour format (HH:mm)." },
          durationHours: { type: Type.NUMBER, description: "The estimated duration of the activity in hours." },
          localTip: { type: Type.STRING, description: "A helpful local tip for the activity." },
          latitude: { type: Type.NUMBER, description: "The latitude coordinate of the activity location." },
          longitude: { type: Type.NUMBER, description: "The longitude coordinate of the activity location." },
          placeId: { type: Type.STRING, description: "Leave this empty string if you cannot find a real, specific place. The Google Maps Place ID will be populated later through verification." },
          rating: { type: Type.NUMBER, description: "A numerical rating for the location, e.g., 4.5." },
          ratingCount: { type: Type.INTEGER, description: "The number of reviews or ratings, e.g., 954." },
        },
        required: ["day", "title", "description", "category", "startTime", "durationHours", "latitude", "longitude", "localTip", "rating", "ratingCount"]
      }
    }
  },
  required: ["destination", "weatherForecast", "flightOptions", "itinerary"]
};

export const generateItineraryIdeas = async (preferences: PlannerPreferences): Promise<Itinerary> => {
  const prompt = `
    You are an expert travel planner. Create a detailed travel itinerary based on the following preferences:
    - Destination: ${preferences.destination}
    - Departure City: ${preferences.departureCity}
    - Duration: ${preferences.duration} days
    - Start Date: ${preferences.startDate}
    - Pace: ${preferences.pace}
    - Group Type: ${preferences.group}
    - Interests: ${preferences.interests}
    - Budget: ${preferences.budget || 'Not specified'}

    Your response must be a single JSON object that strictly adheres to the provided schema.

    In addition to the daily activities, you MUST provide the following:
    1.  **Weather Forecast**: A 'weatherForecast' array with an entry for each day of the trip. Provide a realistic weather forecast for the destination and start date.
    2.  **Flight Options**: A 'flightOptions' array with 2-3 sample flights from the departure city. Generate realistic airline names, times, and prices. The 'bookingUrl' MUST be a valid, fully-formed Google Flights search URL.

    For the **itinerary activities**, this is the most critical part:
    - For each activity, suggest a **real, searchable place name or landmark** (e.g., "Eiffel Tower", "Louvre Museum", "local market in Downtown").
    - Provide an **estimated** latitude and longitude for the general area of the activity.
    - **If you cannot find a real, specific place for an activity, you MUST set the 'placeId' field to an empty string "".** Do NOT guess or reuse a Place ID.
    - Do NOT provide an 'imageUrl' field. This will be handled separately.
    - Generate a logical and engaging plan with realistic activities for the destination.
    - Geographically cluster activities for each day to minimize travel time.
    - Ensure start times are sequential and realistic.
    - Provide realistic 'rating' and 'ratingCount' estimates (these will be verified later).
    - Focus on suggesting real places that tourists can actually visit, even if you're not 100% certain of the exact details.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response text received from AI model");
    }

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    return parsedData as Itinerary;

  } catch (error) {
    console.error("Error generating itinerary:", error);
    // In case of an API error, return a structured error message or throw.
    throw new Error("Failed to generate itinerary. The AI model might be unavailable or the request may have been blocked.");
  }
};

/**
 * Main function that generates a complete, verified itinerary
 * This is the function you should call from your frontend
 */
export const generateItinerary = async (preferences: PlannerPreferences): Promise<Itinerary> => {
  console.log(`[Itinerary Generation] Starting generation for ${preferences.destination}`);
  
  try {
    // Step 1: Generate creative ideas from AI (unverified)
    console.log("[Itinerary Generation] Step 1: Generating ideas from AI...");
    const aiItinerary = await generateItineraryIdeas(preferences);
    
    // Step 2: Verify and enrich with real Google Places data
    console.log("[Itinerary Generation] Step 2: Verifying places with Google Places API...");
    const verifiedItinerary = await verifyAndEnrichItinerary(aiItinerary);
    
    console.log(`[Itinerary Generation] ✅ Generation complete! Final itinerary has ${verifiedItinerary.itinerary.length} verified activities.`);
    
    return verifiedItinerary;
  } catch (error) {
    console.error("[Itinerary Generation] Error in generateItinerary:", error);
    throw new Error(`Failed to generate verified itinerary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
