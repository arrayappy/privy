import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = test();
    res.status(200).json(result);
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: 'Failed to perform test' });
  }
}

function test() {
  return {
    message: "Hello World"
  };
} 