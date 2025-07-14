import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!prompt || !apiKey) {
      return NextResponse.json(
        { error: 'Missing prompt or API key' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert web developer creating modern, responsive websites for Walrus Sites (decentralized hosting on Sui blockchain). 

Generate a complete, production-ready website based on the user's prompt. The website should be:
- Modern and visually stunning
- Fully responsive (mobile, tablet, desktop)
- Use modern CSS (flexbox, grid, animations)
- Include interactive JavaScript features
- Be optimized for performance
- Use semantic HTML
- Have proper meta tags and SEO

Return the response in the following JSON format:
{
  "html": "complete HTML document",
  "css": "complete CSS styles", 
  "js": "complete JavaScript code",
  "assets": {},
  "metadata": {
    "title": "site title",
    "description": "site description",
    "theme": "light/dark",
    "responsive": true
  }
}

Focus on creating magical, interactive experiences with smooth animations and modern design patterns.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Create a website: ${prompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Claude API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    // Parse the JSON response from Claude
    try {
      const siteData = JSON.parse(content);
      return NextResponse.json(siteData);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      return NextResponse.json(
        { error: 'Invalid response format from Claude' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 