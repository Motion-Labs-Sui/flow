import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { currentSite, refinementPrompt, apiKey } = await request.json();

    if (!currentSite || !refinementPrompt || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are refining an existing website. The user will provide the current website code and a refinement request. 

Modify the website according to the user's request while maintaining the overall structure and ensuring it remains production-ready.

Return the updated website in the same JSON format as before.`;

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
            content: `Current website:
HTML: ${currentSite.html}
CSS: ${currentSite.css}
JS: ${currentSite.js}

Refinement request: ${refinementPrompt}

Please update the website according to this request.`
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