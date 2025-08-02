const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    const { productType, ingredients, region } = JSON.parse(event.body);

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Gemini API key not configured." })
        };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    // Use an image generation model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-preview-image-generation" });

    // The user's new prompt, modified to request image generation
    const prompt = `
        You are an expert in social media listening, emerging food & beverage trends, and high-potential product innovation.
        
        Your task is to generate a **visually clear, data-driven, and innovation-focused report** based on the following inputs:
        
        - Product Type: ${productType}
        - Ingredients: ${ingredients}
        - Region: ${region}
        
        ---
        
        # 📘 Innovation Report Structure
        
        Use bold headers and concise formatting to make it easy to scan. Follow this exact format:
        
        ---
        
        ## ✅ Innovation Focus
        
        - Type of Innovation = ${productType}
        - Ingredients = ${ingredients}
        - Region Focus = ${region}
        
        ---
        
        ## 🌐 Section 1: General Landscape
        
        Provide **5 brief headlines** about the regional or global opportunity landscape related to the product type or ingredients. Use real or modeled data from credible trend or market sources. Keep it impactful.
        
        ---
        
        ## 📈 Section 2: Ingredient Digital Market Strength
        
        For the selected ingredient(s), provide:
        - Total social media mentions in the past 12 months
        - Overall sentiment (positive %, neutral %, negative %)
        - If >1500 mentions → label it “Strong”
        - Analyze separately per platform:
          - TikTok
          - Instagram
          - Twitter
          - Reddit
          - Facebook
          - Forums
          - Trend websites
          - Other (if notable)
        
        Use source brackets like *(Tastewise, 2025)* where possible.
        
        ---
        
        ## 🔥 Section 3: Cross-Platform Trend Insights (Last 12 Months)
        
        Summarize **5 key trend bullets** across platforms that highlight:
        - Emerging consumer preferences
        - Popular behaviors
        - Content trends
        - Unexpected shifts
        
        Make each bullet **quantitative + insightful**.
        
        ---
        
        ## 🏪 Section 4: Existing Market Landscape
        
        List 2–3 existing products using the ingredient(s):
        - Product name + description
        - Estimated unit sales or size
        - Source or modeled estimate
        
        Use bullet format. Focus on relevance, not generality.
        
        ---
        
        ## 🚀 Section 5: High-Strength Innovation Opportunities
        
        In Section 5, generate **5 full product concepts**, each with its own labeled breakdown:
        **Concept 1, Concept 2, Concept 3, Concept 4, Concept 5**
        
        Each concept should have its own clearly labeled:
        
        - Section A – Product & Demographics
        - Section B – Appeal & Benefits
        - Section C – Market Gaps & Strategic Opportunities
        - Section D – Visual Packaging Description and Image
        
        
        ### 🧪 Section A – Product & Demographics
        
        - Product Name + 1-line Description
        - Estimated unit sales per segment:
        
          | Segment       | Est. Units/Year |
          |---------------|-----------------|
          | Gen Alpha     | ...             |
          | Gen Z         | ...             |
          | Millennials   | ...             |
          | Gen X         | ...             |
          | Boomers       | ...             |
          | Male          | ...             |
          | Female        | ...             |
        
        *Add a short justification for why these estimates are logical.*
        
        ---
        
        ### 🌍 Section B – Appeal & Benefits
        
        - Top 5 countries this will perform well in (ranked)
        - Global unit estimate
        - Functional Benefits
        - Emotional Benefits
        - Flavor & Texture Highlights
        - Tagline or Positioning Angle
        
        ---
        
        ### 🔍 Section C – Market Gaps & Strategic Opportunities
        
        Use bullets to identify:
        - Unmet flavor profiles
        - Holistic wellness integrations
        - Underserved consumption occasions
        - Texture gaps
        
        ---
        
        ### 🎨 Section D – Visual Packaging Description and Image
        
        **Generate a photorealistic image of the final packaged snack or beverage for this concept.**
        
        **VERY IMPORTANT:** Provide a brief, vivid description of the image first, and then include the image itself immediately after the description.
        
        ---
        
        ## 🔎 Section 6 – Data Confidence & Source Attribution
        
        Include the following paragraph:
        
        > All estimates are based on real-time social media listening, keyword analytics, and comparative modeling using tools such as TikTok, Reddit, Google Trends, Statista, Mintel, and public brand data. Forecasts are directional and intended to inspire innovation decisions. *(e.g., TikTok Hashtag Tracker, 2025)*
        
        ---
        
        ## 🧭 Section 7 – Final Summary
        
        List 5 quick takeaways:
        - Best ingredient opportunity
        - Most scalable product concept
        - Demographic group with highest demand
        - Most promising region
        - Most innovative whitespace to act on
        
        ---
        
        ## 💬 Section 8 – Follow-Up Explorer
        
        Provide **4 information-based** and **4 innovation-based** questions relevant to the report.
        Present each as a short clickable question (no explanation, no answer).
        
        Label them:
        - Information-Based
        - Innovation-Based
        
        Format each like:
        - [What’s the trend curve for Gen Z snacking habits?]
        - [Add a sparkling water version of concept 2]
        
        ---
        
        Your response should be formatted as a full, complete innovation report, following all the sections and instructions above. Do not include any conversational text outside of the report itself.
        `;

    try {
        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseModalities: ["TEXT", "IMAGE"],
            }
        });
        const response = result.response;
        
        const textPart = response.candidates[0].content.parts.find(p => p.text);
        const imageParts = response.candidates[0].content.parts.filter(p => p.inlineData && p.inlineData.mimeType.startsWith('image/'));

        const images = imageParts.map(part => `data:image/png;base64,${part.inlineData.data}`);
        
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                report: textPart ? textPart.text : '',
                images: images
            })
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate report from Gemini API. " + error.message })
        };
    }
};
