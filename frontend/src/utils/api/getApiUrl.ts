export default function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL as string;
}
