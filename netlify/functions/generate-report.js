const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    const { productType, ingredients, region } = JSON.parse(event.body);

    // Access your API key (securely stored in Netlify Environment Variables)
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Gemini API key not configured." })
        };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using a faster model for text and structured output

    const prompt = `
        Generate a data-driven, credible, and visually compelling innovation report.
        Product Type: ${productType}
        Ingredients: ${ingredients}
        Region: ${region}

        ---

        # Report Structure & Instructions

        ## Innovation Focus
        - Type of Innovation = ${productType}
        - Ingredients = ${ingredients}
        - Region Focus = ${region}

        ---

        NOTE - VERY IMPORTANT
        1. If a single ingredients is selected then use that one ingredient for the analysis.
        2. IF Two or more ingredients are combined then evaluate by combining 2 or more ingredients selected.
        3. Each analysis should focus on the local region based on the country selected. If global then it will be a general analysis.

        SECTION 1 : GENERAL LANDSCAPE
        Research and write up 5 prominent headlines.

        SECGTION 2 : INGREDIENT Digital Market Strength
        - For the ingredient or combined ingredients selected:
          - Total social media mentions within past 12 months
          - Overall sentiment (positive %, neutral %, negative %)
          - Strength of single Ingredient or multiple ingredients combined combo - If more than 1500 mentions within past 12 months then strong.
          - Platforms analyzed (Analyze and write for each platform):
        TikTok
        Instagram
        Twitter
        Reddit
        Facebook
        Forums
        Trend-Based Websites
        Other Sources

        Include citations where possible (e.g., TikTok, Statista, Reddit thread, Google Trends, etc.)


        SECTION 3 - Cross-Platform Trend Insights (Last 12 Months)
        Summarize 5 most prominent trends across the platforms above.
        Use bullets. Keep it quantitative and focused on emerging consumer preferences.

        SECTION 4 - Existing Market Landscape
        - List 2–3 existing snack/beverage products that exists which have the ingredients.
        - Show sales, market size or estimated units if available for each product
        - Add sources or benchmarks (Statista, Mintel, public reports, or GPT-generated reference estimate)


        SECTION 5 - High-Strength Innovation Opportunities
        Generate 5 unique ideas (new concepts)

        VERY IMPPRTANT.
        FOR EACH IDEA SHOW THE BELOW INFORMATION WITHIN EACH CONCEPT. EACH CONCEPT SHOULD HAVE SECTION A TO SECTION D.

        Section A
        - Product Name + Description
        - Estimated annual unit sales by segment. Validate why the estimates could be accurate. We need to provide fact based valid information. If cannot find fact based information then answer NA.

          | Segment       | Est. Units/Year |
          |--------------|-----------------|
          | Gen Alpha    |                 |
          | Gen Z        |                 |
          | Millennials  |                 |
          | Gen X        |                 |
          | Boomers      |                 |
          | Male         |                 |
          | Female       |                 |

        Section B
        - Top 5 Countries this concept will be succesful (ranked by popularity potential)
        - Estimated global units/year
        - Key Functional Benefits (e.g., energy, focus, gut health)
        - Key Emotional Benefits (e.g., indulgence, nostalgia, fun)
        - Flavor & Texture Highlights
        - Positioning Angle or Tagline

        Section C

        ## Market Gaps & Strategic Opportunities
        Identify whitespace opportunities:
        - Unmet Flavor Profiles
        - Holistic Wellness Integrations
        - Missing Consumption Occasions (e.g., post-work, study breaks)
        - Texture Innovations

        Section D

        ## Visual Generation (Image Required) - DO NOT GENERATE IMAGE PROMPTS. GENERATE VISUALLY APPEALING CONCEPT IMAGES.
        For each of the 5 product ideas:
        - Create an artistic and photorealistic image of the **final packaged snack or beverage**
        - Ensure it reflects the *ingredient profile*, *target audience*, and *trend aesthetic*
        - Use modern packaging cues that would appeal on social media


        SECTION 6 - Data Confidence & Source Attribution
        Include the following statement at the end of the report:

        Data Confidence & Source Attribution
        All estimates in this report are based on real-time social media listening, keyword trend analytics, and comparative market modeling. Sources may include TikTok, Reddit, Statista, Google Trends, Euromonitor, Mintel, and public brand data. Forecasts are directional and intended to guide innovation decisions. Whenever a statistic or trend is cited, include the source in brackets like *(TikTok Hashtag Tracker, 2025)*.

        ---

        SECTION 7 - Final Summary
        End the report with a 5-point summary of the most important insights within the report generated:
        - Top ingredient opportunities
        - Best product idea
        - Strongest demographic match
        - Most promising countries
        - Key whitespace innovation gap

        ---


        SECTION 8 - Follow-Up Explorer (Clickable Questions Only)
        End with 8 questions, split into two categories:

        ### Information-Based
        - Compare snack vs. beverage potential for the same ingredients
        - Show historical trend curve for this ingredient
        - Add competitor case studies
        - Explore ingredient sentiment by platform

        ### Innovation-Based
        - Generate a celebrity-endorsed version
        - Create a subscription box experience
        - Add dual flavor twist
        - Include sensory experience (scent/sound/touch)

        NOTE - Make each question clickable. OnClick it automatically transfer the questions as a prompt in the backend and continues the conversation.

        Your response should be formatted as a full, complete innovation report, following all the sections and instructions above. Do not include any conversational text outside of the report itself. For image generation, just provide the image URL from the Google Generative AI response.
        `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // The 'text' contains the full report, including image URLs.
        // We just send this back to the client.
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ report: text })
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate report from Gemini API. " + error.message })
        };
    }
};
