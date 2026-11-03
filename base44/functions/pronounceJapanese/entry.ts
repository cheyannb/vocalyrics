import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import OpenAI from 'npm:openai@4.104.0';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: 'Please sign in to hear pronunciation.' }, { status: 401 });
    const { text } = await req.json().catch(() => ({}));
    if (typeof text !== 'string' || !text.trim() || text.length > 200) {
      return Response.json({ error: 'Choose a word or lyric line of up to 200 characters.' }, { status: 400 });
    }
    const { baseURL, token, headers } = base44.asServiceRole.aiGateway.connection();
    const client = new OpenAI({ baseURL, apiKey: token, defaultHeaders: headers, maxRetries: 0, timeout: 60000 });
    const audio = await client.audio.speech.create({
      model: 'gpt_4o_mini_tts',
      input: text.trim(),
      voice: 'nova',
      response_format: 'mp3',
      language: 'ja',
      instructions: 'Read the supplied text only. Speak Japanese like a native Japanese speaker, with warm, natural conversational intonation and accurate pitch accent. Use a clear normal pace suitable for a language learner. Do not translate, explain, or add words.',
    });
    const file = new File([await audio.arrayBuffer()], 'pronunciation.mp3', { type: 'audio/mpeg' });
    const { file_uri } = await base44.asServiceRole.integrations.Core.UploadPrivateFile({ file });
    return Response.json({ file_uri });
  } catch (error) {
    console.error('Pronunciation generation failed:', error.message);
    return Response.json({ error: 'Pronunciation could not be generated. Please try again.' }, { status: 500 });
  }
}