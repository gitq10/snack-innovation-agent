import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiAPI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        const { productType, ingredients, region, followUpPrompt } = JSON.parse(event.body);

        let prompt;
        // Check if this is a follow-up prompt or an initial report request
        if (followUpPrompt) {
            prompt = followUpPrompt;
        } else {
            prompt = `
                Generate a detailed business innovation report with the following structure and formatting, based on the provided product details.

                **Report Title:** Coconut Snack Innovation in Mexico: A Data-Driven Report

                **SECTION 1: GENERAL LANDSCAPE**
                1. Mexican Coconut Consumption Surges: Demand for coconut-based products is experiencing significant growth in Mexico, driven by increasing health consciousness and a rising interest in exotic flavors.
                2. Social Media Fuels Coconut Craze: Online platforms showcase a vibrant community engaging with coconut-related content, indicating strong potential for innovative snack products.
                3. Coconut's Versatility Drives Innovation: Mexico's rich culinary heritage provides ample opportunity to develop unique coconut-based snacks catering to diverse preferences.
                4. Health & Wellness Trends Boost Coconut Appeal: Consumers are increasingly seeking healthy and natural snacks, creating a strong market for coconut products emphasizing nutritional benefits.
                5. Sustainable Sourcing Key to Success: Growing consumer awareness of environmental and social responsibility necessitates a focus on sustainably sourced coconut ingredients.

                **SECTION 2: INGREDIENT Digital Market Strength**
                **Ingredient:** Coconut (Mexico-focused)
                **Total Social Media Mentions (Past 12 Months):** Estimated 20,000 (This is an estimate based on extrapolated data from available tools, precise numbers require dedicated social listening tools)
                **Overall Sentiment:**
                * Positive: 75%
                * Neutral: 20%
                * Negative: 5%
                **Strength:** Strong (over 1500 mentions)
                **Platforms Analyzed:**
                * **TikTok:** High engagement with coconut-based recipes and snack ideas. Many videos showcase homemade coconut treats. *(TikTok Hashtag Tracker, 2024)*. Estimated 10,000 mentions.
                * **Instagram:** Strong visual presence; many food bloggers and influencers feature coconut products and recipes. Estimated 5,000 mentions. *(Instagram Insights, 2024)*
                * **Twitter:** Moderate discussion regarding coconut's health benefits and uses in Mexican cuisine. Estimated 2,000 mentions. *(Twitter Analytics, 2024)*
                * **Reddit:** Smaller but engaged communities discussing coconut-related topics, including recipes and product reviews. Estimated 1,000 mentions. *(Reddit search results, 2024)*
                * **Facebook:** A mix of personal posts and business pages promoting coconut products. Estimated 2,000 mentions. *(Facebook Insights, 2024)*
                * **Forums:** Limited but targeted discussions on specialized cooking forums and health & wellness boards. (Various online forums, 2024) Estimated 0 mentions.
                * **Trend-Based Websites:** Blogs and news articles covering coconut trends in food and beverage. Estimated 0 mentions.

                **SECTION 3 - Cross-Platform Trend Insights (Last 12 Months)**
                * **Health & Wellness Focus:** Increased interest in natural, minimally processed coconut snacks with health benefits (e.g., high fiber, healthy fats).
                * **Exotic & Fusion Flavors:** Demand for unique flavor combinations blending coconut with traditional Mexican ingredients (e.g., chili, lime, chocolate).
                * **Sustainability & Ethical Sourcing:** Consumers prioritize brands committed to sustainable coconut farming practices and fair trade.
                * **Convenience & On-the-Go Consumption:** Preference for portable, easy-to-eat snacks ideal for busy lifestyles.
                * **Instagrammable Food:** visually appealing snacks that are photogenic and shareable on social media.

                **SECTION 4 - Existing Market Landscape**
                1. **Coco Rico Coconut Water:** While primarily a beverage, it shows market presence for coconut products in Mexico. Sales data not publicly available, but estimated market share is significant. *(Market estimates based on industry reports)*.
                2. **Various Coconut Candy Brands:** Several small and medium-sized businesses produce traditional coconut candies and sweets. Sales figures unavailable, but strong local market presence. *(Local market observations)*.
                3. **Coconut Flour-based Products:** Emerging niche market for baked goods using coconut flour, indicating a growing appreciation for versatile coconut applications. Sales data unavailable. *(Market observations)*.

                **SECTION 5 - High-Strength Innovation Opportunities**
                **Concept 1: Coco-Lime Bliss Bites**
                **Section A:**
                * **Product Name & Description:** Small, bite-sized coconut bars infused with zesty lime and a hint of chili. Provides a sweet, tart, and spicy flavor profile. | Segment | Est. Units/Year | Rationale | |--------------|-----------------|------------------------------------------------------------------------------------| | Gen Alpha | 100,000 | Appealing to kids with sweet and sour combination. | | Gen Z | 500,000 | Health-conscious consumers attracted to natural ingredients. | | Millennials | 750,000 | Versatile snack for various occasions. | | Gen X | 250,000 | Moderate consumption. | | Boomers | 100,000 | Less likely to consume a new niche snack. | | Male | 500,000 | Appeals to broader range of consumers. | | Female | 1,000,000 | Strong interest in healthy and flavorful snacks. |
                **Section B:**
                * **Top 5 Countries:** Mexico (1), USA (2), Canada (3), Spain (4), UK (5)
                * **Estimated Global Units/Year:** 2,000,000
                * **Key Functional Benefits:** Fiber, healthy fats.
                * **Key Emotional Benefits:** Indulgence, refreshment.
                * **Flavor & Texture Highlights:** Sweet, tart, spicy, chewy.
                * **Positioning Angle:** "A taste of Mexico in every bite."
                **Section C:**
                * **Unmet Flavor Profiles:** Unique blends of sweet, tart, and spicy.
                * **Holistic Wellness Integrations:** Could include added vitamins or antioxidants.
                * **Missing Consumption Occasions:** Afternoon pick-me-up, post-workout snack.
                * **Texture Innovations:** Exploring different textures (e.g., crispy, creamy).
                **Section D:**
                *(Image URL would be inserted here from Google Generative AI, depicting a package of Coco-Lime Bliss Bites)*
                **SECTION 6 - Data Confidence & Source Attribution**
                All estimates in this report are based on real-time social media listening, keyword trend analytics, and comparative market modeling. Sources may include TikTok, Reddit, Statista, Google Trends, Euromonitor, Mintel, and public brand data. Forecasts are directional and intended to guide innovation decisions. Whenever a statistic or trend is cited, the source is included.
                **SECTION 7 - Final Summary**
                1. Top Ingredient Opportunities: Coconut in its versatile forms (flakes, milk, flour) offers many possibilities.
                2. Best Product Idea: Coco-Lime Bliss Bites offer a unique blend of flavors and appeal to a broad demographic.
                3. Strongest Demographic Match: Millennials and Gen Z show the highest potential for adoption.
                4. Most Promising Countries: Mexico, the US, and Canada offer the strongest initial markets.
                5. Key Whitespace Innovation Gap: Creating unique flavor profiles and focusing on convenience are key opportunities.
                **SECTION 8 - Follow-Up Explorer (Clickable Questions Only)**
                **Information-Based:**
                * [Compare snack vs. beverage potential for the same ingredients]
                * [Show historical trend curve for this ingredient]
                * [Add competitor case studies]
                * [Explore ingredient sentiment by platform]
                **Innovation-Based:**
                * [Generate a celebrity-endorsed version]
                * [Create a subscription box experience]
                * [Add dual flavor twist]
                * [Include sensory experience (scent/sound/touch)]
            `;
        }

        const model = geminiAPI.getGenerativeModel({ model: "gemini-2.0-flash-preview-image-generation" });

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();
        const imagePart = result.response.parts.find(p => p.inlineData && p.inlineData.mimeType.startsWith('image/'));
        let image = null;

        if (imagePart) {
            image = {
                mimeType: imagePart.inlineData.mimeType,
                data: imagePart.inlineData.data,
            };
        }

        const report = {
            content: textResponse,
            image: image,
        };

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(report),
        };
    } catch (error) {
        console.error('Error in Netlify function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
