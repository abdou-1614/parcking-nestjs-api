import ms from 'ms'
import { refreshTokenConfig } from './access-Jwt-Config'
export function getTokenExpirationDate(): Date {
    const expiresDays = ms(refreshTokenConfig.expiresIn as string) / 1000 / 60 / 60 /24

    const expireAt = addDaysFromNow(expiresDays)

    return expireAt
}

function addDaysFromNow(days: number): Date {
    const result = new Date()

    result.setDate(result.getDate() + days)

    return result
}