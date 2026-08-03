import { randomBytes } from 'crypto';

export function generateProtocolNumber(): string {
  const year = new Date().getFullYear();
  const randomChars = randomBytes(4)
    .toString('hex')
    .toUpperCase()
    .slice(0, 8);
  return `BE-${year}-${randomChars}`;
}
